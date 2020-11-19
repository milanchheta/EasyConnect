from scholarly import scholarly
import requests
from flask import Response
from tokenizor import populate_keyword
import json
from dbConfig import databaseSetup

def getAurthorObj(name):
    try:
        search_query = scholarly.search_author(name)
        author = next(search_query)
        return author
    except:
        return None

def getAuthorInterests(author):
    return author.interests
    
def getPublicationList(author):
    return author.publications

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

if __name__ == "__main__":
    # author = getAurthorObj("Patrick")
    # pub_list = getPublicationList(author)
    # print(author.interests)

    dbObj = databaseSetup()
    collection=dbObj['ScholarList']
    # # print(col.find_one({},{"Adeel Bhutta":1}))
    with open('researchersList.json', 'r') as f:
        data=json.load(f)
    for department in data:
    #     i=0
        print('---------------{}--------------------'.format(department))
        for entry in data[department]:
            print('---------------{}'.format(entry))
            author = getAurthorObj(entry["name"])
            if author==None:
                continue
    #         pub_list = getPublicationList(author)
    #         abs_val = getAllAbstract(pub_list,author)
    #         researcher = {}
    #         papers=[]
            try: 
                collection.update_one({"id":author.id},{"$set":{"interests":author.interests}})
    #             researcher['researcher'] = entry["name"]
    #             researcher['scholars_link'] = "https://scholar.google.com/citations?user="+author.id
    #             researcher['iu_link'] = entry['url']
    #             researcher['id']=author.id
    #             researcher['url_picture']=author.url_picture
    #             researcher['email']=author.email
    #             researcher['citedby']=author.citedby
    #             researcher['affiliation']=author.affiliation
            except: 
                continue
    #         for el in abs_val:
    #             if "abstract" in el:
    #                 try: 
    #                     keywords = populate_keyword(el["abstract"])
    #                 except: 
    #                     continue
    #                 el['keywords']=keywords
    #                 papers.append(el)
    #         researcher['papers']=papers
    #         collection.insert_one(researcher)

 