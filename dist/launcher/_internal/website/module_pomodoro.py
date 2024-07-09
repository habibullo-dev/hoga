from flask import jsonify, request, render_template, session, make_response, Blueprint
from datetime import datetime
from time import time

timer_bp = Blueprint('timer_bp', __name__)

#⚠️Important note: print statements with "!!" at the beginning are for internal testing. 
#They can and will pollute your terminal. You are to remove them as you wish for your own branch.


#=-=-=-=-=.Essential Timestamp functions.=-=-=-=-=#

def timestamp_make(): # returns a tuple containing time since Jan 1st of 1970 - 🚩ALL VALUES ARE UTC-BASED
    return (int(time()//3600%3600), int(time()//60%60), int(time()%60), int(time()*1000%1000), int(time()*1000))
    #INDEX: [0] Hours (max infinite), [1] Minutes (max 59), [2] Seconds (max 59), [3] Miliseconds respectively (max 999). [4] is total time in miliseconds

def timestamp_zero():
    return [0, 0, 0, 0, 0] 

def elapsed_time_chk(_paused=False): # Calculates how much total milisecs passed by between current time, and time at start of clock. Accounts for suspended (paused) time.
                        # then converts the milisecs into hour/min/sec for front-end.
    print("!!ELAPSED TIME CHECK RUNNING")

    global span_elapsed_time
    _current_ts = timestamp_make()
    if _paused: #returns time from start to pause (if still currently paused), accounts for previous suspended time.
        _total_milisecs = ts_pause[4] - ts_start[4] - span_total_suspend[4]
    else: #else returns time from start to now.
        _total_milisecs = _current_ts[4] - ts_start[4] - span_total_suspend[4]

    print(f"!! CURRENT_TS MILI {_current_ts[4]} - TS_START MILI {ts_start[4]} - SPAN_TOTAL_SUSPEND MILI {span_total_suspend[4]}")
    print(f"!!WHAT IS TS_START TOTAL: {ts_start}")
    print(f"!! issue of ts_start being zero.")

    if ts_start[4] <= 0:
        print(f"!!RED ALERT - TS_START WAS NOT FOUND")
        _total_milisecs = ts_pause[4] - prev_ts_start[4] - span_total_suspend[4]
        print(f"!! ADDING PREV_TS_START: {prev_ts_start[4]}")
    print(f"!!TOTAL MILISECS: {_total_milisecs}")
    span_elapsed_time[0] = _total_milisecs // 3600000
    print(f"!!HOURS: {span_elapsed_time[0]}")
    span_elapsed_time[1] = (_total_milisecs // 60000) % 60
    print(f"!!MINUTES: {span_elapsed_time[1]}")
    span_elapsed_time[2] = (_total_milisecs // 1000) % 60
    print(f"!!SECONDS: {span_elapsed_time[2]}")
    span_elapsed_time[3] = _total_milisecs % 1000
    print(f"!!MILLISEC: {span_elapsed_time[3]}")

    return span_elapsed_time


#=-=-=-=-=.Essential Variable Package.=-=-=-=-=#

ts_start = timestamp_zero() #STAMPED AT START PRESS ex: 12:20AM
prev_ts_start = timestamp_zero()
ts_pause = timestamp_zero() #STAMPED AT PAUSE TO FREEZE + SAVE TIME ELAPSED
ts_unpause = timestamp_zero() #MEASURE DURATION OF PAUSE TO SUBSTRACT FROM TIME ELAPSED
span_total_suspend = timestamp_zero() #STORES LENGTH OF PAUSES
ts_resume = timestamp_zero() #STAMPED WHEN WINDOW OPENS AND CLOCK WAS RUNNING FOR USER ⚠️ obsolete?
ts_current = timestamp_zero() #STAMPED AT ADJUSTS EVERY SECONDS
span_elapsed_time = timestamp_zero() #CALCULATION OF HOW MUCH TIME WAS SPENT RUNNING THE CLOCK - PAUSES BEING EXCLUDED ON PURPOSE

def ts_restart():
    global prev_ts_start, ts_start, ts_pause, ts_unpause, ts_resume, ts_current, span_total_suspend, span_elapsed_time
    prev_ts_start = ts_start
    ts_start = timestamp_zero()
    ts_pause = timestamp_zero()
    ts_unpause = timestamp_zero()
    ts_resume = timestamp_zero()
    ts_current = timestamp_zero()
    span_total_suspend = timestamp_zero()
    span_elapsed_time = timestamp_zero()

running_tracker = False #TRACKS IF CLOCK WAS RUNNING

user_min = 20 # ⚙️TBD
user_sec = 30 # ⚙️TBD

#Receive req to fire up the clock
@timer_bp.route("/clockStart")
def clockStart():
    global ts_start
    global running_tracker
    ts_start = timestamp_make()
    print(f"!!STARTING CLOCK! TS_START STATE: {ts_start}")
    running_tracker = True
    return jsonify({"startStamp" : #JS will receive an object call start_stamp containing the below values. This defines when the clock was started according to UTC.
        { "minutes": ts_start[1], "seconds": ts_start[2], "miliseconds": ts_start[3] }
    })


#Time adjusting. Unnecessary(?) for now.
@timer_bp.route("/tsAdjust")
def tsAdjust():
    global ts_current
    ts_current = timestamp_make()
    return ({"currentStamp" : { #JS receives an object showing how much passed since clock was fired.
            "minutes": ts_start[1] - ts_current[1],
            "seconds": ts_start[2] - ts_current[2],
            "miliseconds": ts_start[3] - ts_current[3],
            }})


#Pauses the timer. BE will store some essential values.
@timer_bp.route("/pauseClock") 
def pause_clock():
    global ts_pause
    global running_tracker
    ts_pause = timestamp_make()
    running_tracker = False
    return ({"pausePkg" : { #shows when pause was made, and if it was made. currently not doing anything with it.
            "minutes": ts_start[1] - ts_pause[1],
            "seconds": ts_start[2] - ts_pause[2],
            "miliseconds": ts_start[3] - ts_pause[3],
            "runStatus" : running_tracker,
    }}) 


#Unpauses the timer. Do not call it resume as it is a different function entirely.
@timer_bp.route("/unpauseClock")
def go_after_pause():
    global ts_unpause
    global running_tracker
    global span_total_suspend
    print(f"!!SPAN TOTAL SUSPEND BEFORE WE ADD SHIT: {span_total_suspend[2]}")
    if ts_pause != [0, 0, 0, 0, 0]:
        ts_unpause = timestamp_make()
        print(f"ts_unpause set to now: {ts_unpause}")
    for i in range(0,3): #add the duration of the pause to a sum, for total timer run calc. purposes.
        span_total_suspend[i] += (int(ts_unpause[i]) - int(ts_pause[i]))
        (f"Instance of adding values to span_total_suspend: (unpause ts{int(ts_unpause[i])} - pause ts{int(ts_pause[i])})")
    running_tracker = True
    print(f"!!SPAN TOTAL TO SUSPEND, SHOULD BE A FEW SECONDS!- ", span_total_suspend[2])
    print(f"!!UNPAUSE - PAUSE IN SECONDS: ", ts_unpause[2], ts_pause[2])
    return ({})

#Stops the clock entirely and resets the start timestamp.
@timer_bp.route("/clockStop")
def stop_all_clock():
    global running_tracker
    ts_restart()
    running_tracker = False
    return ({})

@timer_bp.route("/startUpClockChk", methods=['POST'])
def refresh():
    print("!!startUp Clock Check running")
    if ts_start[4] != 0:
        print("!!ts_start was not 0!", ts_start)
        if running_tracker == True:
            print("!!clock was running.")
            return ({"timeToRemove" : { #update FE time to match what it should be with clock running in background
                "minutes": elapsed_time_chk()[1],
                "seconds": elapsed_time_chk()[2],
                "miliseconds": elapsed_time_chk()[3],
            }})
        else:
            print("!!clock was set but not running.") 
            return ({"timeToDisplay" : { #restore FE time to what it was after pause
                "minutes": elapsed_time_chk("paused")[1],
                "seconds": elapsed_time_chk("paused")[2],
                "miliseconds": elapsed_time_chk("paused")[3],
            }})
    #means its a new clock. no need to start running the clock itself.
    print("!!clock was neither set nor running.")
    return ({})

@timer_bp.route("/clockSetup", methods=['POST'])
def grabTime():
    _payload = request.json.get("chosenPayload", "")
    user_setup_hour = _payload["chosenHour"]
    user_setup_min = _payload["chosenMin"]
    user_setup_sec = _payload["chosenSec"]
    return ({})

