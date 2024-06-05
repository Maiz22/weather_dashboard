from flask import Flask
from config import Config
from weather_dashboard.model import db, Location

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    db.create_all()

import weather_dashboard.views