#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import timedelta


# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Prescription, Side_effect, Dosage_history
fake = Faker()


def create_users():
    users = []
    for _ in range(2):
        u = User(
            name=fake.name(),
            username = fake.first_name()
        )
        u.password_hash = 'abc1'
        users.append(u)

    return users

def create_prescriptions():
    rxs = []
    drugs = ['Lipitor 20mg', 'Crestor 5mg', 'Tylenol 325mg', 'Aspirin 81mg', 'Enalapril 5mg', 'Amoxicillin 500mg', 'Metformin 500mg']
    directions = ['Take 1 tablet once a day', 'Take 1 tablet twice a day', 'Take 1 tablet three times a day']
    start_date = fake.date_this_year(before_today=True, after_today=True)
    end_date = fake.date_between_dates(date_start=start_date, date_end=start_date + timedelta(days=365))

    for _ in range(10):
        p = Prescription(
            name = rc(drugs),
            direction = rc(directions),
            start_date = start_date,
            end_date = end_date,
            completed=fake.boolean()
        )
        rxs.append(p)
    return rxs

def create_se(users, rxs):
    ses = []
    
    for _ in range(4):
        s = Side_effect(
            symptom = faker.sentence(),
            user_id=rc([user.id for user in users]),
            prescription_id = rc([prescription.id for rx in rxs])
        )

        ses.append(s)
    return ses
def create_dh(users, rxs):
    dosage_hxs = []

    for rx in rxs:
        for _ in range(5):  # Adjust the number of dosage histories per prescription as needed
            # Generate a random date_taken within the prescription's start and end dates
            date_taken = fake.date_between_dates(date_start=rx.start_date, date_end=rx.end_date)

            # Create Dosage_history instance
            dh = Dosage_history(
                time_taken=fake.time_object(),
                date_taken=date_taken,
                user_id=rc([user.id for user in users]),
                prescription_id=rx.id
            )
            dosage_hxs.append(dh)

    return dosage_hxs




if __name__ == '__main__':
    with app.app_context():
        print("Clearing db...")
        User.query.delete()
  

        print("Seeding users...")
        users =create_users()
        db.session.add_all(users)
        db.session.commit()

        print("Seeding rxs...")
        rxs = create_prescriptions()
        db.session.add_all(rxs)
        db.session.commit()

        print("Seeding ses...")
        ses = create_se(rxs, users)
        db.session.add_all(ses)
        db.session.commit()

        print("Seeding dosage_history...")
        dosage = create_se(rxs, users)
        db.session.add_all(dosage)
        db.session.commit()
    

        print("Done seeding!")
        # Seed code goes here!

