from models import Profession
from exceptions import ApiError


def add(name: str, slug: str):
    profession = Profession(
        name=name,
        slug=slug
    )
    profession.save()

    return profession.get_dto()


def edit(profession_id: int, name: str, slug: str):
    profession = Profession.get_or_none(id=profession_id)
    if not profession:
        raise ApiError.BadRequest('Специальность на найдена')

    profession.name = name
    profession.slug = slug
    profession.save()

    return profession.get_dto()


def remove(profession_id: int):
    profession = Profession.delete().where(Profession.id == profession_id)
    profession.execute()
    return


def get_professions():
    return [profession.get_dto() for profession in Profession.select()]


def get_profession(profession_id: int):
    profession = Profession.get_or_none(id=profession_id)
    if not profession:
        raise ApiError.BadRequest('Специальность на найдена')

    return profession.get_dto()
