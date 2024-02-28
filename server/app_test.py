
from app import app
from models import User, Prescription, Dosage_history, Doctor, Allergy

import pytest


class TestModels:
    '''SQLAlchemy models in models.py'''

    def test_validates_user_name(self):
        '''require user to have names.'''

        with app.app_context():

            with pytest.raises(ValueError):
                User(name=None)
            with pytest.raises(ValueError):
                User(name='')

    def test_validate_user_passwords(self):
        '''require user to meet password requirements.'''

        with pytest.raises(ValueError):
            u1 = User(name='John Lee', username='jlee')
            u1.password_hash = 'a2'

    def test_validate_rx_date(self):
        '''require user to meet date requirements.'''


        with pytest.raises(ValueError):
            Prescription(start_date='2023/02/10')
            Prescription(start_date='2003-01-10 00:00:00')
            Prescription(start_date='')
            Prescription(start_date=2)







# def test_add():
#     result = add(1, 3)
#     assert result == 4

# def test_divide():
#     result = divide(6, 3)
#     assert result ==2

# def test_divide_zero():
#     with pytest.raises(ZeroDivisionError):
#         divide(1, 0)
