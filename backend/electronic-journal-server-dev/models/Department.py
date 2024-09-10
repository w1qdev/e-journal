from peewee import AutoField, TextField

from database import BaseModel


class Department(BaseModel):
    id = AutoField(primary_key=True)
    name = TextField(null=False)

    def get_dto(self):
        try:
            president = {
                'id': self.president[0].president.id,
                'fullname': f'{self.president[0].president.last_name} {self.president[0].president.first_name} '
                            f'{self.president[0].president.surname}'
            }
        except:
            president = None

        return {
            'id': self.id,
            'name': self.name,
            'president': president
        }

    class Meta:
        db_table = 'department'
