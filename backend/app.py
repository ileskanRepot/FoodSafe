from time import time
from flask import Flask,jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173","http://localhost:5000"])
# app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/localMap')
def localMap():
    return {"time":round(time())}
