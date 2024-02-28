import pytest

from app import app
from models import db, User, Prescription, Dosage_history, Doctor, Allergy
from faker import Faker


class TestApp:
    '''Flask application in app.py'''

    def test_gets_users(self):
        '''retrieves users with GET requests to /users.'''
        fake=Faker()

        with app.app_context():
            user1 = User(name=fake.name(), username=fake.name())
            user2 = User(name=fake.name(), username=fake.name())
            db.session.add_all([user1, user2])
            db.session.commit()

            response = app.test_client().get('/users')
            assert response.status_code == 200
            assert response.content_type == 'application/json'
            response = response.json
            users = User.query.all()
            assert [user['id'] for user in response] == [
                user.id for user in users]
            assert [user['name'] for user in response] == [
                users.name for users in users]
            assert [user['username'] for user in response] == [
                user.username for user in users]
            for user in response:
                assert 'name' in user
                assert 'username' in user
                assert 'prescriptions' not in user

    # def test_gets_user_by_id(self):
    #     '''retrieves one user using its ID with GET request to /users/<int:id>.'''

    #     with app.app_context():
    #         fake = Faker()
    #         user = User(name=fake.name(), username=fake.name())
    #         user.password_hash = 'asdasd1'

    #         auth_data = {"username": "Tracy", "password": "asdas1"}
    #         auth_response = app.test_client().post('/login', json=auth_data)
    #         print("Authentication Response:", auth_response.get_data(as_text=True))

    #         assert auth_response.status_code == 200  # Assuming successful login

    #         db.session.add_all([user])
    #         db.session.commit()

    #         response = app.test_client().get(f'/users/{auth_response.get['id']}')
    #         assert response.status_code == 200
    #         assert response.content_type == 'application/json'
    #         # assert response['name'] == user.name
    #         response = response.json
    #         assert response['username'] == 'Tracy'



