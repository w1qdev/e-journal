from peewee import AutoField, ForeignKeyField

from database import BaseModel
from models import User, Department


class DepartmentPresident(BaseModel):
    id = AutoField(primary_key=True)
    department = ForeignKeyField(Department, backref='president', on_delete='CASCADE', null=False)
    president = ForeignKeyField(User, on_delete='CASCADE', null=False)

    def get_dto(self):
        return {
            'id': self.id,
            'department': {
                'id': self.department.id,
                'name': self.department.name,
            },
            'president': {
                'id': self.president.id,
                'fullname': f'{self.president.last_name} {self.president.first_name} {self.president.surname}'
            },
        }

    class Meta:
        db_table = 'department_president'
