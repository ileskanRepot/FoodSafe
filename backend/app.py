from time import time
from flask import Flask,jsonify,send_file,render_template,send_from_directory

app = Flask(__name__)
# app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def main():
    return send_from_directory(".",path="leaflet.html")

@app.route('/app.js')
def appJs():
    return send_from_directory(".",path="app.js")

@app.route('/localMap')
def localMap():
    return {"time":round(time())}

@app.route('/worldMap.json')
def worldMap():
    return send_file("./worldMap.json")

@app.route('/dummyGeo.json')
def dummyGeo():
    return send_file("./Dummy_data.geojson")

@app.route('/vuln.csv')
def vuln():
    return send_file("./vuln.csv")

@app.route('/rat1.png')
def rat1():
    return send_file("./map_data/rats/rats_2022-02-11_-_2022-02-13.png")

@app.route('/rat2.png')
def rat2():
    return send_file("./map_data/rats/rats_2022-04-12_-_2022-04-14.png")

@app.route('/rat3.png')
def rat3():
    return send_file("./map_data/rats/rats_2022-05-12_-_2022-05-14.png")

@app.route('/home.png')
def house():
    return send_file("./home.png")

@app.route('/humidity.json')
def humidity():
    return send_file("./map_data/humidity/humidity_features_version2.geojson")
    # return send_file("./worldMap.json")