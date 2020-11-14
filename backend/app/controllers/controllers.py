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



@main.route('/', methods = ['GET'])
def index():
    args=request.args
    
    resp = Response("This does work!", status=200, mimetype='application/json')
    return resp

