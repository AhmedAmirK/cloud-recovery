'''
@author Ahmed Hassan Koshek
'''
import SoftLayer
from pprint import pprint as pp

class recovery:
    def cancel(self):
        id = self.mgr.list_instances(hostname=self.hostname, domain=self.domain)
        self.mgr.cancel_instance(id)

    def delete_image(self):
        image_id = self.img_mgr._get_ids_from_name_public(self.imageName)
        self.img_mgr.delete_image(image_id)


    def getImageTemplateGUID(self, templateName):
	    mask = "mask[name,globalIdentifier]"
	    templates = self.client['SoftLayer_Account'].getBlockDeviceTemplateGroups(mask=mask)
	    for template in templates:
	        if template['name'] == templateName:
	            return template['globalIdentifier']

    def getObject(self):
        mask = '''
        	mask[
        		location,
        		datacenter,
        		startCpus,
        		maxMemory,
        		networkComponents.maxSpeed,
        		localDiskFlag,
        		blockDeviceTemplateGroup
        	]'''
        guest = self.client['SoftLayer_Virtual_Guest'].getObject(id=self.id, mask=mask)
        return guest

    def CreateObject(self):
        guest = self.getObject()
        guest['hostname'] = self.hostname
        guest['domain'] = self.domain
        guest['hourlyBillingFlag'] = True
        guest['networkComponents'] = [guest['networkComponents'][0]]
        guest['blockDeviceTemplateGroup'] = {'globalIdentifier': self.getImageTemplateGUID(self.imageName)}
        order_template = self.client['SoftLayer_Virtual_Guest'].createObject(guest)
        return order_template


    def recover(self):
        mask = "mask[hostname, status]"
        instance = self.mgr.get_instance(self.id, mask=mask)
        if(instance['status']['keyName'] != "DISCONNECTED"):
            print("RUNNING")
            if(self.hasRecovery == True):
                #delete temp server and it image
                self.cancel()
                self.delete_image()
            return

        else:
            #create a new thread for recovering
            print("There is a failure in the machine .. RECOVERING ...")
            image = self.mgr.capture(self.id, self.imageName)
            Order = self.CreateObject()
            pp(Order)
            print("Created the new hourly server")
            return




    def __init__(self, client, id, imageName, hostname, domain, hasRecovery):
        self.client = client
        self.mgr = SoftLayer.VSManager(self.client)
        self.img_mgr = SoftLayer.ImageManager(self.client)
        self.id = id
        self.imageName = imageName
        self.hostname = hostname #hostname and domain for the temp servers
        self.domain = domain
        self.hasRecovery = hasRecovery
