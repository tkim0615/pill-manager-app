#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'



class UserById(Resource):
    def get(self, id):
        user = User.query.filter()
        pass

api.add_resource(User, '/user/<int:id>')



















if __name__ == '__main__':
    app.run(port=8000, debug=True)

