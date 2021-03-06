# /usr/bin/python3
# coding: utf-8

from bottle import get, post, request, response, jinja2_template as template
import dateutil.parser
import bottle
import peewee
import json
import datetime
import re
import os

from . import config
from .model import Mylist


file_dir = os.path.abspath(os.path.dirname(__file__))

bottle.TEMPLATE_PATH.append(
        os.path.join(file_dir, 'templates/')
        )

@get('/static/<filepath:path>', name="static")
def static(filepath):
    return bottle.static_file(filepath, root="app/static/")

@get("/")
def index():
    category = request.GET.category
    if category in ['None', ''] : category = None

    if category == 'all':
        mylists = Mylist.select().order_by(-Mylist.id)
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
    response.content_type = "application/json"
    id = request.POST.id
    Mylist.get(Mylist.id == id).delete_instance()
    return success_msg(id)

@post("/move")
def move():
    response.content_type = "application/json"
    ids = json.loads(request.POST.id)
    cate = request.POST.category
    if cate == "None": cate = None
    for id in ids:
        mylist = Mylist.get(Mylist.id == id)
        mylist.category = cate
        mylist.save()
    return success_msg(ids)

@post("/reload")
def reload():
    response.content_type = "application/json"
    ids = json.loads(request.POST.id)
    for id in ids:
        mylist = Mylist.get(Mylist.id == id)
        mylist.fetch_json()
    return success_msg(ids)

@post("/add")
def add():
    response.content_type = "application/json"
    smid = request.POST.smid
    if not re.compile("(sm|nm)\d+").search(smid):
        response.status = 400
        return error_msg("Id must start with sm or nm!")
    if Mylist.select().where(Mylist.smid == smid).exists():
        response.status = 400
        return error_msg("You already added this id!")
    Mylist.create(smid = smid, date = datetime.datetime.now())
    return success_msg(smid)

def success_msg(message = None):
    return {"status": "success", "message": message}

def error_msg(message = None):
    return {"status": "error", "error_message": message}


# subdirectory
app = bottle.Bottle()
app.mount(config.RUN_DIRECTORY, bottle.default_app())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
