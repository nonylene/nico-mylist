from bottle import Bottle, run, jinja2_template as template
import peewee
from os import path
import json
import urllib.request as r

import config

app = Bottle()
db = peewee.SqliteDatabase(path.join(path.abspath(path.dirname(__file__)), ('main.db')))

class Mylist(peewee.Model):
    id = peewee.IntegerField(primary_key = True)
    smid = peewee.TextField(unique = True)
    category = peewee.TextField()
    date = peewee.DateTimeField()
    last_fetched_time = peewee.DateTimeField()
    json = peewee.TextField()

    def data(self):
        if not self.json:
            res_key = "nicovideo_video_response"
            smurl = config.NICO_API + self.smid
            self.json = r.urlopen(smurl).read()
            self.save()
        return json.loads(self.json)

    class Meta:
        database = db
        db_name = "mylist"


@app.get("/")
def index(db):
    return

#run(app, host="0.0.0.0", port=8080, debug = True)

a = Mylist.get()
a.json = "aaaa"
a.update()
print(a.id)
print(a.smid)
print(a.category)
print(a.json)
