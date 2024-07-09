from website import create_app #first selects the folder called website. __init__.py being inside website folder, it will automatically present the functions inside it.
#one of these functions being create_app. Thus there is no need to do something like "from website, in __init__.py, import create_app"
import webbrowser  #import webbrowser to open the URL in the default browser
import threading  #import threading to run the server in a separate thread
import time  #import time so we add a small but instrumental delay

app = create_app() #assign the return value of create_app to a local variable we can work with

""" if __name__ == '__main__': #only runs server ONLY if you run this file directly. - ask Toby what specifies __main__
    app.run(debug=True) """

def run_server():
    app.run(debug=False)  # Run the Flask server

if __name__ == '__main__':
    # Start the Flask server in a separate thread
    threading.Thread(target=run_server).start()
    
    # Wait for a short time to ensure the server starts
    time.sleep(1)
    
    # Open the default web browser with the Flask app URL
    webbrowser.open('http://127.0.0.1:5000')