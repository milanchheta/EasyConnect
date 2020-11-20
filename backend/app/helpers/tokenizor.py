import nltk
nltk.download('stopwords')

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
import re
import pandas

BAD_SYMBOLS_RE = re.compile('[^0-9a-z #+_]')
REPLACE_BY_SPACE_RE = re.compile('[/(){}\[\]\|@,;.]')
STOPWORDS = set(stopwords.words('english'))
SHORTWORD = re.compile(r'\W*\b\w{1,3}\b')

def deep_clean(text):

    text = str(text).lower() # lowercase text
    text = REPLACE_BY_SPACE_RE.sub(' ', text) 
    text = BAD_SYMBOLS_RE.sub('', text) 
    text = re.sub(r'\b[a-zA-Z]\b','',str(text))
    text = re.sub('\d+','',text) 
    text = SHORTWORD.sub('',text)
    text = ' '.join(word for word in text.split() if word not in STOPWORDS) 

    return text

def populate_keyword(abstract):

    processed_text = deep_clean(abstract)
    new_t = [processed_text]

    vectorizer = CountVectorizer(ngram_range =(2, 3))
    X1 = vectorizer.fit_transform(new_t)
    features = (vectorizer.get_feature_names())

    X2 = vectorizer.fit_transform(new_t)
    scores = (X2.toarray())

    sums = X2.sum(axis = 0)
    data1 = []
    for col, term in enumerate(features):
        data1.append( (term, sums[0, col] ))

    ranking = pandas.DataFrame(data1, columns = ['term', 'rank'])
    words = (ranking.sort_values('rank', ascending = False))

    selected = words.head(10).values.tolist()

    keywords = [word[0] for word in selected]

    return keywords

def compute_similarity(user_keywords, researcher_keywords):
    
    user_list = []
    researcher_list = []
    rvector = set(user_keywords).union(set(researcher_keywords))
    print(rvector)
    for word in rvector: 
        if word in user_keywords: user_list.append(1) # create a vector 
        else: user_list.append(0) 
        if word in researcher_keywords: researcher_list.append(1) 
        else: researcher_list.append(0) 

    c = 0
    
    # cosine formula  
    for i in range(len(rvector)): 
            c+= user_list[i]*researcher_list[i] 
    cosine = c / float((sum(user_list)*sum(researcher_list))**0.5) 
    return cosine 