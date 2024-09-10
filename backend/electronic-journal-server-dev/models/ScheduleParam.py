from peewee import AutoField, IntegerField, TextField, ForeignKeyField, DateField, prefetch

from database import BaseModel
from models import Group, Schedule, Subject


class ScheduleParam(BaseModel):
    id = AutoField(primary_key=True)
    group = ForeignKeyField(Group, backref='schedule_params', on_delete='CASCADE', null=False)
    schedule = ForeignKeyField(Schedule, backref='schedule_params', on_delete='CASCADE', null=False)
    sub_group = TextField(null=True)
    subject = ForeignKeyField(Subject, on_delete='CASCADE', null=False)
    first_half = TextField(null=True)
    number = IntegerField(null=False)
    office = TextField(null=True)
    lesson_type = TextField(null=True)
    lesson_code = TextField(null=True)
    homework = TextField(null=True)
    topic = TextField(null=True)
    end_date = DateField(null=True)

    @classmethod
    def fetch(cls, condition=None, with_journal=False, with_report=False):
        from models import Journal, Report

        params = (
            cls
            .select()
            .where(condition)
            .objects()
        ).join(Schedule).order_by(Schedule.date, cls.number)

        if with_journal:
            journals = Journal.select()

            params_with_journal = prefetch(params, journals)

            return params_with_journal

        if with_report:
            reports = Report.select()

            params_with_reports = prefetch(params, reports)

            return params_with_reports

        return params

    def get_dto(self, with_journal=False, with_report=False):
        default = {
            'id': self.id,
            'group': {
                'id': self.group.id,
                'name': self.group.name,
                'course': self.group.course,
            },
            'schedule': {
                'id': self.schedule.id,
                'date': self.schedule.date,
            },
            'sub_group': self.sub_group,
            'subject': self.subject.get_dto(),
            'first_half': self.first_half,
            'number': self.number,
            'office': self.office,
            'lesson_type': self.lesson_type,
            'homework': self.homework,
            'lesson_code': self.lesson_code,
            'topic': self.topic,
            'end_date': self.end_date,
        }

        if with_journal:
            default['journal'] = [journal.get_dto() for journal in self.journals]

        if with_report:
            default['report'] = [report.get_dto() for report in self.reports]

        return default

    class Meta:
        db_table = 'schedule_param'
