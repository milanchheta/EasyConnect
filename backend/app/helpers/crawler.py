from scholarly import scholarly
import requests
from flask import Response
from tokenizor import populate_keyword
import json
import pymongo

mongoClient = pymongo.MongoClient("mongodb+srv://root:<pwd>@cluster0.uqeev.mongodb.net/<DBName>?retryWrites=true&w=majority")

def databaseSetup():
    dbList = mongoClient.list_database_names()
    myDB = mongoClient['EasyConnectDB']
    if myDB in dbList:
        if 'ScholarList' not in myDB.list_collection_names():
            myCol = myDB['ScholarList']

    return myDB['ScholarList']

def getAurthorObj(name):
    search_query = scholarly.search_author(name)
    author = next(search_query).fill()
    return author

def getAuthorInterests(author):
    return author.interests
    
def getPublicationList(author):
    return author.publications

def getAllAbstract(pubList):
    res={}
    for i in range(len(pubList)):
        try:
            pub = author.publications[i].fill().bib
            res[pub["title"]]=pub["abstract"]
            if i==20:
                break
        except:
            i-=1
            pass
    return res

if __name__ == "__main__":
    collection = databaseSetup()
    payload = []
    with open('researchersList.json', 'r') as f:
        data=json.load(f)
    for department in data:
        for entry in data[department]:
            author = getAurthorObj(entry["name"])
            pub_list = getPublicationList(author)
            abs_val = getAllAbstract(pub_list)
            #entry["name"]: [{title: key, keyword_list: keywords},...]
            researcher = {}
            researcher[entry["name"]] = []
            for key in abs_val:
                res = {}
                keywords = populate_keyword(abs_val[key])
                res["title"] = key
                res["keywords"] = keywords
                researcher[entry["name"]].append(res)
                break
            break
        payload.append(researcher)
        break
    with open('payload.txt', 'w+') as f:
        f.write(str(payload))
    collection.insert_many(payload)
        # TODO: update mongo DB with title, keyword list for prof list.