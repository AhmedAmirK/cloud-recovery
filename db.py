from pymongo import MongoClient

client = MongoClient('mongodb://root:admin@ds111124.mlab.com:11124/cloud_users')

db = client.cloud_users
users = db.users
def createUser(user):
	res = users.find_one({'username': user['username'] , 'password': user['password']})
	if res is None:
		users.insert_one(user)
		return True
	else: return False

def findUser(username,password):
	return users.find_one({'username':username, 'password':password})

def updateUser(id,user):
	return users.update_one({'_id': id}, {"$set":user}, upsert=False)

def setKeys(username, key, id):
	return users.update_one({'_id': id}, {"$set": {'APIuser': username, 'APIkey': key}}, upsert=False)
