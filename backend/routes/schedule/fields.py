from webargs import fields


create_schedule_model = {
    'date': fields.DateTime(required=True),
}

remove_schedule_model = {
    'schedule_id': fields.Number(required=True),
}

edit_schedule_model = {
    'schedule_id': fields.Number(required=True),
    'date': fields.String(required=True),
}

change_visibility_model = {
    'schedule_id': fields.Number(required=True),
    'visible': fields.Boolean(required=True)
}
