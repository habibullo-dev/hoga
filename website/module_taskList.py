from flask import jsonify, request, render_template, session, make_response, Blueprint
from datetime import datetime
from time import time
import sqlalchemy
from sqlalchemy import text
db = sqlalchemy.create_engine("mariadb+mariadbconnector://root:@127.0.0.1:3306/final project")

tasklist_bp = Blueprint('tasklist_bp', __name__)

#user vars examples:
email_TEST = {"email": "caca@gmail.fr"}
task_nodes_TEST = [{"task_name1":{"BLABLA (see below)"}}, {"task_name2":{"BLABLA (see below)"}}, "etc..."] #list containing the dict for each node title, their full content, and their order of display.


task_nodes_TEST = [
    {"to_do_list":[
    {"task_name1":{"BLABLA (see below)"}}, 
    {"task_name2":{"BLABLA (see below)"}},
    ]}
    ]

{"task_name1": { #dict with another dict as value, that contains 5 K/V pairs: one for the task title, one for its description, one for customization, 2 for time-related stuff
    "title (optional)": "Do groceries", 
    "internal": "<p>Milk</p><p>Eggs</p>",
    "tasks_pretty" : {"tab_color": "red", "bg_color": "cornflowerblue"}, #dict with various settings for the specific task node (not the whole widget)
    "time_created" : "25/06/2024 (autogenerated)",
    "deadline (optional)" : '26/06/2024 15:30',
    }}

@tasklist_bp.route("/taskDataGrab", methods = ['POST'])
def create_or_edit_task():
    res_email = request.json.get("email", "")#receive the email to identify who's tasklist this is.
    res = request.json.get("task_nodes", "") #receive the full task_nodes package, see above.
    with db.begin() as conn:
        try: 
            exec1 = conn.execute(text("SELECT * FROM user WHERE email=:email"),{
                "email": res_email
            })
            exec2 = conn.execute(text("UPDATE user SET tasklist_list=:tasknode"),{
                "tasknode": res
            })
            if exec2:
                return {"message" : "Task widget data update success"}
            else:
                return {"error" : "1601 Issue updating user tasklist widget"}, 1601 #reserving error rank 1600-1699 for tasklist widget update
        except:
            return {"error" : "1600 Problem identifying email"}, 1600

@tasklist_bp.route("/taskWidgetSetup", methods = ['POST'])
def settings_tasks_grab():
    res_email = request.json.get("email", "")#receive the email to identify who's tasklist this is.
    res = request.json.get("task_settings", "")#receive the settings for the widget.
    with db.begin() as conn:
        try:
            exec1 = conn.execute(text("SELECT * FROM user WHERE email=:email"),{
                "email": res_email
            })
            exec2 = conn.execute(text("UPDATE user SET tasklist_settings=:tasknode"),{
                "tasknode": res
            })
            if exec2:
                return {"message" : "Task widget settings update success"}
            else:
                return {"error": "1602 Issue updating user tasklist settings"}, 1602
        except:
            return {"error": "1600 Problem identifiying email"}, 1600