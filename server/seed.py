#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User
fake = Faker()


def create_users():
    users = []
    for _ in range(5):
        u = User(
            name=fake.name(),
            username = fake.first_name()
        )
        u.password_hash = 'abc1'
        users.append(u)

    return users

if __name__ == '__main__':
    with app.app_context():
        print("Clearing db...")
        User.query.delete()
  

        print("Seeding users...")
        users =create_users()
        db.session.add_all(users)
        db.session.commit()

        # print("Seeding trainers...")
        # trainers = create_trainers()
        # db.session.add_all(trainers)
        # db.session.commit()

        # print("Seeding classes...")
        # classes = create_classes(dogs, trainers)
        # db.session.add_all(classes)
        # db.session.commit()

        print("Done seeding!")
        # Seed code goes here!

