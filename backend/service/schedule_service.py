from datetime import datetime
import io
import xlsxwriter

from models import Schedule, ScheduleParam, Group, Subject, User
from exceptions import ApiError

weekdays_en_ru = {
        'Monday': 'Понедельник',
        'Tuesday': 'Вторник',
        'Wednesday': 'Среда',
        'Thursday': 'Четверг',
        'Friday': 'Пятница',
        'Saturday': 'Суббота',
        'Sunday': 'Воскресенье',
}

lessons_time = ['8:30 - 10:05', '10:15 - 11:50', '12:20 - 13:55', '14:05 - 15:40', '15:50 - 17:25', '17:35 - 19:10']
saturday_lessons_time = ['8:30 - 10:05', '10:15 - 11:50', '12:05 - 13:40', '13:50 - 15:25', '15:30 - 17:05',
                         '17:15 - 18:50']


def create(date: datetime):
    schedule = Schedule(date=date)
    schedule.save()
    return schedule.get_dto()


def remove(schedule_id: int):
    schedule = Schedule.delete().where(Schedule.id == schedule_id)
    schedule.execute()


def edit(schedule_id: int, date: str):
    schedule = Schedule.get_or_none(Schedule.id == schedule_id)
    if not schedule:
        raise ApiError.BadRequest('Расписание не найдено')

    schedule.date = date
    schedule.save()

    return schedule.get_dto()


def get_schedules():
    return [schedule.get_dto() for schedule in Schedule.select().order_by(Schedule.date.desc())]


def get_schedule(schedule_id: int):
    schedule = Schedule.get_or_none(Schedule.id == schedule_id)
    if not schedule:
        raise ApiError.BadRequest('Расписание не найдено')

    schedule = Schedule.fetch(Schedule.id == schedule_id)[0]

    return schedule.get_dto(with_params=True)


def change_visibility(schedule_id: int, visible: bool):
    schedule = Schedule.get_or_none(Schedule.id == schedule_id)
    if not schedule:
        raise ApiError.BadRequest('Расписание не найдено')

    schedule.visible = visible
    schedule.save()

    return schedule.get_dto()


def urtk_schedules():
    schedules = Schedule.select().where(Schedule.visible == True).order_by(Schedule.date.asc())

    urtk_schedules = {
        'dates': [schedule.date.strftime("%d.%m.%Y") for schedule in schedules],
        'lesson_number': 6,
        'courses': []
    }

    for course in range(1, 5):
        course_obj = {
            'name': course,
            'groups': []
        }

        groups = Group.select().where(Group.course == course)

        for group in groups:
            group_obj = {
                'name': group.name,
                'schedule': []
            }

            for schedule in schedules:
                schedule_params = ScheduleParam.select().where(
                    (ScheduleParam.schedule == schedule) & (ScheduleParam.group == group) & (
                                ScheduleParam.number != 0)
                ).order_by(ScheduleParam.number.asc())

                day = {
                    'date': schedule.date.strftime("%d.%m.%Y"),
                    'day': weekdays_en_ru[schedule.date.strftime("%A")],
                    'lessons': [{
                        'number': ' ',
                        'time': ' ',
                        'name': ' ',
                        'office': ' '
                    } for lesson in range(6)]
                }

                for index, param in enumerate(schedule_params):
                    subject = Subject.get_or_none(Subject.id == param.subject).get_dto()

                    lesson_name = f'{subject["slug"]}'

                    if param.sub_group:
                        lesson_name += f' {param.sub_group}'

                    if param.first_half:
                        lesson_name = f'{param.first_half}/{lesson_name}'

                    if subject["teacher"]:
                        lesson_name += f' {subject["teacher"]["fullname"]}'

                    if day['day'] != 'Суббота':
                        time = lessons_time[param.number - 1]
                    else:
                        time = saturday_lessons_time[param.number - 1]

                    if index > 0 and param.number == schedule_params[index - 1].number:
                        day['lessons'][param.number - 1]['name'] += f'/\n{lesson_name}'
                        day['lessons'][param.number - 1]['office'] += f'/{param.office}'
                    else:
                        day['lessons'][param.number - 1] = {
                            'number': param.number,
                            'time': time,
                            'name': f'{lesson_name}',
                            'office': f'{param.office}'
                        }

                group_obj['schedule'].append(day)

            course_obj['groups'].append(group_obj)

        urtk_schedules['courses'].append(course_obj)

    return urtk_schedules


