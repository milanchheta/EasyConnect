'''
This file consists of configuration details 
for hosted mongodb database in atlas
'''

'''
Import statements
'''
import pymongo


'''
Function to make database connection 
'''
def databaseSetup():
    mongoClient = pymongo.MongoClient("mongodb+srv://root:root@cluster0.uqeev.mongodb.net/EasyConnectDB?retryWrites=true&w=majority")
    dbList = mongoClient.list_database_names()
    myDB = mongoClient['EasyConnectDB']
    return myDB