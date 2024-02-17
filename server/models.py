
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
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
    # classes = db.relationship('Class', back_populates='dog', cascade = 'all, delete')
    
    # Add serialization rules
    # serialize_rules=('-classes.dog',)

    # Add validation
    # @validates('name', 'owner', 'breed')
    # def validate_dog(self, key, value):
    #     if not value:
    #         raise ValueError('Name, Owner, and breed must exist!')
    #     return value


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
    
