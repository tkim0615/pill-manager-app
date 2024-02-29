
from app import app
from models import db, User, Prescription, Dosage_history, Doctor, Allergy

import pytest


class TestModels:
    '''SQLAlchemy models in models.py'''

    def test_validates_user_name(self):
        '''require user to have names.'''
        with app.app_context():

            with pytest.raises(ValueError):
                User(name=None)
            
    def test_validates_user_name_string(self):
        with pytest.raises(ValueError):
                User(name='')

    def test_validate_user_username(self):
        '''require user to have username'''

        with pytest.raises(ValueError):
            User(username='')

    def test_validate_user_username_none(self):
        with pytest.raises(ValueError):
            User(username=None)


    def test_validate_user_password_not_be_able_to_see(self):
        with pytest.raises(Exception) as exc_info:
            u1 = User(name='John Lee', username='jl2')
            u1.password_hash = 'asdasd1'
            _ = u1.password_hash  # Attempting to access the hash should raise an exception

        assert 'Password hashes may not be viewed' in str(exc_info.value)

    def test_validate_user_passwords(self):
        '''require user to meet password requirements.'''

        with pytest.raises(ValueError):
            u1 = User(name='John Lee', username='jlee')
            u1.password_hash = 'a2'

    def test_validate_rx_date(self):
        '''require user to meet date requirements.'''

        with pytest.raises(ValueError):
            Prescription(start_date='2023/02/10')
            Prescription(start_date='')

    def test_validate_rx_date_time_included(self):
        with pytest.raises(ValueError):
            Prescription(start_date='2003-01-10 00:00:00')
    
    def test_validate_rx_non_date(self):
        with pytest.raises(ValueError):
                Prescription(start_date=2)


    def test_validate_rx_name(self):
        '''require prescription to have name'''
        with pytest.raises(ValueError) as exc_info:
            Prescription(name='',start_date='2003-01-10')
            Prescription(name=None,start_date='2003-01-10')
        assert 'Name must exist' in str(exc_info.value)


    def test_validate_dosage(self):
        '''require dosage to meet date requirements.'''
        with pytest.raises(ValueError):
            Dosage_history(date_taken='2023-02-10 12:12:02')
        with pytest.raises(ValueError):
            Dosage_history(date_taken='2023/02/10')
