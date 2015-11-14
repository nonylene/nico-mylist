import sqlite3
from os import path

conn = sqlite3.connect(path.join(path.abspath(path.dirname(__file__)), ('../main.db')))

sql = conn.cursor()
sql.execute("drop table if exists mylist")
sql.execute("""create table if not exists mylist (
    id int primary key autoincrement,
    smid text unique,
    category text,
    date timestamp,
    last_fetched_time timestamp,
    json text
    )""")
sql.close()

conn.commit()
conn.close()
