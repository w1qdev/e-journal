from database import db
from flask import Flask
from flask_cors import CORS
from exceptions import ApiError
from routes import routes
import os
from models import Profession, Department, Role, User, Session, Subject, Group, GroupSubject, Schedule, \
    ScheduleParam, Journal, Report, GroupTutor, DepartmentPresident

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "https://urtk-journal.ru"}})

for route in routes:
    app.register_blueprint(route, url_prefix='/api')


@app.errorhandler(ApiError.ApiError)
def api_error(error):
    return error.message, error.status


@app.errorhandler(404)
def api_error(error):
    return 'Url not found', 404


@app.before_request
def before_request():
    try:
        db.connect()
        print("Successfuly connected to the database")
    except Exception as ex:
        print("Failed to connect to database")


@app.after_request
def after_request(response):
    db.close()
    return response


if __name__ == '__main__':
    with db:
        db.create_tables([Profession, Department, Role, Group, User, Session, Subject, GroupSubject, Schedule,
                          ScheduleParam, Journal, Report, GroupTutor, DepartmentPresident])

    app.run(debug=os.environ.get('DEBUG') or False, port=os.environ.get('PORT'))

