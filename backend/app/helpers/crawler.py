from scholarly import scholarly
import requests
from flask import Response
from tokenizor import populate_keyword
import json

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
    with open('researchersList.json', 'r') as f:
        data=json.load(f)
    for department in data:
        for entry in data[department]:
            author = getAurthorObj(entry["name"])
            pub_list = getPublicationList(author)
            abs_val = getAllAbstract(pub_list)
            for key in abs_val:
                keywords = populate_keyword(abs_val[key])

        # TODO: update mongo DB with title, keyword list for prof list.
