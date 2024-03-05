#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session
from flask_restful import Resource
 
# Local imports
from config import app, db, api
# Add your model imports
from models import db, User, Prescription, Doctor, Dosage_history, Allergy

# Views go here!
@app.before_request      
def check_if_logged_in():
    allowed_endpoints = ['login', 'logout', 'users']
    user_id = session.get('user_id')
    if not user_id and request.endpoint not in allowed_endpoints :
        return {'error': 'Unauthorized, Please Login'}, 401
@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Users(Resource):
    def get(self):  
        users = [user.to_dict(only=('id', 'name', 'username')) for user in User.query.all()]
        return make_response(users, 200)
    
    def post(self):
        try:
            data = request.get_json()
            user = User(
                name= data['name'],
                username= data['username']
            )
            user.password_hash = data['password'] 
            db.session.add(user)
            db.session.commit()
            return make_response(user.to_dict(only=('id', 'name', 'username')), 201)
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
                if 'password' in data:
                    user.password_hash = data['password']
                    del data['password']
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
api.add_resource(Users, '/users', endpoint='users')

class Prescriptions(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                prescriptions = user.prescriptions
                rxs = []
                for rx in prescriptions:
                    # Access the associated doctor's name using the relationship
                    doctor_name = rx.doctor.name if rx.doctor else None
                    rx_data = rx.to_dict(only=('id','name', 'direction', 'start_date', 'end_date', 'completed', 'user_id', 'doctor_id', 'image'))
                    rx_data['doctor_name'] = doctor_name
                    rxs.append(rx_data)
                return make_response(rxs, 200)
            else:
                return make_response({'error': 'User not found'}, 404)
        else:
            return make_response({'error': 'Not authorized, please log in'}, 401)

    def post(self):
        try:
            user_id = session.get('user_id')
            if not user_id:
                return make_response({'error': 'Not authorized, please log in'}, 401)
            data = request.get_json()
            new_prescription = Prescription(
                name = data['name'],
                direction = data['direction'],
                start_date = data['start_date'],
                end_date= data['end_date'],
                completed=data['completed'],
                user_id= user_id,
                doctor_id=data['doctor_id'],
                image=data['image']
            )
            db.session.add(new_prescription)
            db.session.commit()
            doctor_name = new_prescription.doctor.name if new_prescription and new_prescription.doctor else None
            rx_data = new_prescription.to_dict(only=('id','name', 'direction', 'start_date', 'end_date', 'completed','doctor', 'image'))
            rx_data['doctor_name'] = doctor_name
            return make_response(rx_data, 201)
        except ValueError:
            return make_response({'error': 'Failed to add new user, try again!'}, 400)

class PrescriptionsById(Resource):
    def get(self, id):
        rx = Prescription.query.filter(Prescription.id == id).first()
        if rx:
            return make_response(rx.to_dict(only=('id', 'name', 'direction', 'start_date', 'end_date', 'completed','doctor','image')), 200)
        else:
            return make_response({'error': 'Prescription not found'},404)


    def patch(self, id):
            rx = Prescription.query.filter(Prescription.id == id).first()
            if rx:
                try:
                    data = request.get_json()
                    for attr in data:
                        setattr(rx, attr, data[attr])
                    db.session.commit()

                    # Retrieve the doctor's name
                    doctor_name = rx.doctor.name if rx.doctor else None

                    # Create the response dictionary
                    rx_data = {
                        'id': data['id'],
                        'name': data['name'],
                        'direction': data['direction'],
                        'start_date': data['start_date'],
                        'end_date': data['end_date'],
                        'completed': data['completed'],
                        'doctor_name': doctor_name,
                        'image': data['image']
                    }

                    return make_response(rx_data, 202)
                except ValueError:
                    return make_response({'error': 'Prescription failed to edit'}, 400)
            else:
                return make_response({'error': 'Prescription not found'}, 404)
    def delete(self, id):
        rx = Prescription.query.filter(Prescription.id == id).first()
        if rx:
            db.session.delete(rx)
            db.session.commit()
            return make_response({}, 204)
        return make_response({'error': 'Prescription not found'}, 404)


api.add_resource(PrescriptionsById, '/prescriptions/<int:id>')
api.add_resource(Prescriptions, '/prescriptions')

class Dosage_histories(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                dosage_histories_list = user.dosage_histories

                dhs = [
                    {
                        **dh.to_dict(only=('id','user_id', 'date_taken', 'prescription_id')),
                        'prescription_name': dh.prescription.name if dh.prescription else None,
                        'doctor_name': Prescription.query.get(dh.prescription_id).doctor.name

                    }
                    for dh in dosage_histories_list
                ]
                return make_response(dhs, 200)
            else:
                return make_response({'error': 'User not found'}, 404)
        else:
            return make_response({'error': 'Not authorized, please log in'}, 401)
        
    def post(self):
            try:
                data = request.get_json()
                dh = Dosage_history(
                    date_taken= data['date_taken'],
                    user_id= data['user_id'],
                    prescription_id= data['prescription_id']
                )
                db.session.add(dh)
                db.session.commit()
                prescription_name = dh.prescription.name if dh.prescription else None
                doctor_name = dh.prescription.doctor.name if dh.prescription and dh.prescription.doctor else None

                # Include prescription and doctor names in the response
                response_data = dh.to_dict(only=('id', 'user_id', 'date_taken', 'prescription_id'))
                response_data['prescription_name'] = prescription_name
                response_data['doctor_name'] = doctor_name

                return make_response(response_data, 201)
            except ValueError:
                return make_response({'error': 'Failed to add new dosage history, try again!'}, 400)  

class Dosage_historiesByRxId(Resource):
    def get(self, id):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)            
            if user:
                dosage_histories_list = user.dosage_histories
                user_prescriptions = user.prescriptions

                dhs = [
                    {
                        **dh.to_dict(only=('id','user_id', 'date_taken', 'prescription_id')),
                        'prescription_name': dh.prescription.name if dh.prescription else None,
                        'doctor_name': Prescription.query.get(dh.prescription_id).doctor.name

                    }
                    for dh in dosage_histories_list if dh.prescription_id == id
                ]
                print(dhs, user.prescriptions)
                return make_response(dhs, 200)
            else:
                return make_response({'error': 'User not found'}, 404)
        else:
            return make_response({'error': 'Not authorized, please log in'}, 401)
        
api.add_resource(Dosage_historiesByRxId, '/dosage_histories_by_rx/<int:id>')    
class Dosage_historiesById(Resource):
    def get(self, id):
        dh = Dosage_history.query.filter(Dosage_history.id == id).first()
        
        if dh:
            prescription_name = dh.prescription.name if dh.prescription else None
            doctor_name = dh.prescription.doctor.name if dh.prescription and dh.prescription.doctor else None
            dh['prescription_name'] = prescription_name
            dh['doctor_name'] = doctor_name
            return make_response(dh.to_dict(only=('user_id', 'date_taken', 'prescription_id')), 200)
        return make_response({'error': 'Dosage history not found'},404)

    def patch(self, id):
        dh = Dosage_history.query.filter(Dosage_history.id == id).first()
        if dh:
            try:
                data = request.get_json()
                for attr in data:
                    setattr(dh, attr, data[attr])
                db.session.commit()
                # Get prescription and doctor names
                prescription_name = dh.prescription.name if dh.prescription else None
                doctor_name = dh.prescription.doctor.name if dh.prescription and dh.prescription.doctor else None

                # Include prescription and doctor names in the response
                response_data = dh.to_dict(only=('id', 'user_id', 'date_taken', 'prescription_id'))
                response_data['prescription_name'] = prescription_name
                response_data['doctor_name'] = doctor_name

                return make_response(response_data, 202)            
            except ValueError:
                return make_response({'error': 'Dosage history failed to edit'},400)
            
        else:
            return make_response({'error': 'Dosage history not found'},404)
        
    def delete(self, id):
        dh = Dosage_history.query.filter(Dosage_history.id == id).first()
        if dh:
            db.session.delete(dh)
            db.session.commit()
            return make_response({}, 204)
        return make_response({'error': 'Dosage history not found'}, 404)

api.add_resource(Dosage_histories, '/dosage_histories')
api.add_resource(Dosage_historiesById, '/dosage_histories/<int:id>')


class Doctors(Resource):
    def get(self): 
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                prescriptions = user.prescriptions
                doc= [prescription.doctor for prescription in prescriptions]
                unique_doc =  list(set(doc))
                dict_unique_doc = [doc.to_dict(only=('id', 'name')) for doc in unique_doc]

                return make_response(dict_unique_doc, 200)
                
            else:
                return make_response({'error': 'User not found'}, 404)
        else:
            return make_response({'error': 'Not authorized, please log in'}, 401)


    def post(self):
        try:
            data = request.get_json()
            md = Doctor(
                name= data['name']
                    )            
            db.session.add(md)
            db.session.commit()
            return make_response(md.to_dict(only=('name',)), 201)
        except ValueError:
            return make_response({'error': 'Failed to add new doctor, try again!'}, 400)  

class DoctorsById(Resource):
    def get(self, id):
        md = Doctor.query.filter(Doctor.id == id).first()
        if md:
            return make_response(md.to_dict(only=('name',)), 200)
        return make_response({'error': 'Doctor not found'},404)
    def patch(self, id):
        md = Doctor.query.filter(Doctor.id == id).first()
        if md:
            try:
                data = request.get_json()
                for attr in data:
                    setattr(md, attr, data[attr])
                db.session.commit()
                return make_response(md.to_dict(only=('name',)), 202)
            except ValueError:
                return make_response({'error': 'Failed to edit doctor'}, 400)

    def delete(self, id):
        doctor = Doctor.query.filter(Doctor.id == id).first()
        if doctor:
            db.session.delete(doctor)
            db.session.commit()
            return make_response({}, 204)
        return make_response({'error': 'Doctor not found'}, 404)
           
api.add_resource(DoctorsById, '/doctors/<int:id>')
api.add_resource(Doctors, '/doctors')


class Allergies(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                allergies = user.allergies
                allergy_list = [
                    {
                        **allergy.to_dict(only=('id', 'drug_allergy', 'symptoms')),
                        'user_name': allergy.user.name if allergy.user else None
                    }
                    for allergy in allergies
                    ]

                return make_response(allergy_list, 200)
            return make_response({'error': 'User not found'}, 404)
        return make_response({'error': 'Not authorized, please log in'}, 401)


    def post(self):
        user_id = session.get('user_id')
        if user_id:
            try:
                data = request.get_json()
                allergy = Allergy(
                    drug_allergy= data['drug_allergy'],
                    symptoms= data['symptoms'],
                    user_id= user_id
                        )            
                db.session.add(allergy)
                db.session.commit()
                user_name = allergy.user.name if allergy.user else None
                response_data = allergy.to_dict(only=('drug_allergy', 'symptoms','user_id'))
                response_data['user_name'] = user_name
                return make_response(response_data, 201)
            except ValueError:
                return make_response({'error': 'Failed to add new doctor, try again!'}, 400)  

api.add_resource(Allergies, '/allergies')

class AllergyById(Resource):
    def delete(self, id):
        allergy = Allergy.query.filter(Allergy.id == id).first()
        if allergy:
            db.session.delete(allergy)
            db.session.commit()
            return make_response({}, 204)
        return make_response({'error': 'Allergy not found'}, 404)
           
api.add_resource(AllergyById, '/allergies/<int:id>')


#authentification
class CheckSession(Resource):
    def get(self):
        user = User.query.filter(User.id == session.get('user_id')).first()
        if user:
            return user.to_dict(only=('id','name', 'username'))
        else:
            return {'message': '401: Not Authorized'}, 401

class Login(Resource):
    def post(self):
        try:
            username = request.get_json()['username']
            password = request.get_json()['password']

            user = User.query.filter(User.username == request.get_json()['username']).first()
            if user:
                if user.authenticate(password):
                    session['user_id'] = user.id
                    return user.to_dict(only=('id', 'name', 'username')), 200
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

