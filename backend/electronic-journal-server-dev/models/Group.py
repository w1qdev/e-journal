from database import BaseModel
from peewee import TextField, AutoField, IntegerField, ForeignKeyField, prefetch

from models import Profession


class Group(BaseModel):
    id = AutoField(primary_key=True)
    name = TextField(null=False)
    course = IntegerField(null=False)
    profession = ForeignKeyField(Profession, backref='groups', on_delete='CASCADE', null=False)

    @classmethod
    def fetch(cls, condition=None):
        from models import Profession, GroupSubject

        groups = (
            cls
            .select(
                cls,
                Profession.id.alias('profession_id'),
                Profession.name.alias('profession_name'),
                Profession.slug.alias('profession_slug'),
            )
            .left_outer_join(Profession, on=(Profession.id == cls.profession))
            .where(condition)
            .order_by(cls.course.asc())
            .objects()
        )

        subjects = GroupSubject.select()
        group_with_subjects = prefetch(groups, subjects)

        return group_with_subjects

    def get_dto(self, with_users=False):
        try:
            tutor = {
                'id': self.tutor[0].tutor.id,
                'fullname': f'{self.tutor[0].tutor.last_name} {self.tutor[0].tutor.first_name} '
                            f'{self.tutor[0].tutor.surname}'
            }
        except:
            tutor = None

        default = {
            'id': self.id,
            'name': self.name,
            'course': self.course,
            'profession': {
                'id': self.profession_id,
                'name': self.profession_name,
                'slug': self.profession_slug,
            },
            'subjects': [group_subject.subject.get_dto() for group_subject in self.subjects],
            'tutor': tutor
        }

        if with_users:
            default['users'] = [user.get_dto(with_journal_report=True) for user in self.users]

        return default

    class Meta:
        db_table = 'group'
