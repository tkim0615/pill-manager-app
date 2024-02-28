from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import date, datetime, time
from config import db, metadata, bcrypt
import re



from config import db, metadata

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    username = db.Column(db.String)
    _password_hash = db.Column(db.String)

    # Add relationship
    dosage_histories = db.relationship('Dosage_history', backref='user', cascade = 'all, delete')
    prescriptions = db.relationship('Prescription', backref='user', cascade = 'all, delete')
    allergies = db.relationship('Allergy', backref='user', cascade = 'all, delete')

    # Add serialization rules
    serialize_rules=('-side_effects.user', '-dosage_histories.user', '-prescriptions.user', '-allergies.user')

    # Add validation
    @validates('name', 'username', 'password_hash')
    def validate_user(self, key, value):
        if value is None or (not value.strip()):
            raise ValueError('Name, username, and password must exist!')
        if key == 'password_hash':
            if (len(value) < 5 or len(value) > 11) or (not re.search("[a-z]", value)) or (not any(char.isdigit() for char in value)):
                raise ValueError("Invalid password. Must be 6 to 12 characters, contain lowercase and numbers")

        return value

    @hybrid_property
    def password_hash(self):    
        raise Exception('Password hashes may not be viewed.')
#removed decode, encoding
    @password_hash.setter
    def password_hash(self, password):
        self.validate_user('password_hash', password)  # Validate the password

        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

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
    image = db.Column(db.String)

        # Add relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'))

    dosage_histories = db.relationship('Dosage_history', backref='prescription', cascade = 'all, delete')

        # Add serialization rules
    serialize_rules=('-user.prescriptions', '-doctor.prescriptions', '-dosage_histories.prescription')


        #validations
    @validates('start_date', 'end_date', 'name')
    def validate_rx_date(self, key, value):
        if key == 'start_date' or key == 'end_date':
            if isinstance(value, str): 
                value = datetime.strptime(value, '%Y-%m-%d').date()
            elif isinstance(value, datetime):
                value = value.date()
            elif not isinstance(value, date):
                raise ValueError(f"ERROR: {key} must be of type datetime.date")
        if key == 'name':
            if not value or value == None:
                raise ValueError('Name must exist')
            return value
        return value
                

    def __repr__(self):
        return f'<Med : {self.name} direction:{self.direction} start: {self.start_date} end: self.end_date>'
    



class Doctor(db.Model, SerializerMixin):
    __tablename__ = 'doctors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    prescriptions = db.relationship('Prescription', backref='doctor', cascade='all, delete')

    serialize_rules=('-prescriptions.doctor',)



class Dosage_history(db.Model, SerializerMixin):
    __tablename__ = 'dosage_histories'

    id = db.Column(db.Integer, primary_key=True)
    date_taken= db.Column(db.DateTime)

    # Add relationship
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    prescription_id = db.Column(db.Integer, db.ForeignKey('prescriptions.id'))

        # Add serialization rules
    serialize_rules=('-user.dosage_histories', '-prescription.dosage_histories')

        #validations

    @validates('date_taken')
    def validate_dosage(self, key, value):
            if isinstance(value, str):
                try:
                    value = datetime.strptime(value, '%Y-%m-%d %H:%M')
                except ValueError:
                    raise ValueError("Invalid datetime format. Please use YYYY-MM-DD HH:MM.")
                return value
            elif not isinstance(value, datetime):
                raise ValueError(f"ERROR: {key} must be of type datetime.datetime")

            return value

    @validates('user_id', 'prescription_id')
    def validate_dose_ids(self, key, value):
        if key == 'user_id':
            user = User.query.filter(User.id == value).first()
            if not user:
                raise ValueError('User must exist!')
            return value
        if key == 'prescription_id':
            p = Prescription.query.filter(Prescription.id == value).first()
            
            if not p:
                raise ValueError('Prescription must exist!')
            if self.user_id != p.user_id:
                raise ValueError('User ID must match the User ID associated with the Prescription.')

            return value
        

class Allergy(db.Model, SerializerMixin):
    __tablename__ = 'allergies'

    id = db.Column(db.Integer, primary_key=True)
    drug_allergy = db.Column(db.String)
    symptoms = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    serialize_rules =('-user.allergies',)

