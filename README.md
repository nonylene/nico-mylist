# nico-mylist
mylist app with local db, for nico api v1.

## dependencies

- python >= 3.2

### pip
- bottle
- dateutil
- peewee
- jinja2

### deploy
1. install above packages
2. `python3 utils/setup_db.py`
3. `python3 app.py`

#### gunicorn
`gunicorn app:app --bind <address>`

### screenshot

<img src="https://cloud.githubusercontent.com/assets/7397316/10911987/ca1b69bc-828a-11e5-9fe1-c1a1e19379c1.png" height="400" />
