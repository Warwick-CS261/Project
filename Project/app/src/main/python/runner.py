import subprocess

def func1(a):
    output = subprocess.check_output(['python', 'main.py', a])
    return output.rstrip()
