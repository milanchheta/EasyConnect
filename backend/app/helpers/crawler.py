from scholarly import scholarly
import requests
from bs4 import BeautifulSoup
from flask import Response

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


# def getAbstract(url):
#     page = requests.get(url)
#     soup = BeautifulSoup(page.content, 'html.parser')
#     results = soup.find('div', class_='abstractSection').get_text()
#     ##add nlp algo here to extract imp words
#     return results

# author=getAurthorObj("Patrick Shih")
# pubList=getPublicationList(author)
# interests=getAuthorInterests(author)
# absList=getAllAbstract(pubList)
