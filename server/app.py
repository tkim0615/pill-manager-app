#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import db, User, Prescription, Doctor, Dosage_history

# Views go here!
app.secret_key = b'\x8c\xbb\xa9\xa5\xf0\x8c01c\xc1\xec\xa4\x9fs\xbf=\x83(\xd5Z8\xa5A\xd3'

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Users(Resource):
    def get(self):  
        users = [user.to_dict(only=('name', 'username')) for user in User.query.all()]
        return make_response(users, 200)
    
    def post(self):
        try:
            data = request.get_json()
            user = User(
                name= data['name'],
                username= data['username'],
            )
            user.password_hash = data['password'] ######################3
            db.session.add(user)
            db.session.commit()
            return make_response(user.to_dict(), 201)
        except ValueError:
            return make_response({'error': 'Failed to add new user, try again!'}, 400)  

class UserById(Resource):
    def get(self, id):
        user = User.query.filter(User.id == id).first()
        if user:
            return make_response(user.to_dict(only=('name', 'username')), 200)
        return make_response({'error': 'user not found'},404)
    def patch(self, id):
        user = User.query.filter(User.id == id).first()
        if user:
            try:
                data = request.get_json()
                for attr in data:
                    setattr(user, attr, data[attr])
                db.session.commit()
                return make_response(user.to_dict(only=('name', 'username')), 202)
            except ValueError:
                return make_response({'error': 'Failed to edit user'}, 400)

    def delete(self, id):
        user = User.query.filter(User.id == id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response({}, 204)
        return make_response({'error': 'User not found'}, 404)
           
api.add_resource(UserById, '/users/<int:id>')
api.add_resource(Users, '/users')

class Prescriptions(Resource):
    def get(self):
        rxs = [r.to_dict() for r in Prescription.query.all()]
        return make_response(rxs, 200)
    


api.add_resource(Prescriptions, '/prescriptions')




#authentification
class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict()
        else:
            return {'message': '401: Not Authorized'}, 401

class Login(Resource):
    def post(self):
        try:
            username = request.get_json()['username']
            password = request.get_json()['password']

            user = User.query.filter(User.username == request.get_json()['username']).first()
            if user.authenticate(password):
                session['user_id'] = user.id
                return user.to_dict(), 200
            return {'error': 'Invalid username or password'}, 401
            
        except ValueError:
            return make_response({'error': 'Login failed'}, 400)     

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {'message': '204: No Content'}, 204 

api.add_resource(CheckSession, '/check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')







if __name__ == '__main__':
    app.run(port=8888, debug=True)

