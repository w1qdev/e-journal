from peewee import TextField, AutoField, ForeignKeyField
from database import BaseModel
from models import Role, Group, Department


class User(BaseModel):
    id = AutoField(primary_key=True)
    username = TextField(null=False, unique=True)
    email = TextField(null=True)
    hashed_password = TextField(null=False)
    last_name = TextField(null=False)
    first_name = TextField(null=False)
    surname = TextField(null=True)
    role = ForeignKeyField(Role, on_delete='SET NULL', null=True)
    group = ForeignKeyField(Group, backref='users', on_delete='SET NULL', null=True)
    department = ForeignKeyField(Department, null=True)

    def get_dto(self, with_journal_report=False):
        default = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'last_name': self.last_name,
            'first_name': self.first_name,
            'surname': self.surname,
            'full_name': f'{self.last_name} {self.first_name} {self.surname}',
        }

        if with_journal_report:
            default['journal'] = [journal.get_dto() for journal in self.journals]
            default['report'] = [report.get_dto() for report in self.reports]

        if self.role:
            default['role'] = {
                'id': self.role.id,
                'name': self.role.name,
                'slug': self.role.slug,
            }

        if self.group:
            default['group'] = {
                'id': self.group.id,
                'name': self.group.name,
                'course': self.group.course,
                'profession': {
                    'id': self.group.profession.id,
                    'name': self.group.profession.name,
                    'slug': self.group.profession.slug,
                }
            }

        if self.department:
            default['department'] = {
                'id': self.department.id,
                'name': self.department.name,
            }

        return default

    class Meta:
        db_table = 'user'
