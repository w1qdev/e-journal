from flask import Blueprint, make_response, request, jsonify, Response
from webargs import flaskparser

from decorators import login_required, role_required
from exceptions import ApiError
from service import user_service
from .fields import login_model, register_model, edit_model, change_password_model, delete_user_model


user_router = Blueprint('user', __name__)


@user_router.put('/user')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def register(user):
    data = flaskparser.parser.parse(register_model, request)
    user = user_service.registration(data['last_name'], data['first_name'], data['surname'], data['email'],
                                     data['role_id'], data['group_id'], data['department_id'])
    return jsonify(user)


@user_router.patch('/user')
@login_required
@role_required(['ADMIN', ['SCHEDULE_CREATOR']])
def edit(user):
    data = flaskparser.parser.parse(edit_model, request)
    user = user_service.edit(data['user_id'], data['lastname'], data['firstname'], data['surname'], data['email'],
                             data['role_id'], data['group_id'], data['department_id'])

    return jsonify(user)


@user_router.patch('/user/change_password')
@login_required
@role_required(['ADMIN'])
def change_password(user):
    data = flaskparser.parser.parse(change_password_model, request)
    user = user_service.change_password(data['user_id'])
    return jsonify(user)


@user_router.get('/user/<int:user_id>')
@login_required
def get_user(user, user_id):
    user = user_service.get_user(user_id)
    return jsonify(user)


@user_router.get('/user/role')
@login_required
def get_user_by_role(user):
    user = user_service.get_user_by_role(request.args.getlist('slug'))
    return jsonify(user)


@user_router.post('/user/login')
def login():
    print("start login")
    data = flaskparser.parser.parse(login_model, request)
    print("data parsed")
    user, session = user_service.login(data['username'], data['password'])
    print("got user and session")

    res = make_response(jsonify(user))
    print("made response")

    res.set_cookie('session', session, max_age=60*60*24)
    print("changed cookies")

    return res


@user_router.post('/user/logout')
def logout():
    res = make_response(Response(status=200))
    res.set_cookie('session', '')

    return res


@user_router.get('/user/checkout')
def checkout():
    session = request.cookies.get('session')
    if not session:
        raise ApiError.UnauthorizedError()

    user = user_service.checkout(session)
    return jsonify(user)


@user_router.get('/user')
@login_required
def get_users(user):
    user_list = user_service.get_users()
    return jsonify(user_list)


@user_router.delete('/user')
@login_required
@role_required(['ADMIN', 'SCHEDULE_CREATOR'])
def delete_user(user):
    data = flaskparser.parser.parse(delete_user_model, request)
    user_service.delete(data['user_id'])
    return Response(status=204)


@user_router.get('/user/journal')
@login_required
def user_w_journal(user):
    user = user_service.user_w_journal(user.id)
    return jsonify(user)


@user_router.get('/user/group/<group_id>')
@login_required
@role_required(['ADMIN', 'TEACHER', 'SCHEDULE_CREATOR'])
def get_user_by_group(user, group_id):
    users = user_service.get_users_by_grop(group_id)
    return jsonify(users)
