from models import Group, GroupTutor
from exceptions import ApiError


def create(name: str, course: int, profession_id: int, tutor_id: int):
    group = Group(
        name=name,
        course=course,
        profession=profession_id,
    )
    group.save()

    tutor = GroupTutor(
        group=group,
        tutor=tutor_id
    )
    tutor.save()

    return Group.fetch(Group.id == group)[0].get_dto()


def remove(group_id: int):
    group = Group.delete().where(Group.id == group_id)
    group.execute()
    return


def edit(group_id: int, name: str, course: int, profession_id: int, tutor_id: int):
    group = Group.get_or_none(id=group_id)
    if not group:
        raise ApiError.BadRequest('Группа не найдена')

    group.name = name
    group.course = course
    group.profession = profession_id
    group.save()

    group_tutor = GroupTutor.get_or_none(group=group_id)
    group_tutor.tutor = tutor_id
    group_tutor.save()

    return Group.fetch(Group.id == group)[0].get_dto()


def get_groups():
    return [group.get_dto() for group in Group.fetch()]


def get_group(group_id: int):
    group = Group.get_or_none(id=group_id)
    if not group:
        raise ApiError.BadRequest('Группа не найдена')

    return Group.fetch(Group.id == group)[0].get_dto()


def get_urtk_groups():
    courses = []
    for course in range(1, 5):
        course_obj = {
            'name': course,
            'groups': []
        }

        groups = Group.select().where(Group.course == course)

        for group in groups:
            group_obj = {
                'id': group.id,
                'name': group.name,
            }

            course_obj['groups'].append(group_obj)

        courses.append(course_obj)

    return courses
