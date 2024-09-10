import datetime

from peewee import AutoField, IntegerField, DateField, ForeignKeyField, TextField

from database import BaseModel
from models import ScheduleParam, User


class Journal(BaseModel):
    id = AutoField(primary_key=True)
    schedule_param = ForeignKeyField(ScheduleParam, backref='journals', on_delete='CASCADE', null=False)
    student = ForeignKeyField(User, backref='journals', on_delete='CASCADE', null=False)
    rate = TextField(null=False)
    rate_date = DateField(null=False, default=datetime.date.today())

    def get_dto(self):
        return {
            'id': self.id,
            'schedule_param': self.schedule_param.get_dto(),
            'student': {
                'id': self.student.id,
                'fullname': f'{self.student.last_name} {self.student.first_name} {self.student.surname}'
            },
            'rate': self.rate,
            'rate_date': self.rate_date,
        }

    class Meta:
        db_table = 'journal'
