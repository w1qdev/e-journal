from datetime import datetime

from models import Report, ScheduleParam, Schedule, Journal

from exceptions import ApiError


def add(schedule_param_id: int, student_id: int, value: str):
    report = Report(
        schedule_param=schedule_param_id,
        student=student_id,
        value=value,
    )

    if value == '2':
        journal = Journal.get_or_none(schedule_param=schedule_param_id, student=student_id)
        if not journal:
            journal = Journal(
                schedule_param=schedule_param_id,
                student=student_id,
                rate='нб',
            )
            journal.save()

    report.save()

    return report.get_dto()


def edit(report_id: int, student_id: int, value: str):
    report = Report.get_or_none(id=report_id)
    if not report:
        raise ApiError.BadRequest('Запись в рапортичке не найдена')

    report.student = student_id
    report.value = value
    report.save()

    return report.get_dto()


def remove(report_id: int):
    report = Report.get_or_none(id=report_id)
    if not report:
        raise ApiError.BadRequest('Запись в рапортичке не найдена')

    if report.value == '2':
        Journal.delete().where((Journal.schedule_param == report.schedule_param) &
                               (Journal.student == report.student) & (Journal.rate == 'нб')).execute()

    return Report.delete().where(Report.id == report_id).execute()


def get_report(group_id: str, date_start: str, date_end: str):
    date_start = datetime.strptime(date_start, '%d.%m.%Y')
    date_end = datetime.strptime(date_end, '%d.%m.%Y')

    return [
        param.get_dto(with_report=True) for param in ScheduleParam.fetch(
            condition=((ScheduleParam.group == group_id) & (ScheduleParam.number != 0) & (Schedule.date >= date_start)
                      & (Schedule.date <= date_end)),
            with_report=True
        )
    ]
