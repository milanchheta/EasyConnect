from flask import Blueprint,request,Response,jsonify
from ..helpers.dbConfig import databaseSetup
from ..helpers.tokenizor import compute_similarity
import json
from  werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename 
import jwt 
from datetime import datetime, timedelta 
from functools import wraps 
import uuid
from flask_cors import CORS, cross_origin
import io
import PyPDF2
import os
from ..helpers.tokenizor import populate_keyword

dbObj = databaseSetup()
main = Blueprint('main', __name__)
cors = CORS(main)
# main.config['CORS_HEADERS'] = 'Content-Type'

Users_collections=dbObj["users"]
Recommendations_collections=dbObj["recommendations"]
Connected_users_collections=dbObj["connected_users"]
User_requests_collections=dbObj["user_requests"]
User_messages_collections=dbObj["user_message_pair"]
User_messages_rooms_collections=dbObj["user_message_room"]
ScholarList_collections=dbObj["ScholarList"]

SECRET_KEY="Authentication Secret Goes Here"

@main.route('/', methods = ['GET'])
@cross_origin()
def index():
    resp = Response("Ok", status=200, mimetype='application/json')
    return resp


@main.route('/test', methods = ['GET'])
@cross_origin()
def test_connection():
    resp = Response("EasyConnect server is up and working!", status=200, mimetype='application/json')
    return resp


@main.route('/register', methods = ['POST'])
@cross_origin()
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
        user_data={"id":id,"email":email,"password":generate_password_hash(password) ,"full_name":full_name,"scholars_link":scholars_link,"interests":interests, "keywords": []}
        print(user_data)
        update_recomendations(user_data)
        user_id=Users_collections.insert_one(user_data)

        resp = Response('User Registered Successfully', status=201, mimetype='application/json')
    else: 
        resp = Response('User already exists. Please Log in.', status=202, mimetype='application/json')
    return resp

@main.route('/login', methods = ['GET','POST'])
@cross_origin()
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
   
        resp =Response(json.dumps({'token' : token.decode('UTF-8')}), 200) 
        return resp

    resp=('Wrong Password', 403, {'WWW-Authenticate' : 'Basic realm ="Wrong Password !!"'}) 
    return resp

@main.route('/recommendations', methods = ['GET'])
@cross_origin()
def get_recommendations():
    auth_header = request.headers.get('Authorization')

    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''

    if auth_token != '':

        user = jwt.decode(auth_token, SECRET_KEY)["user"]
        recommendations = Recommendations_collections.find_one({"user_id": user["id"]}, {"_id": 0})

        if recommendations:
            resp = Response(json.dumps(recommendations), status=200, mimetype='application/json')
        else:
            resp = Response("No data found", status=404, mimetype='application/json')
    
        return resp

# Header format:
# Authorization: Bearer <jwt_token>
# @main.route('/update_interests', methods = ['POST'])
"""
Method to update the recommendations based on user interests.
"""
def update_recomendations(user):

    recommendation_col = Recommendations_collections.find_one({"user_id": user["id"]})
    # interests = user["interests"]
    if user["keywords"]:
        user_keywords = user["keywords"] + user["interests"]
    else:
        user_keywords = user["interests"]

    print(user_keywords)

    # Get the scholars list.
    scholar_list = ScholarList_collections.find({},{'_id': 0})
    # print(scholar_list)
    scholar_cosine_rel = []
    for scholar in scholar_list:
        if scholar["scholars_link"]!=user["scholars_link"]:
            cosine_sum = 0
            scholar_interests=[]
            if "interests" in scholar:
                scholar_interests=scholar["interests"]
            for paper in scholar["papers"]:
                keywords=scholar_interests+paper["keywords"]
                user_keywords = list(map(lambda x: x.lower(), user_keywords))
                keywords = list(map(lambda item: item.lower(), keywords))
                cosine_sum += compute_similarity(user_keywords, keywords)
            
            scholar_cosine_rel.append((scholar, cosine_sum))

    # Find the top 10 scholars with cosine sum and update the recommendation.
    new_scholar = sorted(scholar_cosine_rel, key=lambda item: item[1],reverse=True)

    # print(new_scholar[:10])
    resp = [item[0] for item in new_scholar[:10]]
    # print(res)
    # update Recommendations_collections
    if recommendation_col:
        new_recommendation = recommendation_col.copy()
        new_recommendation["keywords"] = user_keywords
        new_recommendation["researchers"] = resp
        payload = {"$set": new_recommendation}
        Recommendations_collections.update_one(recommendation_col, payload)

    # Otherwise create new recommendation.
    else:
        new_recommendation = {}
        new_recommendation["user_id"] = user["id"]
        new_recommendation["keywords"] = user_keywords
        new_recommendation["researchers"] = resp
        Recommendations_collections.insert_one(new_recommendation)
    
    return 'Done'

