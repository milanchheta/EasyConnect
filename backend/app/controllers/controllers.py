from flask import Blueprint,request,Response
from ..helpers.dbConfig import databaseSetup

dbObj = databaseSetup()
main = Blueprint('main', __name__)

# Register - Post
# Login - Post
# Home - GET
# Upload - POST
# USER Profile - GET, Researcher profile-GET
# Profile - PUT
# Logout - GET
# ChatList - GET
# Chat -server
# Connection request and accept request

# Collections:-

# users->{
#     full_name: string
#     email: string
#     password: string
#     scholars_link: url if any(verify before saving)
#     interests:[]
# }

# recommendations->{
#     user_id: id
#     keywords (based on interests or uploaded papers if any): []
#     researchers:[]
#     papers:[]??????
# }

# scholars->{
#     (Professor name):{title:[(Keywords)], interests:[], scholars_link:link },...
# }

# connected_users->{
#     user_id:[]
# }

# user_requests:{
# user_id: id
# requests:[{user_id:, user_name:},...]
# }

# user_messages->{
#     user_id: id
#     time: timestamp
#     user_name:
#     mesasge: string
# }

@main.route('/', methods = ['GET'])
def index():
    args=request.args
    resp = Response("Ok", status=200, mimetype='application/json')
    return resp


@main.route('/test', methods = ['GET'])
def test_connection():
    args=request.args
    resp = Response("EasyConnect server is up and working!", status=200, mimetype='application/json')
    return resp


@main.route('/register', methods = ['POST'])
def register_user():
    args=request.args
    resp = Response("register endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/login', methods = ['GET','POST'])
def login_user():
    args=request.args
    resp = Response("login endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/recommendations', methods = ['GET'])
def get_recommendations():
    args=request.args
    resp = Response("recommendations endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/profile', methods = ['GET'])
def get_user_profile():
    args=request.args
    resp = Response("profile endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/profile', methods = ['PUT'])
def update_user_profile():
    args=request.args
    resp = Response("profile endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/connect', methods = ['POST'])
def connect_user():
    args=request.args
    resp = Response("connect endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/isconnected', methods = ['GET'])
def get_connected_status():
    args=request.args
    resp = Response("isconnected endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/connect', methods = ['GET'])
def get_connected_list():
    args=request.args
    resp = Response("connect endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/message', methods = ['POST'])
def send_message():
    args=request.args
    resp = Response("message endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/message', methods = ['GET'])
def get_message():
    args=request.args
    resp = Response("message endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/requests', methods = ['GET'])
def get_connection_requests():
    args=request.args
    resp = Response("requests endpoint", status=200, mimetype='application/json')
    return resp

