from datetime import datetime

from models import ScheduleParam, Subject, Schedule, Group
from exceptions import ApiError


def add(schedule_id: int, group_id: int, sub_group: str, subject_id: int, first_half: str, number: int, office: str):
    schedule = Schedule.get_or_none(id=schedule_id)
    if not schedule:
        raise ApiError.BadRequest('Расписание не найдено')

    group = Group.get_or_none(id=group_id)
    if not group:
        raise ApiError.BadRequest('Группа не найдена')

    subject = Subject.get_or_none(id=subject_id)
    if not subject:
        raise ApiError.BadRequest('Предмет не найден')

    param_w_office = ScheduleParam.get_or_none(schedule=schedule, number=number, office=office)
    if office not in ['с/з', 'с/р', 'а/з', 'ДОТ', ' '] and param_w_office:
        raise ApiError.BadRequest(f'Аудитория {office} назначена группе {param_w_office.group.name}')

    schedule_param = ScheduleParam(schedule=schedule_id, group=group_id, sub_group=sub_group, subject=subject_id,
                                   first_half=first_half, number=number, office=office)
    schedule_param.save()

    return schedule_param.get_dto()


def add_certification(schedule_id: int, group_id: int, subject_id: int, certification_period: str):
    schedule = Schedule.get_or_none(id=schedule_id)
    if not schedule:
        raise ApiError.BadRequest('Расписание не найдено')

    group = Group.get_or_none(id=group_id)
    if not group:
        raise ApiError.BadRequest('Группа не найдена')

    subject = Subject.get_or_none(id=subject_id)
    if not subject:
        raise ApiError.BadRequest('Предмет не найден')

    schedule_param = ScheduleParam(schedule=schedule_id, group=group_id, subject=subject_id, number=0,
                                   lesson_type='LECTURE', lesson_code=certification_period)
    schedule_param.save()

    return schedule_param.get_dto()


def edit(param_id: int, subject_id: int, sub_group: str, first_half: str, office: str,
         lesson_type: str, lesson_code: str, topic: str, homework: str, end_date: datetime):
    schedule_param = ScheduleParam.select().where(ScheduleParam.id == param_id)
    if len(schedule_param) == 0:
        raise ApiError.BadRequest('Запись в расписании не найдена')

    param_w_office = ScheduleParam.select().where(ScheduleParam.schedule == schedule_param[0].schedule,
                                                  ScheduleParam.number == schedule_param[0].number,
                                                  ScheduleParam.office == office,
                                                  ScheduleParam.group != schedule_param[0].group
                                                  )

    if office not in ['с/з', 'с/р', 'а/з', 'ДОТ', ' '] and param_w_office:
        raise ApiError.BadRequest(f'Аудитория {office} назначена группе {param_w_office.group.name}')

    schedule_param[0].subject = subject_id
    schedule_param[0].sub_group = sub_group
    schedule_param[0].first_half = first_half
    schedule_param[0].office = office
    schedule_param[0].lesson_type = lesson_type
    schedule_param[0].lesson_code = lesson_code
    schedule_param[0].topic = topic
    schedule_param[0].homework = homework
    schedule_param[0].end_date = end_date
    schedule_param[0].save()

    return schedule_param[0].get_dto()


def remove(user_role: str, param_id: int):
    schedule_param = ScheduleParam.get_or_none(id=param_id)
    if user_role == 'TEACHER' and schedule_param.number != 0:
        raise ApiError.Forbidden()
    
    schedule_param = ScheduleParam.delete().where(ScheduleParam.id == param_id)
    schedule_param.execute()
    return


def by_id(schedule_param_id: int):
    schedule_param = ScheduleParam.get_or_none(id=schedule_param_id)
    if not schedule_param:
        raise ApiError.BadRequest('Запись в расписании не найдена')

    return schedule_param.get_dto()
