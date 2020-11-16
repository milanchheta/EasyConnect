from flask import Blueprint,request,Response,jsonify
from ..helpers.dbConfig import databaseSetup
import json
from  werkzeug.security import generate_password_hash, check_password_hash 
import jwt 
from datetime import datetime, timedelta 
from functools import wraps 
import uuid
dbObj = databaseSetup()
main = Blueprint('main', __name__)

Users_collections=dbObj["users"]
Recommendations_collections=dbObj["recommendations"]
Connected_users_collections=dbObj["connected_users"]
User_requests_collections=dbObj["user_requests"]
User_messages_collections=dbObj["user_messages"]
ScholarList_collections=dbObj["ScholarList"]
SECRET_KEY="Authentication Secret Goes Here"

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
        # id:
#     full_name: string
#     email: string
#     password: string
#     scholars_link: url if any(verify before saving)
#     interests:[]
# }

# recommendations->{
#     user_id: id
#     keywords (based on interests or uploaded papers if any): []
#     researchers:[] => Professor names list.
#     papers:[]?????? Names of recommended papers => {Professor name, title}
# }

# scholars->{
#     (Professor name):{title:[(Keywords)], interests:[], scholars_link:link }, id: uuid,...
# }

# TODO: add email or id to the scholar list.

# connected_users->{
#     user_id:id
#     connected_to:[]
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
    id = str(uuid.uuid4())

    # TODO: verify scholar link.

    user_exists=Users_collections.find_one({"email": email})

    if not user_exists:  
        user_data={"id":id,"email":email,"password":generate_password_hash(password) ,"full_name":full_name,"scholars_link":scholars_link,"interests":interests}
        user_id=Users_collections.insert_one(user_data)

        resp = Response('User Registered Successfully', status=201, mimetype='application/json')
    else: 
        resp = Response('User already exists. Please Log in.', status=202, mimetype='application/json')
    return resp

@main.route('/login', methods = ['GET','POST'])
def login_user():
    data=request.get_json()
    email=data['email']
    password=data['password']
    user=Users_collections.find_one({"email": email})
    print(user)
    if not user: 
        resp = Response('User does not exist', 401, {'WWW-Authenticate' : 'Basic realm ="User does not exist"'})
        return resp

    if check_password_hash(user['password'], password): 
        token = jwt.encode({ 
            'user': user 
        }, SECRET_KEY) 
   
        resp =Response(json.dumps({'token' : token.decode('UTF-8')}), 201) 
        return resp

    resp=('Wrong Password', 403, {'WWW-Authenticate' : 'Basic realm ="Wrong Password !!"'}) 
    return resp

@main.route('/recommendations', methods = ['GET'])
def get_recommendations():
    args=request.args
    resp = Response("recommendations endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/profile', methods = ['GET', 'PUT'])
def get_user_profile():
    if request.method == 'GET':
        args=request.args
        resp = Response("profile endpoint", status=200, mimetype='application/json')
        return resp
    if request.method == 'PUT':
        args=request.args
        resp = Response("profile endpoint", status=200, mimetype='application/json')
        return resp

@main.route('/connect', methods = ['POST', 'GET'])
def connect_user():
    if request.method == 'POST':
        args=request.args
        data = request.get_json()
        jwt_user_token = data['user']
        connect_email = data['email'] #or id
        
        connecting_user = Connected_users_collections.find_one({'email': connect_email})
        if connecting_user:
            pass
        resp = Response("connect endpoint", status=200, mimetype='application/json')
        return resp
    if request.method == 'GET':
        args=request.args
        resp = Response("connect endpoint", status=200, mimetype='application/json')
        return resp


@main.route('/isconnected', methods = ['GET'])
def get_connected_status():
    args=request.args
    resp = Response("isconnected endpoint", status=200, mimetype='application/json')
    return resp
    
@main.route('/message', methods = ['POST', 'GET'])
def send_message():
    if request.method == 'POST':
        args=request.args
        resp = Response("message endpoint", status=200, mimetype='application/json')
        return resp
    
    if request.method == "GET":
        args=request.args
        resp = Response("message endpoint", status=200, mimetype='application/json')
        return resp

@main.route('/requests', methods = ['GET', 'POST'])
def get_connection_requests():
    if request.method == 'POST':
        data = request.get_json()
        pass

    if request.method == 'GET':
        pass

    args=request.args
    resp = Response("requests endpoint", status=200, mimetype='application/json')
    return resp

@main.route('/upload', methods = ['POST'])
def upload_paper():
    if request.method == 'POST':
        f = request.files['the_file']
        data = request.get_json()


