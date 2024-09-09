from webargs import fields


group_create_model = {
    'name': fields.String(required=True),
    'course': fields.Number(required=True),
    'profession_id': fields.Number(required=True),
    'tutor_id': fields.Number(required=True),
}

group_remove_model = {
    'group_id': fields.Number(required=True),
}

group_edit_model = {
    'group_id': fields.Number(required=True),
    'name': fields.String(required=True),
    'course': fields.Number(required=True),
    'profession_id': fields.Number(required=True),
    'tutor_id': fields.Number(required=True),
}

