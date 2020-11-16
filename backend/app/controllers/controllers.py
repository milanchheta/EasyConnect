from flask import Blueprint,request,Response,jsonify
from ..helpers.dbConfig import databaseSetup
from ..helpers.tokenizor import compute_similarity
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
#     interests: []
#     researchers:[] => Professor names list.
#     papers:[]?????? Names of recommended papers => {Professor name, [title]}
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

"""
scholar List design:
{
    researcher: <name>,
    scholars_link: <link>,
    papers: [
        title: <title>,
        keywords: []
    ]
}
"""


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
    user=Users_collections.find_one({"email": email},{'_id': False})
    if not user: 
        resp = Response('User does not exist', 401, {'WWW-Authenticate' : 'Basic realm ="User does not exist"'})
        return resp

    if check_password_hash(user['password'], password): 
        token = jwt.encode({ 
            'user':user
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

# Header format:
# Authorization: Bearer <jwt_token>
@main.route('/update_interests', methods = ['GET'])
def update_recomendations():
    args = request.args
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    if auth_token != '':
        user = jwt.decode(auth_token, SECRET_KEY)

        # update Recommendations_collections
        recommendation_col = Recommendations_collections.find_one({id: user["id"]})
        new_recommendation = recommendation_col.copy()
        new_recommendation["interests"] = user["interests"]
        payload = {"$set": new_recommendation}
        Recommendations_collections.update_one(recommendation_col, payload)

        # Get the scholars list.
        scholar_list = ScholarList_collections.find()

        scholar_cosine_rel = []
        for scholar in scholar_list:
            cosine_sum = 0
            for paper in scholar["papers"]:
                cosine_sum += compute_similarity(user["interests"], paper["keywords"])
            scholar_cosine_rel.append((scholar["researcher"], cosine_sum))

        # Find the top 10 scholars with cosine sum and update the recommendation.
        

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


# @main.route('/isconnected', methods = ['GET'])
# def get_connected_status():
#     args=request.args
#     resp = Response("isconnected endpoint", status=200, mimetype='application/json')
#     return resp
    
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
def connection_requests():
    if request.method == 'POST':
        data = request.get_json()
        requesting_user=jwt.decode(data['requesting_user_jwt'], SECRET_KEY)["user"]
        requesting_user_data={"id":requesting_user['id'], "email":requesting_user['email'],"full_name":requesting_user['full_name']}
        requested_to=data['id']
        user=User_requests_collections.find_one({"user_id": requested_to})

        if not user:
            user={}
            user['user_id']=requested_to
            user['connected_to']=[requesting_user_data]
            User_requests_collections.insert_one(user)
            resp = Response("Request Sent Successfully", status=200, mimetype='application/json')
            return resp
        user['connected_to'].append(requesting_user_data)
        User_requests_collections.update_one({"user_id": requested_to}, {"$set":{"connected_to":user['connected_to']}})
        resp = Response("Request Sent Successfully", status=200, mimetype='application/json')
        return resp

    if request.method == 'GET':
        auth_header = request.headers.get('Authorization')
        if auth_header:
            jwt_token = auth_header.split(" ")[1]                
            user_data=jwt.decode(jwt_token, SECRET_KEY)
        user=None
        if user_data!=None:
            user_data=user_data["user"]
            user=User_requests_collections.find_one({"user_id": user_data['id']})
            print("here",user)
        print(user_data)
        if user!=None:
            resp=Response(json.dumps(user['connected_to']), status=200, mimetype='application/json')
        else:
            resp = Response(json.dumps([]), status=200, mimetype='application/json')
    return resp

@main.route('/upload', methods = ['POST'])
def upload_paper():
    if request.method == 'POST':
        f = request.files['the_file']
        data = request.get_json()


