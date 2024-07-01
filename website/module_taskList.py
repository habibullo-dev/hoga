from flask import jsonify, request, render_template, session, make_response, Blueprint
from datetime import datetime
from time import time
import sqlalchemy
from sqlalchemy import text
import json
db = sqlalchemy.create_engine("mariadb+mariadbconnector://root:@127.0.0.1:3306/final project")

tasklist_bp = Blueprint('tasklist_bp', __name__)

#user vars examples:
email_TEST = {"email": "caca@gmail.fr"}
task_nodes_TEST = [{"task_name1":{"BLABLA (see below)"}}, {"task_name2":{"BLABLA (see below)"}}, "etc..."] #list containing the dict for each node title, their full content, and their order of display.



@tasklist_bp.post("/taskDataGrab")
def create_or_edit_task():
    res_email = request.json.get("email", "")#receive the email to identify who's tasklist this is.
    res = request.json.get("tasks", "")
    print("taskDataGrab Res", res) 
    res1 = request.json.get("completedTasks", "")
    with db.begin() as conn:
        try: 
            exec2 = conn.execute(text("UPDATE user SET tasklist_list=:tasknode WHERE email=:email"),{
                "tasknode": json.dumps([res, res1]),
                "email": res_email
                # "email": "hogadashboard@gmail.com" ##TESTING PURPOSES
            })
            if exec2:
                return {"message" : "Task widget data update success"}
            else:
                return {"error" : "1601 Issue updating user tasklist widget"} #reserving error rank 1600-1699 for tasklist widget update
        except:
            return {"error" : "1600 Problem identifying email"}

""" 
@tasklist_bp.post("/taskDataPull")
def send_back_tasks():
    res_email = request.json.get("email", "")
    with db.begin() as conn:
        try: 
            exec = conn.execute(text("SELECT tasklist_list FROM user WHERE email:email"),{
                "email": res_email
                # "email": "hogadashboard@gmail.com" ##TESTING PURPOSES
            })
            if exec:
                for list in exec:
                    list = json.loads(list)
                    return jsonify(list)
            else:
                return {"error" : "1602 Issue fetching user tasklist widget"} #reserving error rank 1600-1699 for tasklist widget update
        except:
            return {"error" : "1600 Problem identifying email"}
 """
