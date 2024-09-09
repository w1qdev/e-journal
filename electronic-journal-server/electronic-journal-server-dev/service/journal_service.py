from models import Journal, ScheduleParam, Report

from exceptions import ApiError


def add(schedule_param_id: int, student_id: int, rate: str):
    journal = Journal(
        schedule_param=schedule_param_id,
        student=student_id,
        rate=rate,
    )

    if rate == 'нб':
        report = Report.get_or_none(schedule_param=schedule_param_id, student=student_id)
        if not report:
            report = Report(
                schedule_param=schedule_param_id,
                student=student_id,
                value=2,
            )
            report.save()

    journal.save()

    return journal.get_dto()


def edit(journal_id: int, student_id: int, rate: str):
    journal = Journal.get_or_none(id=journal_id)
    if not journal:
        raise ApiError.BadRequest('Запись в журнале не найдена')

    journal.student = student_id
    journal.rate = rate
    journal.save()

    return journal.get_dto()


def remove(journal_id: int):
    journal = Journal.get_or_none(id=journal_id)
    if not journal:
        raise ApiError.BadRequest('Запись в журнале не найдена')

    if journal.rate == 'нб':
        Report.delete().where((Report.schedule_param == journal.schedule_param) &
                              (Report.student == journal.student) & (Report.value == 2)).execute()

    return Journal.delete().where(Journal.id == journal_id).execute()


def get_journal(group_id: str, subject_id: str, lesson_type: str):
    if lesson_type == 'ALL':
        condition = ((ScheduleParam.group == group_id) & (ScheduleParam.subject == subject_id))
    else:
        condition = ((ScheduleParam.group == group_id) & (ScheduleParam.subject == subject_id) &
                     ((ScheduleParam.lesson_type == lesson_type) | (ScheduleParam.lesson_type >> None)))

    params = [param.get_dto(with_journal=True) for param in ScheduleParam.fetch(
        condition=condition,
        with_journal=True
    )]


    for i in range(len(params)):
        for j in range(i):
            if params[j]['schedule'] == params[j + 1]['schedule'] and params[j]['number'] == 0 and params[j+1]['number'] != 0:
                params[j], params[j + 1] = params[j + 1], params[j]

    return params
