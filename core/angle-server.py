#!/usr/bin/python
# export FLASK_APP=core/server.py
# flask run --host=0.0.0.0 --reload # host for binding to outside  --reload for filemon
# http://0.0.0.0:5000/
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World 2016!!!'