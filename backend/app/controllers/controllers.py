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
User_messages_collections=dbObj["user_message_pair"]
User_messages_rooms_collections=dbObj["user_message_room"]
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

# message_pairs->{
#     user_1:
#     user_2:
#     id:
# }
# message_room->{
#     id:
#     sender: id
#     receiver: id
#     timestamp:
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




# @main.route('/isconnected', methods = ['GET'])
# def get_connected_status():
#     args=request.args
#     resp = Response("isconnected endpoint", status=200, mimetype='application/json')
#     return resp
    
@main.route('/message', methods = ['POST', 'GET'])
def message():

    ## send message
    if request.method == 'POST':
        args=request.args
        user_id=args['user_id']
        data=request.get_json()
        message_room_id=data["message_room_id"]
        message=data["message"]
        message_pair=User_messages_rooms_collections.find_one({"message_room_id":message_room_id},{"_id":False})
        message_pair["messages"].append({"sender_id":user_id,"message":message, "timestamp":datetime.now()})
        User_messages_rooms_collections.update_one({"message_room_id":message_room_id},{"$set":{"messages":message_pair["messages"]}})
        resp = Response("message endpoint", status=200, mimetype='application/json')
        return resp
    ## get message room id
    if request.method == "GET":
        args=request.args
        user_id=args['user_id']
        connection_id=args['connection_id']
        message_pair=User_messages_collections.find_one({"user_1": user_id,"user_2":connection_id })
        if not message_pair:
            message_pair=User_messages_collections.find_one({"user_2": user_id,"user_1":connection_id })
        if not message_pair:
            message_room_id=str(uuid.uuid4())
            User_messages_collections.insert_one({"user_2": user_id,"user_1":connection_id, "message_room_id":message_room_id})
            User_messages_rooms_collections.insert_one({"message_room_id":message_room_id,"messages":[]})
            resp = Response(json.dumps({"message_room_id":message_room_id,"messages":[]}), status=200, mimetype='application/json')

        else:
            message_room_id=message_pair['message_room_id']
            message_pair=User_messages_rooms_collections.find_one({"message_room_id":message_room_id},{"_id":False})
            print(message_pair)
            resp=Response(json.dumps(message_pair), status=200, mimetype='application/json')

        return resp
        
@main.route('/connect', methods = ['POST', 'GET'])
def connect_user():
    ##accept connection request
    if request.method == 'POST':
        data = request.get_json()
        user_1_data = data['accpeted_user']
        user_2_data=jwt.decode(data['jwt_token'], SECRET_KEY)["user"]

        user_1_id=user_1_data["id"]
        user_2_id=user_2_data["id"]
        
        # Connected_users_collections
        user_1=Connected_users_collections.find_one({"id": user_1_id})
        user_2=Connected_users_collections.find_one({"id": user_2_id})

        if not user_1:
            Connected_users_collections.insert_one({"id":user_1_id,"connected_to":[{"id":user_2_id,"full_name":user_2_data["full_name"],"email":user_2_data["email"]}]})
        else:
            user_1["connected_to"].append({"id":user_2_id,"full_name":user_2_data["full_name"],"email":user_2_data["email"]})
            Connected_users_collections.update_one({"id":user_1_id},{"$set":{"connected_to":user_1["connected_to"]}})

        if not user_2:
            Connected_users_collections.insert_one({"id":user_2_id,"connected_to":[user_1_data]})
        else:
            user_2["connected_to"].append(user_1_data)
            Connected_users_collections.update_one({"id":user_2_id},{"$set":{"connected_to":user_2["connected_to"]}})
        user_2_requests=User_requests_collections.find_one({"user_id":user_2_id})


        for i in range(len(user_2_requests['requests'])):
            if user_2_requests['requests'][i]['id']==user_1_id:
                break
        del user_2_requests['requests'][i]
        User_requests_collections.update_one({"user_id": user_2_id}, {"$set":{"requests":user_2_requests['requests']}})

        resp = Response("Connection Accepted Successfully", status=200, mimetype='application/json')
        return resp
    
    ## get list of conencted users
    if request.method == 'GET':
        auth_header = request.headers.get('Authorization')
        if auth_header:
            jwt_token = auth_header.split(" ")[1]                
            user_data=jwt.decode(jwt_token, SECRET_KEY)
        user=None
        if user_data!=None:
            user_data=user_data["user"]
            user=Connected_users_collections.find_one({"id": user_data['id']})
        if user!=None:
            resp=Response(json.dumps(user['connected_to']), status=200, mimetype='application/json')
        else:
            resp = Response(json.dumps([]), status=200, mimetype='application/json')
        return resp
@main.route('/requests', methods = ['GET', 'POST'])
def connection_requests():
    ## send request to connect to a user
    if request.method == 'POST':
        data = request.get_json()
        requesting_user=jwt.decode(data['requesting_user_jwt'], SECRET_KEY)["user"]
        requesting_user_data={"id":requesting_user['id'], "email":requesting_user['email'],"full_name":requesting_user['full_name']}
        requested_to=data['id']
        user=User_requests_collections.find_one({"user_id": requested_to})

        if not user:
            user={}
            user['user_id']=requested_to
            user['requests']=[requesting_user_data]
            User_requests_collections.insert_one(user)
            resp = Response("Request Sent Successfully", status=200, mimetype='application/json')
            return resp
        user['requests'].append(requesting_user_data)
        User_requests_collections.update_one({"user_id": requested_to}, {"$set":{"requests":user['connected_to']}})
        resp = Response("Request Sent Successfully", status=200, mimetype='application/json')
        return resp

    ## get list of connection requests
    if request.method == 'GET':
        auth_header = request.headers.get('Authorization')
        if auth_header:
            jwt_token = auth_header.split(" ")[1]                
            user_data=jwt.decode(jwt_token, SECRET_KEY)
        user=None
        if user_data!=None:
            user_data=user_data["user"]
            user=User_requests_collections.find_one({"user_id": user_data['id']})

        if user!=None:
            resp=Response(json.dumps(user['requests']), status=200, mimetype='application/json')
        else:
            resp = Response(json.dumps([]), status=200, mimetype='application/json')
    return resp

@main.route('/upload', methods = ['POST'])
def upload_paper():
    if request.method == 'POST':
        f = request.files['the_file']
        data = request.get_json()


