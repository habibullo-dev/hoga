import subprocess
import webbrowser
import time
import os

def start_flask():
    # Get the absolute path to main.py
    main_py_path = os.path.join(os.path.dirname(__file__), 'main.py')
    
    # Start Flask server using subprocess with the absolute path
    subprocess.Popen(['python', main_py_path], shell=True)

def open_browser():
    # Open browser to Flask app URL
    time.sleep(5)
    webbrowser.open('http://localhost:5000')  # Adjust URL/port as needed

if __name__ == '__main__':
    start_flask()
    open_browser()