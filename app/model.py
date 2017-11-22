import peewee
import json
import os
import datetime
import urllib.request as r

from . import config

file_dir = os.path.abspath(os.path.dirname(__file__))

db = peewee.SqliteDatabase(
    os.path.join(file_dir, 'data/main.db')
    )

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