@main.route('/profile', methods = ['GET', 'PUT'])
@cross_origin()
def get_user_profile():

    if request.method == 'GET':
        args=request.args
        scholars_link=args['scholars_link']
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''
        if auth_token != '':
            curr_user = jwt.decode(auth_token, SECRET_KEY)["user"]
     
        user=Users_collections.find_one({"scholars_link":scholars_link},{"_id":False})

        if user:
            user_request=User_requests_collections.find_one({"user_id": user['id']})
            if user_request:
                for item in user_request['requests']:
                    if curr_user['id']==item['id']:
                        return Response("REQUESTED", status=200, mimetype='application/json')
            user_request=User_requests_collections.find_one({"user_id": curr_user['id']})
            if user_request:
                for item in user_request['requests']:
                    if user['id']==item['id']:
                        return Response("RECEIVED", status=200, mimetype='application/json')

            user_connection=Connected_users_collections.find_one({"id": curr_user['id']})
            if user_connection:
                for item in user_connection['connected_to']:
                    if user['id']==item['id']:
                        return Response("CONNECTED", status=200, mimetype='application/json')
            return Response(json.dumps(user), status=200, mimetype='application/json')

        else: 
            resp = Response("user does not exists", status=404, mimetype='application/json')

        return resp

    # Update user profile
    if request.method == 'PUT':
        data = request.get_json()
        full_name = data['full_name']
        scholars_link = data['scholars_link']
        interests = data['interests']

        auth_header = request.headers.get('Authorization')

        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''

        if auth_token != '':

            user = jwt.decode(auth_token, SECRET_KEY)["user"]

            #Update user collection
            user_update = user.copy()
            if len(interests) > 0: user_update["interests"] = interests
            if full_name: user_update["full_name"] = full_name
            if scholars_link: user_update["scholars_link"] = scholars_link

            req = {"$set": user_update}
            Users_collections.update(user, req)

            update_recomendations(user_update)

            token = jwt.encode({ 
                'user':user_update
            }, SECRET_KEY) 

            resp =Response(json.dumps({'token' : token.decode('UTF-8')}), 200)

            return resp
        else:
            return Response("Failed Update", status=403, mimetype='application/json')


# @main.route('/isconnected', methods = ['GET'])
# def get_connected_status():
#     args=request.args
#     resp = Response("isconnected endpoint", status=200, mimetype='application/json')
#     return resp
    
@main.route('/message_rooms', methods = ['GET'])
@cross_origin()
def message_rooms():
    if request.method == "GET":
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''
        if auth_token != '':
            user = jwt.decode(auth_token, SECRET_KEY)["user"]
        user_id=user['id']
        res=[]

        messages_1=list(User_messages_collections.find({"user_1": user_id},{"_id":False}))
        for entry in messages_1:
            print(entry)

            user=Users_collections.find_one({"id": entry["user_2"]},{'_id': False})
            if user:
                res.append(user)

        messages_2=list(User_messages_collections.find({"user_2": user_id},{"_id":False}))
        for entry in messages_2:
            print(entry)
            user=Users_collections.find_one({"id": entry["user_1"]},{'_id': False})
            if user:
                res.append(user)

        print(messages_1,messages_2)
        resp = Response(json.dumps(res), status=200, mimetype='application/json')
        return resp


