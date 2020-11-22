 '''
This file was used to fetch data from google scholarly, generate 
keywords and tos tore data in mongodb database
'''
'''
Import statements
'''
from scholarly import scholarly
import requests
from flask import Response
from tokenizor import populate_keyword
import json
from dbConfig import databaseSetup

'''
Get author's details from scholarly api provided a name
'''
def getAurthorObj(name):
    try:
        search_query = scholarly.search_author(name)
        author = next(search_query)
        return author
    except:
        return None

'''
Get author's interests from scholarly api 
'''
def getAuthorInterests(author):
    return author.interests
    
'''
Get a author's list of publications from scholarly api 
'''
def getPublicationList(author):
    return author.publications

'''
Get abstract of a publication from scholarly api
'''
def getAllAbstract(pubList,author):
    res=[]
    for i in range(len(pubList)):
        try:
            pub = author.publications[i].fill().bib
            res.append(pub)
            if i==20:
                break
        except:
            i-=1
            pass
    return res

'''
Process to fecth details from scholarly and store in database 
'''
if __name__ == "__main__":
    dbObj = databaseSetup()
    collection=dbObj['ScholarList']
    '''
    Get data stored in json file for researchers
    '''
    with open('researchersList.json', 'r') as f:
        data=json.load(f)

    for department in data:
        for entry in data[department]:
            author = getAurthorObj(entry["name"])
            if author==None:
                continue
            try: 
                '''
                Fetch required data from scholarly returned object
                '''
                researcher['researcher'] = entry["name"]
                researcher['scholars_link'] = "https://scholar.google.com/citations?user="+author.id
                researcher['iu_link'] = entry['url']
                researcher['id']=author.id
                researcher['url_picture']=author.url_picture
                researcher['email']=author.email
                researcher['citedby']=author.citedby
                researcher['affiliation']=author.affiliation
                researcher['interests']=author.interests
            except: 
                continue
            '''
            Generate keywords for a publications abstract
            ''' 
            for el in abs_val:
                if "abstract" in el:
                    try:
                        keywords = populate_keyword(el["abstract"])
                    except: 
                        continue
                    el['keywords']=keywords
                    papers.append(el)
            researcher['papers']=papers

            '''
            Store data in databse
            ''' 
            collection.insert_one(researcher)

 