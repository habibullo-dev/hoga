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



@tasklist_bp.post("/taskDataGrab")
def create_or_edit_task():
    res_email = request.json.get("email", "")#receive the email to identify who's tasklist this is.
    res = request.json.get("tasks", "") 
    res1 = request.json.get("completedTasks", "")
    with db.begin() as conn:
        try: 
            exec2 = conn.execute(text("UPDATE user SET tasklist=:tasknode WHERE email=:email"),{
                "tasknode": res,
                "email": res_email
            })
            if exec2:
                return {"message" : "Task widget data update success"}
            else:
                return {"error" : "1601 Issue updating user tasklist widget"} #reserving error rank 1600-1699 for tasklist widget update
        except:
            return {"error" : "1600 Problem identifying email"}





