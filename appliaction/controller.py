'''
@author Ahmed Hassan Koshek
'''
#import Cloud as cloud
import SoftLayer
from pprint import pprint as pp
import math
import threading
import cloud
import connection
import clients


class cloudThread(threading.Thread):
    def __init__(self, users):
        threading.Thread.__init__(self)
        self.users = users

    def run(self):
        for user in self.users:
            client = SoftLayer.Client(
                username=user['username'],
                api_key=user['key']
            )
            i = 0
            for id in user['ids']:
                VirtualGuest = cloud.recovery(client, id, user['imageNames'][i], user['hostnames'][i], user['domains'][i], user['hasRecovery'][i])
                VirtualGuest.recover()
                i = i + 1



class controller:
    def __init__(self, db):

        if(db.count > 0):
            threads = []
            numThreads = math.ceil(db.count/10)

            iFirst = 0
            iLast = 9
            for i in range(int(numThreads)):
                if(i < int(numThreads)):
                    thread = cloudThread(db.users[iFirst:iLast])
                else:
                    thread = cloudThread(db.users[iFirst:db.count - 1])
                thread.start()
                threads.append(thread)
                iFirst = iFirst + 10
                iLast = iLast + 10

            for t in threads:
                t.join()




    #spaces
