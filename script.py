from softlayer import clients
import SoftLayer
import json
import sys


def getServers(username,key):
		client = SoftLayer.Client(username,key)
		guest = clients.Guest(client)
		res = guest.get_instance()
		return res;



if __name__ == '__main__':
    username = sys.argv[1]
    key = sys.argv[2]
    res = getServers(username,key)
    print(json.dump(res))
    sys.stdout.flush()
