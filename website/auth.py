from flask import Blueprint, Flask, request, make_response, render_template #fusion this with whatever .py doc's pre-existing flask import list you shove this thing into.

auth_bp = Blueprint("auth", __name__) #required to be exported and registered as blueprint.


#below are just placeholders. Back-end team should replace these with their login logics.
@auth_bp.route('/login', methods=['GET', 'POST']) 
def login():
    return "blabla"

@auth_bp.route('/logout')
def logout():
    return "blabla"

@auth_bp.route('/sign-up')
def sign_up():
    return render_template("sign_up.html")

@auth_bp.route('/sign-up')
def home_return():
    return "blabla"
#placeholder end


#cookie and sessions testing ground. Remove
""" 
userLogin = "testAccount"

@auth_bp.route("/secure_cookie_call", methods=["GET", "POST"])
def cookie_generator():
    if request.method == "POST":
        local_email = request.form["email"], #or whatever the Front_end decides on
        local_name = user_full_name[0], #temporary.
        output_msg = f"Welcome, {local_username}!" #⚠️where do we get and store local_username??
        res = make_response('setting up login creds for user')
        res.set_cookie("login_email",local_email) #key should be from the "name=" field of the input.
    return res

@auth_bp.route("/get_cookie")
def cookie_get():
    res_auth = request.cookies.get("login")
    return res_auth 
"""