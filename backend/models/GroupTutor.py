from peewee import AutoField, ForeignKeyField
from database import BaseModel
from models import User, Group


class GroupTutor(BaseModel):
    id = AutoField(primary_key=True)
    group = ForeignKeyField(Group, backref='tutor', on_delete='CASCADE', null=True)
    tutor = ForeignKeyField(User, on_delete='CASCADE', null=True)

    def get_dto(self):
        return {
            'id': self.id,
            'tutor': {
                'id': self.tutor.id,
                'fullname': f'{self.tutor.last_name} {self.tutor.first_name} {self.tutor.surname}'
            },
            'group': {
                'id': self.group.id,
                'name': self.group.name,
                'course': self.group.course,
                'profession': {
                    'id': self.profession.id,
                    'name': self.profession.name,
                    'slug': self.profession.slug,
                }
            },
        }

    class Meta:
        db_table = 'group_tutor'
