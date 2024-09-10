from peewee import AutoField, DateField, BooleanField, prefetch

from database import BaseModel


class Schedule(BaseModel):
    id = AutoField(primary_key=True)
    date = DateField(null=False)
    visible = BooleanField(null=False, default=False)

    @classmethod
    def fetch(cls, condition=None, teacher=None):
        from models import ScheduleParam, Subject

        schedules = (
            cls
            .select()
            .where(condition)
            .objects()
        )
        if teacher:
            schedule_params = ScheduleParam.select().join(Subject).where(Subject.teacher == teacher)
        else:
            schedule_params = ScheduleParam.select()

        schedules_with_params = prefetch(schedules, schedule_params)

        return schedules_with_params

    def get_dto(self, with_params=False):
        default = {
            'id': self.id,
            'date': self.date,
            'visible': self.visible,
        }

        if with_params:
            default['params'] = [param.get_dto() for param in self.schedule_params if param.number != 0]

        return default

    class Meta:
        db_table = 'schedule'
