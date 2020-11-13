from scholarly import scholarly
import requests
from bs4 import BeautifulSoup
from flask import Response

def getAurthorObj(name):
    search_query = scholarly.search_author()
    author = next(search_query).fill()
    return author

def getAbstract(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find('div', class_='abstractSection').get_text()
    return results

