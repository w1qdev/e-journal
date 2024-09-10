from webargs import fields


login_model = {
    'username': fields.String(required=True),
    'password': fields.String(required=True),
}

register_model = {
    'last_name': fields.String(required=True),
    'first_name': fields.String(required=True),
    'surname': fields.String(required=False, load_default=None),
    'email': fields.String(required=False, load_default=None),
    'role_id': fields.Integer(required=True),
    'group_id': fields.Integer(required=False, load_default=None),
    'department_id': fields.Integer(required=False, load_default=None),
}

edit_model = {
    'user_id': fields.Integer(required=True),
    'lastname': fields.String(required=True),
    'firstname': fields.String(required=True),
    'surname': fields.String(required=False, load_default=None),
    'email': fields.String(required=False, load_default=None),
    'role_id': fields.Integer(required=True),
    'group_id': fields.Integer(required=False, load_default=None),
    'department_id': fields.Integer(required=False, load_default=None),

}

change_password_model = {
    'user_id': fields.Integer(required=True),
}

delete_user_model = {
    'user_id': fields.Integer(required=True)
}
