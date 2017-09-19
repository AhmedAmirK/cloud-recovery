'''
@author Ahmed Hassan Koshek
'''
#import Cloud as cloud
import SoftLayer
from pprint import pprint as pp
import os
import controller
import connection
import time

clear = lambda: os.system('cls')


if __name__ == '__main__':
    clear()
    try:
        db = connection.connect()
        db.start_connection()
        while (True):
            db.refresh()
            control = controller.controller(db)
            sleep(10)

    except KeyboardInterrupt:
        #clear()
        db.close_connection()
        print("The application is Exiting")
        raise SystemExit




    #spaces
