"""add doctor table

Revision ID: 15f94d7f434e
Revises: c5c3e3a525aa
Create Date: 2024-02-17 23:41:29.853064

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '15f94d7f434e'
down_revision = 'c5c3e3a525aa'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('doctors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('prescriptions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('doctor_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_prescriptions_doctor_id_doctors'), 'doctors', ['doctor_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('prescriptions', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_prescriptions_doctor_id_doctors'), type_='foreignkey')
        batch_op.drop_column('doctor_id')

    op.drop_table('doctors')
    # ### end Alembic commands ###