var socket = io('http://websvc-app01.test.submersible-games.com:8001');

var handlers = {
	msg: [ ], // Data = Message string
	gotName: [ ], // Data = String of objects's name
	gotObject: [ ], // Data = Recieved object
	objectUpdated: [ ], // Data = String of object's name
	objectDeleted: [ ], // Data = String of object's name
};

function fireEvent(handlers, data) {
	if (handlers == undefined) return;
	for (var i = 0; i < handlers.length; i++) {
		if (handlers[i] != undefined) handlers[i](data);
	}
}

function sanitizeName(name) {
        if ((name === undefined) || (name ===  null)) return "";
        return name.trim();
}

socket.on('msg', function(msg) {
	fireEvent(handlers.msg, msg);
});
	
socket.on('gotName', function(name) {
	fireEvent(handlers.gotName, name);
});

socket.on('gotObject', function(obj) {
	fireEvent(handlers.gotObject, obj);
});

socket.on('objectUpdated', function(name) {
	fireEvent(handlers.objectUpdated, name);
});

socket.on('objectDeleted', function(name) {
	fireEvent(handlers.objectDeleted, name);
});

function getNamesFromServer(types) {
	if (types instanceof Array) {
		for (var i = 0; i < types.length; i++)
			socket.emit('getNames', { type: types[i] });
	} else {
		socket.emit('getNames', { type: types });
	}
}

function getObjectFromServer(type, name) {
	socket.emit('getObject', { type: type, name: name });
}

function saveObjectToServer(type, obj) {
	socket.emit('saveObject', { type: type, data: obj });
}

function deleteObjectFromServer(type, name) {
	socket.emit('deleteObject', { type: type, name: name });
}
