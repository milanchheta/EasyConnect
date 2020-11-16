from flask import Blueprint,request,Response
from ..helpers.dbConfig import databaseSetup
import json
dbObj = databaseSetup()
main = Blueprint('main', __name__)

Users_collections=dbObj["users"]
Recommendations_collections=dbObj["recommendations"]
Connected_users_collections=dbObj["connected_users"]
User_requests_collections=dbObj["user_requests"]
User_messages_collections=dbObj["user_messages"]
ScholarList_collections=dbObj["ScholarList"]


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
    resp = Response("Ok", status=200, mimetype='application/json')
    return resp


@main.route('/test', methods = ['GET'])
def test_connection():
    resp = Response("EasyConnect server is up and working!", status=200, mimetype='application/json')
    return resp


@main.route('/register', methods = ['POST'])
def register_user():
    data=request.get_json()
    email=data['email']
    password=data['password']
    full_name=data['full_name']
    scholars_link=data['scholars_link']
    interests=data['interests']

    user_exists=Users_collections.find_one({"email": email})

    if not user_exists:  
        user_data={"email":email,"password":password,"full_name":full_name,"scholars_link":scholars_link,"interests":interests}
        user_id=Users_collections.insert_one(user_data)
        resp = Response('User Registered Successfully', status=201, mimetype='application/json')
    else: 
        resp = Response('User already exists. Please Log in.', status=202, mimetype='application/json')
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

