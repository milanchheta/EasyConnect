from scholarly import scholarly

search_query = scholarly.search_author('Patrick Shih')
author = next(search_query).fill()

print(author)

# print("++++++++++++++++++++++++++++")


# print([pub.bib['title'] for pub in author.publications])
# print("++++++++++++++++++++++++++++")


pub = author.publications[0].fill()

# print((pub.bib["abstract"]))
# print("++++++++++++++++++++++++++++")


# print([citation.bib['title'] for citation in pub.citedby])
