// Includes
var http = require('http');
var socketio = require('socket.io');
var db = require('./db.js');
var util = require('util');

// Initialize http
var httpApp = http.createServer();

// Initialize socket.io
var io = socketio(httpApp);

var types = [ 'character', 'weapon', 'ammo', 'armor', 'helmet' ];

function validate(socket, request, next) {
	var addr = util.inspect(socket.conn.remoteAddress);
	console.log('Recieved event request ' + util.inspect(request) + ' from ' + addr);
	if (types.indexOf(request.type) > -1) {
		next(socket, request);
	} else {
		console.log('Rejecting request due to invalid type ' + request.type + ' from ' + addr);
	}
}	

function getNames(socket, request) {
	console.log('Getting ' + request.type + ' names.');
	db.getNames(request.type, function(name) { if (name !==  null) socket.emit('gotName', { type: request.type, name: name }); });
}

function getObject(socket, request) {
	console.log('Getting ' + request.type + ' ' + request.name + '.');
	db.findDocument(request.type, request.name, function(obj) {
		if (obj === undefined) {
			console.log('Error trying to find object in database.');
			socket.emit('Failed to find ' + request.name + ' due to internal server error.');
		} else if (obj === null) {
			console.log('Object ' + request.name + ' cannot be found in database.');
			socket.emit('Object ' + request.name + ' cannot be found in database.');
		} else {
			console.log('Found object: ' + util.inspect(obj));
			socket.emit('gotObject', { type: request.type, data: obj });
		}
	});
}

function saveObject(socket, request) {
	if ('name' in request.data) {
		console.log('Saving ' + request.type + ' ' + request.data.name + '.');
	} else {
		console.log('Rejecting object due to lack of name field.');
		socket.emit('msg', 'Rejecting object due to lack of name field.');
		return;
	}

	db.updateDocument(request.type, request.data, true, function(result) {
		if (result === undefined) {
			console.log('Failed to save object.');
			socket.emit('msg', 'Failed to save object ' + request.data.name + ' due to internal server error.');
		} else if (result.nModified > 0) {
			console.log('Successfully updated object.');
			socket.emit('msg', 'Updated object ' + request.data.name + ' to server.');
			io.emit('updatedObject', { type: request.type, name: request.data.name });
		} else {
			console.log('Successfully inserted object.');
			socket.emit('msg', 'Added object ' + request.data.name + ' to server.');
			io.emit('gotName', { type: request.type, name: request.data.name });
		}
	});
}

function deleteObject(socket, request) {
	console.log('Deleting ' + request.type + ' ' + request.name + '.');
	db.deleteDocument(request.type, request.name, function(result) {
		if (result === undefined) {
			console.log('Failed to delete object.');
			socket.emit('msg', 'Failed to delete ' + request.name + ' due to an internal server error.');
		} else if (result.nRemoved > 0) {
			console.log('Successfully deleted ' + result.nRemoved + ' objects.');
			io.emit('deletedObject', { type: request.type, name: request.name });
		} else {
			console.log('No objects with name ' + request.name + ' found for deletion.');
			socket.emit('msg', 'No objects found with name ' + request.name + '.');
		}
	});
}

io.on('connection', function(socket) {
	console.log('Connection initiated from ' + util.inspect(socket.conn.remoteAddress));

	socket.on('getNames', function(request) { validate(socket, request, getNames); });
	socket.on('getObject', function(request) { validate(socket, request, getObject); });
	socket.on('saveObject', function(request) { validate(socket, request, saveObject); });
	socket.on('deleteObject', function(request) { validate(socket, request, deleteObject); });

});

httpApp.listen(8001);
