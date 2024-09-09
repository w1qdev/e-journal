from models import Role
from exceptions import ApiError


def get_roles():
    return [role.get_dto() for role in Role.select()]


def get_role(slug: str):
    role = Role.get_or_none(slug=slug.capitalize())
    if not role:
        raise ApiError.BadRequest('Роль не найдена')

    return role.get_dto()
