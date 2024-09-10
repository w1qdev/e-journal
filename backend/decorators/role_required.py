from exceptions import ApiError


def role_required(roles: list):
    def _role_required(fn):
        def wrapper(user, *args, **kwargs):

            if user.role.slug not in roles:
                raise ApiError.Forbidden()

            return fn(user, *args, **kwargs)

        wrapper.__name__ = fn.__name__
        return wrapper

    return _role_required
