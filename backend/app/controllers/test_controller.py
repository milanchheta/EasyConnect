from flask import Blueprint,request,Response

main = Blueprint('main', __name__)

@main.route('/', methods = ['GET'])
def index():
    args=request.args
    
    resp = Response("This does work!", status=200, mimetype='application/json')
    return resp