from flask import jsonify, request, render_template, session, make_response, Blueprint
from datetime import datetime
from time import time
import sqlalchemy
from sqlalchemy import text
db = sqlalchemy.create_engine("mariadb+mariadbconnector://root:@127.0.0.1:3306/final project")

clock_bp = Blueprint('clock_bp', __name__)

def timestamp_make(): # returns a tuple containing time since Jan 1st of 1970 - 🚩ALL VALUES ARE UTC-BASED
    return (int(time()//3600%3600), int(time()//60%60), int(time()%60), int(time()*1000%1000), int(time()*1000))
    #INDEX: [0] Hours (max infinite), [1] Minutes (max 59), [2] Seconds (max 59), [3] Miliseconds respectively (max 999). [4] is total time in miliseconds

def timestamp_zero():
    return [0, 0, 0, 0, 0] 

@clock_bp.post("/clock_start_ts")
def clock_start_ts():
    print("NOTHING YET")

@clock_bp.post("/user_clock_settings")
def user_clock_settings():
    res_email = request.json.get("email", "")
    clock_pkg = request.json.get("clockSetupStuff", "")
    with db.begin() as conn:
        try: 
            exec2 = conn.execute(text("UPDATE user SET timer_setting=:pomodoro WHERE email=:email"),{ #⚠️⚠️⚠️⚠️ CHECK WITH JAY THE DB SETTINGS NAME!!!
                "podomoro": clock_pkg,
                "email": res_email
            })
            if exec2:
                return {"message" : "Current timer status successfully updated!"}
            else:
                return {"warning" : "Issue updating user timer settings."}  #if warning, simply reset clock back to default settings.
        except:
            return {"error" : "Problem identifying email"}
    

