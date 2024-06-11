
from datetime import datetime
from time import time

ts_start = {} #STAMPED AT START PRESS ex: 12:20AM
ts_pause = {} #STAMPED AT PAUSE TO FREEZE + SAVE TIME ELAPSED
ts_unpause = {} #MEASURE DURATION OF PAUSE TO SUBSTRACT FROM TIME ELAPSED
ts_resume = {} #STAMPED WHEN WINDOW OPENS AND CLOCK WAS RUNNING FOR USER
ts_current = {} #STAMPED AT ADJUSTS EVERY SECONDS
ts_elapsed_time = {} #CALCULATION OF HOW MUCH TIME WAS SPENT RUNNING THE CLOCK - PAUSES BEING EXCLUDED ON PURPOSE
running_tracker = False #TRACKS IF CLOCK WAS RUNNING

user_min = 20 # ⚙️TBD
user_sec = 30 # ⚙️TBD

class time_stamp: #TIMESTAMP CLASS DO NOT TOUCH - 🚩ALL VALUES ARE UTC-BASED
    def __init__(self):
        self.hour = time()/3600
        self.minute = time()/60
        self.second = time()
        self.milisec = time()*1000
    def dicton(self):
        return False #WIP
    
def timestamp_make(): # tuple version of above class. Slightly faster?
    return (time()/3600, time()/60, time(), time()*1000)



ts_start = timestamp_make()
ts_elapsed_time = [3,123,25,2]
ts_unpause = timestamp_make()
ts_pause = timestamp_make()

def elapsed_time_chk(_index): #⚠️ to be redone
    #now - start - pause total
    global ts_elapsed_time
    _current_ts = timestamp_make()
    ts_elapsed_time[_index] = _current_ts[_index] - ts_start[_index] - (ts_unpause[_index] - ts_pause[_index])

elapsed_time_chk(1)

print (ts_elapsed_time)
print (ts_start)