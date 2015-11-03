# /usr/bin/python3
# coding: utf-8

from bottle import get, post, request, jinja2_template as template
import dateutil.parser
import bottle
import peewee
import json
import datetime
import urllib.request as r
from os import path

import config

bottle.TEMPLATE_PATH.append(path.join(path.abspath(path.dirname(__file__)), 'templates/'))
db = peewee.SqliteDatabase(path.join(path.abspath(path.dirname(__file__)), 'main.db'))

class Mylist(peewee.Model):
    id = peewee.IntegerField(primary_key = True)
    smid = peewee.TextField(unique = True, null = False)
    category = peewee.TextField()
    date = peewee.DateTimeField()
    last_fetched_time = peewee.DateTimeField()
    json_text = peewee.TextField(db_column = "json")

    def json(self):
        if not self.json_text:
            self.fetch_json()
        return json.loads(self.json_text)

    def fetch_json(self):
        res_key = "nicovideo_video_response"
        api_url = config.NICO_API + self.smid
        self.json_text = r.urlopen(api_url).read().decode("utf-8")
        self.last_fetched_time = datetime.datetime.now()
        self.save()

    class Meta:
        database = db

@get('/static/<filepath:path>', name="static")
def static(filepath):
    return bottle.static_file(filepath, root="static/")

@get("/")
def index():
    category = request.GET.category
    if category in ['None', ''] : category = None

    if category == 'all':
        lists = Mylist.select().order_by(-Mylist.id)
    else:
        mylists = Mylist.select().where(Mylist.category == category).order_by(-Mylist.id)

    category_list = Mylist.select(peewee.fn.Distinct(Mylist.category))

    # video json object and mylist object
    ok_video_list = [(x[0]["video"], x[1])
        for x in zip([x.json()["nicovideo_video_response"] for x in mylists], mylists)
    if x[0]["@status"] == "ok"]

    return template("index.html",
            category_list = category_list,
            video_list = ok_video_list,
            category = category,
            url = bottle.url,
            parse = dateutil.parser.parse
    )

@post("/delete")
def delete():
    id = request.POST.id
    Mylist.get(Mylist.id == id).delete_instance()
    return '''
        <script type='text/javascript'>
          $('#info{0}').remove();
        </script>'''.format(id)

@post("/move")
def move():
    ids = json.loads(request.POST.id)
    cate = request.POST.category
    response = "<script type='text/javascript'>\n"
    for id in ids:
        mylist = Mylist.get(Mylist.id == id)
        mylist.category = cate
        mylist.save()
        response += "$('#info{0}').remove();\n".format(id)
    response += "</script>"
    return response

# subdirectory
app = bottle.Bottle()
app.mount(config.RUN_DIRECTORY, bottle.default_app())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
