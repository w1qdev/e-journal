import string
import random

from peewee import fn
from translatepy import Translator
from models import User, Role, Department, Group, Session
from exceptions import ApiError
from werkzeug.security import check_password_hash, generate_password_hash
from uuid import uuid4
from .role_service import get_role


def generate_password():
    characters = string.ascii_letters + string.digits
    password = ''.join(random.choice(characters) for _ in range(8))
    return password


def generate_username(last_name: str, first_name: str, surname: str):
    translator = Translator()
    last_name = translator.translate(last_name, "English").result[0: random.randint(1, len(last_name))]
    first_name = translator.translate(first_name, "English").result[0: random.randint(1, len(first_name))]
    surname = translator.translate(surname, "English").result[0: random.randint(1, len(surname))] if surname else ''

    return last_name + first_name + surname


def registration(last_name: str, first_name: str, surname: str, email: str, role_id: int, group_id: int,
                 department_id: int):

    if not Role.get_or_none(id=role_id):
        raise ApiError.BadRequest('Роль на найдена')

    if group_id and not Group.get_or_none(id=group_id):
        raise ApiError.BadRequest('Группа не найдена')

    if department_id and not Department.get_or_none(id=department_id):
        raise ApiError.BadRequest('ЦМК/отдел не найден')

    password = generate_password()

    user = User(
        username=generate_username(last_name, first_name, surname),
        email=email,
        hashed_password=generate_password_hash(password),
        last_name=last_name,
        first_name=first_name,
        surname=surname if surname else ' ',
        role=role_id,
        group=group_id,
        department=department_id
    )
    user.save()

    user = User.get_or_none(id=user.id)
    return {
        **user.get_dto(),
        'password': password,
    }


def edit(user_id: str, last_name: str, first_name: str, surname: str, email: str, role_id: int, group_id: int,
         department_id: int):

    user = User.get_or_none(id=user_id)
    if not user:
        raise ApiError.BadRequest('Пользователь не найден')

    if not Role.get_or_none(id=role_id):
        raise ApiError.BadRequest('Роль не найдена')

    if group_id and not Group.get_or_none(id=group_id):
        raise ApiError.BadRequest('Группа не найдена')

    if department_id and not Department.get_or_none(id=department_id):
        raise ApiError.BadRequest('ЦМК/отдел не найден')

    user.email = email
    user.last_name = last_name
    user.first_name = first_name
    user.surname = surname if surname else ' '
    user.role = role_id
    user.group = group_id
    user.department = department_id
    user.save()

    user = User.get_or_none(id=user.id).get_dto()

    return user


def change_password(user_id: int):
    user = User.get_or_none(id=user_id)
    if not user:
        raise ApiError.BadRequest('Пользователь не найден')

    password = generate_password()

    user.hashed_password = generate_password_hash(password)
    user.save()

    return {
        'username': user.username,
        'password': password
    }


# Удаление юзера
def delete(user_id: int):
    user = User.get_or_none(User.id == user_id)
    if not user:
        raise ApiError.BadRequest('Пользователь не найден')

    user = User.delete().where(User.id == user_id)
    user.execute()
    return


# Авторизация юзера
def login(username: str, password: str):
    user = User.get_or_none(username=username)
    if not user or not check_password_hash(user.hashed_password, password):
        raise ApiError.BadRequest('Неверный логин или пароль')

    user_sessions = Session.select(fn.COUNT(Session.id)).where(Session.user == user).get_or_none()

    if user_sessions.id >= 10:
        delete_session = Session.delete().where(Session.user == user).limit(1)
        delete_session.execute()

    session = Session(user=user, session=str(uuid4()))
    session.save()

    return user.get_dto(), session.session


# Проверка авторизации юзера
def checkout(session: str):
    session = Session.get_or_none(session=session)
    if not session:
        raise ApiError.UnauthorizedError()

    user = User.get_or_none(id=session.user)

    return user.get_dto()


# Получение информации аккаунта юзера
def get_user(user_id: int):
    user = User.get_or_none(id=user_id)
    if not user:
        raise ApiError.BadRequest('Пользователь не найден')

    return user.get_dto()


def get_users():
    users = User.select()
    return [user.get_dto() for user in users]


def get_user_by_role(role_slugs: list):
    roles = [Role.get(slug=slug).id for slug in role_slugs]

    users = []
    for role in roles:
        users = [
            *users,
            *[user.get_dto() for user in User.select().where(User.role == role)]
        ]

    return users


def user_w_journal(user_id: int):
    user = User.get_or_none(id=user_id)
    if not user:
        raise ApiError.BadRequest('Пользователь не найден')

    return user.get_dto(with_journal_report=True)


def get_users_by_grop(group_id: int):
    return [user.get_dto() for user in User.select().where(User.group == group_id).order_by(User.last_name)]
