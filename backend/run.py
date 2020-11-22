 '''
 This is entry file and starts the server
'''

'''
 Import statements
'''
from app import app 


if __name__ == '__main__':
    app.run(debug=True)