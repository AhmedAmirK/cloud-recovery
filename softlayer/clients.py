'''
@author Ahmed Hassan Koshek
'''
import SoftLayer
from pprint import pprint as pp

class Guest:
    def __init__(self, client):
        self.client = client
        self.mgr = SoftLayer.VSManager(self.client)

    def get_instance(self, id):
        return self.mgr.get_instance(id)

    def list_instance(self):
        return self.mgr.list_instances()

    def getIDSby_hostname_domain(self, hostname, domain):
        return self.mgr.list_instances(hostname=hostname, domain=domain)
