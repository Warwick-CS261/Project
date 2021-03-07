import subprocess

func1("this is great!")

def func1(a):
    output = subprocess.check_output(['python', 'src/main/python/main.py', a])
    print output.rstrip()
    return
