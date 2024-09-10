from peewee import AutoField, ForeignKeyField
from database import BaseModel
from models import Group, Subject


class GroupSubject(BaseModel):
    id = AutoField(primary_key=True)
    group = ForeignKeyField(Group, backref='subjects', on_delete='CASCADE', null=False)
    subject = ForeignKeyField(Subject, on_delete='CASCADE', null=False)

    def get_dto(self):
        return {
            'id': self.id,
            'group': {
                'id': self.group.id,
                'name': self.group.name,
                'course': self.group.course,
            },
            'subject': self.subject.get_dto()
        }

    class Meta:
        db_table = 'group_subject'
