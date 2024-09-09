from webargs import fields


profession_add_model = {
    'name': fields.String(required=True),
    'slug': fields.String(required=True),
}

profession_edit_model = {
    'profession_id': fields.Number(required=True),
    'name': fields.String(required=True),
    'slug': fields.String(required=True),
}

profession_remove_model = {
    'profession_id': fields.Number(required=True)
}
