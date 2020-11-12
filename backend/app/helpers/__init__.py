from flask import Flask

from .controllers.test_controller import main

app = Flask(__name__)

app.register_blueprint(main, url_prefix='/')