def urtk_schedules_download():
    file_stream = io.BytesIO()

    document_name = 'Расписание.xlsx'
    workbook = xlsxwriter.Workbook(file_stream)

    urtk_schedule = urtk_schedules()

    with workbook:
        default_cell_format = workbook.add_format()
        default_cell_format.set_align('center')
        default_cell_format.set_align('vcenter')
        default_cell_format.set_text_wrap()
        default_cell_format.set_border()
        default_cell_format.set_font_size(8)

        bold_format = workbook.add_format()
        bold_format.set_align('center')
        bold_format.set_align('vcenter')
        bold_format.set_text_wrap()
        bold_format.set_bold()
        bold_format.set_font_size(12)

        bold_border_format = workbook.add_format()
        bold_border_format.set_align('center')
        bold_border_format.set_align('vcenter')
        bold_border_format.set_text_wrap()
        bold_border_format.set_bold()
        bold_border_format.set_border()
        bold_border_format.set_font_size(12)

        date_format = workbook.add_format()
        date_format.set_align('center')
        date_format.set_align('vcenter')
        date_format.set_text_wrap()
        date_format.set_bold()
        date_format.set_border()
        date_format.set_rotation(90)
        date_format.set_font_size(12)

        for course in urtk_schedule['courses']:
            worksheet = workbook.add_worksheet(f'{course["name"]} курс')

            dates, year = [None, None]

            if len(urtk_schedule["dates"]) != 0:
                year = datetime.strptime(urtk_schedule["dates"][0], "%d.%m.%Y").year
                if len(urtk_schedule["dates"]) >= 2:
                    dates = f'{urtk_schedule["dates"][0]} - {urtk_schedule["dates"][len(urtk_schedule["dates"]) - 1]}'
                else:
                    dates = f'{urtk_schedule["dates"][0]}'

            worksheet.merge_range(0, 0, 0, len(urtk_schedule['courses'])*3+1,
                                  f'Расписание занятий групп {course["name"]} курса на {dates} {year} года',
                                  bold_format)
            worksheet.write(1, 0, '', default_cell_format)

            row = 2
            for date in urtk_schedule["dates"]:
                worksheet.merge_range(row, 0, row+5, 0, date, date_format)
                worksheet.set_column(0, 0, 4.57)
                row += 6

            group_col = 1
            for group in course['groups']:
                row = 1
                if row == 1:
                    worksheet.merge_range(row, group_col, row, group_col+2, group['name'], bold_border_format)

                row += 1
                for day in group['schedule']:
                    for lesson in day['lessons']:
                        worksheet.write(row, group_col, lesson['time'], default_cell_format)
                        worksheet.set_column(group_col, group_col, 6.43)

                        worksheet.write(row, group_col+1, lesson['name'], default_cell_format)
                        worksheet.set_column(group_col+1, group_col+1, 20.57)

                        worksheet.write(row, group_col+2, lesson['office'], default_cell_format)
                        worksheet.set_column(group_col+2, group_col+2, 4.29)

                        worksheet.set_row(row, 21.75)

                        row += 1

                group_col += 3

    file_stream.seek(0)

    return file_stream, document_name


def get_group_schedule(group_id: int):
    schedules = Schedule.select().where(Schedule.visible == True).order_by(Schedule.date.asc())

    group = Group.get_or_none(Group.id == group_id)

    if group:
        group_obj = {
            'name': group.name,
            'schedule': []
        }

        for schedule in schedules:
            schedule_params = ScheduleParam.select().where(
                (ScheduleParam.schedule == schedule) & (ScheduleParam.group == group) & (ScheduleParam.number != 0)) \
                .order_by(ScheduleParam.number.asc())

            day = {
                'date': schedule.date.strftime("%d.%m.%Y"),
                'day': weekdays_en_ru[schedule.date.strftime("%A")],
                'lessons': [{} for lesson in range(6)]
            }

            for index, param in enumerate(schedule_params):
                subject = Subject.get_or_none(Subject.id == param.subject).get_dto()

                lesson_name = f'{subject["slug"]}'

                if param.sub_group:
                    lesson_name += f' {param.sub_group}'

                if param.first_half:
                    lesson_name = f'{param.first_half}/{lesson_name}'

                if subject["teacher"]:
                    lesson_name += f' {subject["teacher"]["fullname"]}'

                if day['day'] != 'Суббота':
                    time = lessons_time[param.number-1]
                else:
                    time = saturday_lessons_time[param.number-1]

                if index > 0 and param.number == schedule_params[index-1].number:
                    day['lessons'][param.number-1]['name'] += f'/\n{lesson_name}'
                    day['lessons'][param.number-1]['office'] += f'/{param.office}'
                else:
                    day['lessons'][param.number-1] = {
                        'number': param.number,
                        'time': time,
                        'name': f'{lesson_name}',
                        'office': f'{param.office}',
                        'sub_group': f'{param.sub_group}'
                    }

            group_obj['schedule'].append(day)

        return group_obj

    raise ApiError.BadRequest('Группа не найдена')


def get_teacher_schedule(user: User, date_start: str, date_end: str):
    date_start = datetime.strptime(date_start, '%d.%m.%Y')
    date_end = datetime.strptime(date_end, '%d.%m.%Y')

    schedules = Schedule.fetch(
        condition=(Schedule.date >= date_start) & (Schedule.date <= date_end),
        teacher=user.id
    )
    schedules = [schedule.get_dto(with_params=True) for schedule in schedules]

    new_schedule = []
    for schedule in schedules:
        day = {
            'date': schedule['date'].strftime("%d.%m.%Y"),
            'day': weekdays_en_ru[schedule['date'].strftime("%A")],
            'lessons': [{} for lesson in range(6)]
        }

        for index, param in enumerate(schedule['params']):
            lesson_name = f'{param["subject"]["slug"]}'

            if param['sub_group']:
                lesson_name += f' ({param["sub_group"]} пг)'

            if param['first_half']:
                lesson_name = f'({param["first_half"]}) {lesson_name}'

            lesson_name += f' {param["subject"]["teacher"]["fullname"]}'

            if day['day'] != 'Суббота':
                time = lessons_time[param['number'] - 1]
            else:
                time = saturday_lessons_time[param['number'] - 1]

            if index > 0 and param['number'] == schedule['params'][index - 1]['number']:
                day['lessons'][param['number'] - 1]['name'] += f'/{lesson_name}'
                day['lessons'][param['number'] - 1]['office'] += f'/{param["office"]}'
            else:
                day['lessons'][param['number'] - 1] = {
                    'number': param['number'],
                    'time': time,
                    'name': lesson_name,
                    'office': param['office'],
                    'group': param['group']['name']
                }

        new_schedule.append(day)

    return new_schedule
