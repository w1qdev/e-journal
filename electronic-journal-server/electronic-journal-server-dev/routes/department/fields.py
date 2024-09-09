from webargs import fields


department_add_model = {
    'name': fields.String(required=True),
    'president_id': fields.Number(required=True),
}

department_edit_model = {
    'department_id': fields.Number(required=True),
    'name': fields.String(required=True),
    'president_id': fields.Number(required=True),
}

department_remove_model = {
    'department_id': fields.Number(required=True)
}
