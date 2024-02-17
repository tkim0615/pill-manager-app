from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import date, datetime, time
from config import db, metadata, bcrypt


from config import db, metadata

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String)
    _password_hash = db.Column(db.String)

    # Add relationship
    side_effects = db.relationship('Side_effect', backref='user', cascade = 'all, delete')
    dosage_histories = db.relationship('Dosage_history', backref='user', cascade = 'all, delete')

    # Add serialization rules
    serialize_rules=('-side_effects.user',)

    # Add validation
    @validates('name', 'username', 'password_hash')
    def validate_user(self, key, value):
        if not value:
            raise ValueError('Name, username, and password must exist!')
        return value

    @hybrid_property
    def password_hash(self):    
        raise Exception('Password hashes may not be viewed.')
#removed decode, encoding
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password)
        self._password_hash = password_hash

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password)


    def __repr__(self):
        return f'<User {self.id}: {self.name} username:{self.username}>'
    

class Prescription(db.Model, SerializerMixin):
    __tablename__ = 'prescriptions'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    direction = db.Column(db.String)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    completed = db.Column(db.Boolean)

        # Add relationship
    side_effects = db.relationship('Side_effect', backref='prescription', cascade = 'all, delete')
    dosage_histories = db.relationship('Dosage_history', backref='prescription', cascade = 'all, delete')

        # Add serialization rules
    serialize_rules=('-side_effects.prescription',)
    
        #validations
    @validates('start_date', 'end_date')
    def validate_rx_date(self, key, value):
            if isinstance(value, str): 
                value = datetime.strptime(value, '%Y-%m-%d').date()
            elif isinstance(value, datetime):
                value = value.date()
            elif not isinstance(value, date):
                raise ValueError(f"ERROR: {key} must be of type datetime.date")
            return value


    def __repr__(self):
        return f'<Med : {self.name} direction:{self.direction} start: {self.start_date} end: self.end_date>'
    
class Side_effect(db.Model, SerializerMixin):
    __tablename__ = 'side_effects'

    id = db.Column(db.Integer, primary_key=True)
    symptom = db.Column(db.String)
    
    # Add relationship 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    prescription_id = db.Column(db.Integer, db.ForeignKey('prescriptions.id'))

    
     # Add serialization rules
    serialize_rules=('-user.side_effects', '-prescription.side_effects')
    
        #validations

class Dosage_history(db.Model, SerializerMixin):
    __tablename__ = 'dosage_histories'

    id = db.Column(db.Integer, primary_key=True)
    time_taken = db.Column(db.Time)
    date_taken= db.Column(db.Date)

    # Add relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    prescription_id = db.Column(db.Integer, db.ForeignKey('prescriptions.id'))

        # Add serialization rules
    serialize_rules=('-user.dosage_histories', '-prescription.dosage_histories')

        #validations


    @validates('time_taken', 'date_taken')
    def validate_dosage(self, key, value):
        if key == 'time_taken':
            try:
                # Parse the time string to a datetime object
                time_object = datetime.strptime(value, '%H:%M').time()
                return time_object
            except ValueError:
                raise ValueError("Invalid time format. Please use HH:MM.")

        elif key == 'date_taken':
            if isinstance(value, str): 
                try:
                    value = datetime.strptime(value, '%Y-%m-%d').date()
                except ValueError:
                    raise ValueError("Invalid date format. Please use YYYY-MM-DD.")
            elif not isinstance(value, date):
                raise ValueError(f"ERROR: {key} must be of type datetime.date")
        return value



