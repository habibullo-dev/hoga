#from clock_app import app
from flask import render_template, Blueprint

views_bp = Blueprint('views', __name__)

#Home
@views_bp.route("/")
def redir_home_dashboard():
    return render_template("index.html")



#Auth page (login, register...)
"""
@views_bp.route("/BE auth route")
def redir_auth_page():
    return render_template("BE auth template.html")
"""


"""
    Stopwatch - Features:
    - Persists between browser refreshes.
    - Updates per second
    - Start/stop/reset
    - Stores all previous times just prior to reset
"""



#list containing dicts.
#turn it into string (because DB accepts text)