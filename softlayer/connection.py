'''
@author Ahmed Hassan Koshek
'''
from pymongo import MongoClient
from pprint import pprint as pp

class connect:
    def start_connection(self):
        self.client = MongoClient("mongodb://ahmedkoshek:cloud99.@ds129434.mlab.com:29434/cloud_recovery")
        db = self.client.cloud_recovery
        self.col = db.users
        # self.get_USERS()
        print("Connected to Databse")

    def close_connection(self):
        self.client.close()
        print("Disconnected")


    def get_USERS(self):
        cursor = self.col.find({})
        for user in cursor:
            self.users.append(user)
        self.count = len(self.users)

    def refresh(self):
        self.get_USERS()

    def __init__(self):
        self.client = None
        self.col = None
        self.users = []
        self.count = None
