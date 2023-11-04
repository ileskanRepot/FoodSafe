from time import time
from flask import Flask,jsonify,send_file

app = Flask(__name__)
# app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/localMap')
def localMap():
    return {"time":round(time())}

@app.route('/worldMap.json')
def worldMap():
    # return send_file("./test.geojson")
    return send_file("./worldMap.json")

@app.route('/dummyGeo.json')
def dummyGeo():
    return send_file("./Dummy_data.geojson")
    # return send_file("./worldMap.json")