#!flask/bin/python
from flask import Flask, jsonify, make_response, request
import json
import db

app = Flask(__name__)


#APP ROUTES

@app.route('/register')
def register():
	user = {'username': 'sam', 'password':123}
	res = db.createUser(user)
	if res:
		return jsonify({'message':'user created'})
	else: return jsonify({'message':'user already exists'})

@app.route('/login', methods=['GET'])
def login():
	res = db.findUser('sam',123)
	if res is not None :
		return jsonify({'message': 'works', 'res': res}),200
	else: return jsonify({'message':'user not found'}), 404

@app.route('/api/<user_id>', methods=['POST'])
def setAPI(user_id):
	apiKey = request.json['key']
	apiUser = request.json['user']
	res = db.setKeys(apiUser, apiKey, user_id)

@app.route('/servers/<user_id>')
def getServer(user_id):


@app.route('/options/<user_id>', methods=['GET'])
def getServerOptions(user_id):

@app.route('/options/<user_id>', methods=['POST'])
def setServerOptions(user_id):

@app.route('/image/<user_id>', methods=['POST'])
def captureImage(user_id):
	server_id = request.json['server_id']


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

#RUN APP
if __name__ == '__main__':
    app.run(debug=True)