@main.route('/message', methods = ['POST', 'GET'])
@cross_origin()
def message():

    ## send message
    if request.method == 'POST':
        args=request.args
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''
        if auth_token != '':
            user = jwt.decode(auth_token, SECRET_KEY)["user"]
        user_id=user['id']
        data=request.get_json()
        message_room_id=data["message_room_id"]
        message=data["message"]
        message_pair=User_messages_rooms_collections.find_one({"message_room_id":message_room_id},{"_id":False})
        message_pair["messages"].append({"sender_id":user_id,"message":message, "timestamp": datetime.now().strftime("%m/%d/%Y, %H:%M:%S")})
        User_messages_rooms_collections.update_one({"message_room_id":message_room_id},{"$set":{"messages":message_pair["messages"]}})
        resp = Response(json.dumps({"sender_id":user_id,"message":message, "timestamp": datetime.now().strftime("%m/%d/%Y, %H:%M:%S")}), status=200, mimetype='application/json')
        return resp

    ## get message room id
    if request.method == "GET":
        args=request.args
        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''
        if auth_token != '':
            user = jwt.decode(auth_token, SECRET_KEY)["user"]
        user_id=user['id']

        connection_id=args['connection_id']
        if connection_id=="":
            connection_data=Users_collections.find_one({"scholars_link":args["scholars_link"]},{"_id":False})
            connection_id=connection_data['id']
        message_pair=User_messages_collections.find_one({"user_1": user_id,"user_2":connection_id },{"_id":False})
        if not message_pair:
            message_pair=User_messages_collections.find_one({"user_2": user_id,"user_1":connection_id },{"_id":False})
        if not message_pair:
            message_room_id=str(uuid.uuid4())
            User_messages_collections.insert_one({"user_2": user_id,"user_1":connection_id, "message_room_id":message_room_id})
            User_messages_rooms_collections.insert_one({"message_room_id":message_room_id,"messages":[]})
            resp = Response(json.dumps({"message_room_id":message_room_id,"messages":[],"connection_id":connection_id}), status=200, mimetype='application/json')

        else:
            message_room_id=message_pair['message_room_id']
            message_pair=User_messages_rooms_collections.find_one({"message_room_id":message_room_id},{"_id":False})
            message_pair["connection_id"]=connection_id
            print(message_pair)
            print(json.dumps(message_pair))
            resp=Response(json.dumps(message_pair), status=200, mimetype='application/json')

        return resp
        
@main.route('/connect', methods = ['POST', 'GET'])
@cross_origin()
def connect_user():
    ##accept connection request
    if request.method == 'POST':
        data = request.get_json()
        user_1_data = data['accpeted_user']
        user_2_data=jwt.decode(data['jwt_token'], SECRET_KEY)["user"]
        print(user_1_data)
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
@cross_origin()
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
        User_requests_collections.update_one({"user_id": requested_to}, {"$set":{"requests":user['requests']}})
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
@cross_origin()
def upload_paper():
    if request.method == 'POST':
        f = request.files['file']

        auth_header = request.headers.get('Authorization')
        if auth_header:
            auth_token = auth_header.split(" ")[1]
        else:
            auth_token = ''
        if auth_token != '':
            user = jwt.decode(auth_token, SECRET_KEY)["user"]
        user_id=user['id']

        user = Users_collections.find_one({"id": user_id})

        if (f != None):
            # print(data)
            filename = f.filename
            f.save(filename)

            pdfFile = open(filename, 'rb')
            pdfReader = PyPDF2.PdfFileReader(pdfFile)

            pageNum = pdfReader.numPages
            text = ''
            for page in range(pageNum-1):
                pageObj = pdfReader.getPage(page)
                text += pageObj.extractText()

            pdfText = text.split(' ')
            # print(pdfText)
            finalText = ' '.join(pdfText[1:])
            # print(finalText)

            keywords = populate_keyword(finalText)
            print("paper keys",keywords)

            if "keywords" in user:
                # user["keywords"].append(keywords)
                old_keywords = user["keywords"]
                for keyword in keywords:
                    if keyword not in old_keywords:
                        user["keywords"].append(keyword)
            else:
                user["keywords"] = keywords
            
            print("user keys",user["keywords"])

            Users_collections.update_one({"id": user_id}, {"$set": user})

            res = update_recomendations(user)

            # if res == 'Done': 
            #     os.remove(filename)

            return Response('received file', status=200, mimetype='application/json')

        else:
            return Response('Error receiving file', status=404, mimetype='application/json')


