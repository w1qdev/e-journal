from models import Department, DepartmentPresident
from exceptions import ApiError


def add(name: str, president_id: int):
    department = Department(
        name=name
    )
    department.save()

    department_president = DepartmentPresident(
        department=department,
        president=president_id
    )
    department_president.save()

    return department.get_dto()


def edit(department_id: int, name: str, president_id: int):
    department = Department.get_or_none(id=department_id)
    if not department:
        raise ApiError.BadRequest('ЦМК/отдел на найден')

    department.name = name
    department.save()

    department_president = DepartmentPresident.select().where(
        DepartmentPresident.department == department_id
    )

    if len(department_president) == 0:
        department_president = DepartmentPresident(
            department=department,
            president=president_id
        )
        department_president.save()
    else:
        department_president[0].president = president_id
        department_president[0].save()

    return department.get_dto()


def remove(department_id: int):
    department = Department.delete().where(Department.id == department_id)
    department.execute()
    return


def get_departments():
    return [department.get_dto() for department in Department.select()]


def get_department(department_id: int):
    department = Department.get_or_none(id=department_id)
    if not department:
        raise ApiError.BadRequest('ЦМК/отдел не найден')

    return department.get_dto()
