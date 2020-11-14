import pymongo

def databaseSetup():
    mongoClient = pymongo.MongoClient("mongodb+srv://root:root@cluster0.uqeev.mongodb.net/EasyConnectDB?retryWrites=true&w=majority")
    dbList = mongoClient.list_database_names()
    myDB = mongoClient['EasyConnectDB']
    return myDB