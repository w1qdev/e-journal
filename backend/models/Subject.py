from peewee import AutoField, ForeignKeyField, TextField

from database import BaseModel
from models import User


class Subject(BaseModel):
    id = AutoField(primary_key=True)
    name = TextField(null=False)
    slug = TextField(null=False)
    code = TextField(null=False)
    teacher = ForeignKeyField(User, on_delete='SET NULL', null=True)

    def get_dto(self):
        default = {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'code': self.code,
            'teacher': self.teacher
        }

        if self.teacher:
            default['teacher'] = {
                'id': self.teacher.id,
                'fullname': f'{self.teacher.last_name} {self.teacher.first_name[0]}. {self.teacher.surname[0]}.'
            }

        return default

    class Meta:
        db_table = 'subject'
