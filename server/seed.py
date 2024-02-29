#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import timedelta, datetime, time


# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Prescription, Doctor, Dosage_history, Allergy
fake = Faker()


def create_users():
    users = []
    for _ in range(3):
        u = User(
            name=fake.name(),
            username = fake.first_name()
        )
        u.password_hash = 'asdas1'

        users.append(u)

    return users

def create_doctors():
    doctors = []
    for _ in range(5):
        d = Doctor(
            name=fake.name()
        )
        doctors.append(d)

    return doctors

def create_allergies(users):

    allergies = []
    drugs = ['telmisartan 80mg','Lipitor 20mg', 'Crestor 5mg', 'Tylenol 325mg', 'Enalapril 5mg', 'Amoxicillin 500mg', 'Metformin 500mg', 'Warfarin 10mg', 'Tamsulosin 75mg', 'Finasteride 5mg', 'dutasteride 5 mg']
    symptom_list = ['Stomache', 'Headache', 'Cough', 'Nausea', 'Diarrhea']

    for _ in range(6):
        a = Allergy(
            drug_allergy= rc(drugs),
            symptoms= rc(symptom_list),
            user_id=rc([user.id for user in users])
        )
        allergies.append(a)
    return allergies


def create_prescriptions(users, doctors):
    rxs = []
    drugs = ['telmisartan 80mg','Lipitor 20mg', 'Crestor 5mg', 'Tylenol 325mg', 'Aspirin 81mg', 'Enalapril 5mg', 'Amoxicillin 500mg', 'Metformin 500mg', 'Warfarin 10mg', 'Tamsulosin 75mg', 'Finasteride 5mg', 'dutasteride 5 mg']
    directions = ['Take 1 tablet once a day', 'Take 1 tablet twice a day', 'Take 1 tablet three times a day']
    start_date = fake.date_this_year(before_today=True, after_today=True)
    end_date = fake.date_between_dates(date_start=start_date, date_end=start_date + timedelta(days=365))

    for _ in range(20):
        start_date = fake.date_this_year(before_today=True, after_today=True)
        end_date = fake.date_between_dates(date_start=start_date, date_end=start_date + timedelta(days=365))
        p = Prescription(
            name = rc(drugs),
            direction = rc(directions),
            start_date = start_date,
            end_date = end_date,
            completed=fake.boolean(),
            user_id=rc([user.id for user in users]),
            doctor_id=rc([doctor.id for doctor in doctors])
        )
        rxs.append(p)
    return rxs

    
def create_dh(users, rxs):
    dosage_hxs = []

    for rx in rxs:
        user_ids_for_rx = [user.id for user in users if user.id == rx.user_id]

        if not user_ids_for_rx:
            # Skip creating dosage histories if the prescription's user is not found in the provided user list
            continue

        for _ in range(10):  # Adjust the number of dosage histories per prescription as needed
            date_taken = fake.date_between_dates(date_start=rx.start_date, date_end=rx.end_date)
            date_taken = datetime.combine(date_taken, time())
            
            # Randomly select a user from the list of users associated with the prescription
            user_id = rc(user_ids_for_rx)

            dh = Dosage_history(
                date_taken=date_taken,
                user_id=user_id,
                prescription_id=rx.id
            )
            dosage_hxs.append(dh)

    return dosage_hxs





if __name__ == '__main__':
    with app.app_context():
        print("Clearing db...")
        User.query.delete()
        Doctor.query.delete()
        Prescription.query.delete()
        Dosage_history.query.delete()
        Allergy.query.delete()

  
        print("Seeding users...")
        users =create_users()
        db.session.add_all(users)
        db.session.commit()

        print("Seeding doctor...")
        doctors = create_doctors()
        db.session.add_all(doctors)
        db.session.commit()

        print("Seeding rxs...")
        rxs = create_prescriptions(users, doctors)
        db.session.add_all(rxs)
        db.session.commit()

        print("Seeding allergies...")
        allergies = create_allergies(users)
        db.session.add_all(allergies)
        db.session.commit()

        print("Seeding dosage_history...")
        dosage = create_dh(users, rxs)
        db.session.add_all(dosage)
        db.session.commit()
    

        print("Done seeding!")
        # Seed code goes here!

