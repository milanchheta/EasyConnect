from scholarly import scholarly

search_query = scholarly.search_author('Patrick Shih')
author = next(search_query)

print(author)

# print("++++++++++++++++++++++++++++")


# print([pub.bib for pub in author.publications])
# print("++++++++++++++++++++++++++++")


# pub = author.publications[0].fill()

# print((pub))
# print("++++++++++++++++++++++++++++")


# print([citation.bib['title'] for citation in pub.citedby])
