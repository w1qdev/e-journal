from peewee import AutoField, TextField, ForeignKeyField

from database import BaseModel
from models import ScheduleParam, User


class Report(BaseModel):
    id = AutoField(primary_key=True)
    schedule_param = ForeignKeyField(ScheduleParam, backref='reports', on_delete='CASCADE', null=False)
    student = ForeignKeyField(User, backref='reports', on_delete='CASCADE', null=False)
    value = TextField(null=False)

    def get_dto(self):
        return {
            'id': self.id,
            'schedule_param': self.schedule_param.get_dto(),
            'student': {
                'id': self.student.id,
                'fullname': f'{self.student.last_name} {self.student.first_name} {self.student.surname}'
            },
            'value': self.value,
        }

    class Meta:
        db_table = 'report'
