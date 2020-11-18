from scholarly import scholarly
import requests
from flask import Response
from tokenizor import populate_keyword
import json
from dbConfig import databaseSetup

def getAurthorObj(name):
    try:
        search_query = scholarly.search_author(name)
        author = next(search_query).fill()
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
    # print(author.publications[0].fill().bib)
    dbObj = databaseSetup()
    collection=dbObj['ScholarList']
    # print(col.find_one({},{"Adeel Bhutta":1}))
    with open('researchersList.json', 'r') as f:
        data=json.load(f)
    payload=[]
    for department in data:
        i=0
        print('---------------{}--------------------'.format(department))
        for entry in data[department]:
            i+=1
            if i==3:
                break
            j=0
            print('---------------{}'.format(entry))
            author = getAurthorObj(entry["name"])
            if author==None:
                continue
            pub_list = getPublicationList(author)
            abs_val = getAllAbstract(pub_list,author)
            researcher = {}
            papers=[]

            researcher['researcher'] = entry["name"]
            researcher['scholars_link'] = "https://scholar.google.com/citations?user="+author.id
            researcher['iu_link'] = entry['url']
            researcher['id']=author.id
            researcher['url_picture']=author.url_picture
            researcher['email']=author.email
            researcher['citedby']=author.citedby
            researcher['affiliation']=author.affiliation
            for el in abs_val:
                j+=1
                if j==3:
                    break
                keywords = populate_keyword(el["abstract"])
                el['keywords']=keywords
                papers.append(el)
            researcher['papers']=papers
            payload.append(researcher)
    with open('payload.txt', 'w+') as f:
        f.write(str(payload))
    collection.insert_many(payload)
 