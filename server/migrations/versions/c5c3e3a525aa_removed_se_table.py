"""removed se table

Revision ID: c5c3e3a525aa
Revises: 55c8c617dd42
Create Date: 2024-02-17 23:31:35.814968

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c5c3e3a525aa'
down_revision = '55c8c617dd42'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('side_effects')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('side_effects',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('symptom', sa.VARCHAR(), nullable=True),
    sa.Column('user_id', sa.INTEGER(), nullable=True),
    sa.Column('prescription_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['prescription_id'], ['prescriptions.id'], name='fk_side_effects_prescription_id_prescriptions'),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='fk_side_effects_user_id_users'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###