from flask import Flask

from .controllers.controllers import main

app = Flask(__name__)
app.register_blueprint(main, url_prefix='/')
app.register_blueprint(main, url_prefix='/EasyConnect/test/connection')
app.register_blueprint(main, url_prefix='/login')
app.register_blueprint(main, url_prefix='/register')
app.register_blueprint(main, url_prefix='/recommendations')
app.register_blueprint(main, url_prefix='/profile')
app.register_blueprint(main, url_prefix='/connect')
app.register_blueprint(main, url_prefix='/isconnected')
app.register_blueprint(main, url_prefix='/message')
app.register_blueprint(main, url_prefix='/requests')
