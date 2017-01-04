module.exports = {
	getNames: getNames,
	findDocument: findDocument,
	insertDocument: insertDocument,
	updateDocument: updateDocument,
	deleteDocument: deleteDocument
};

var assert = require('assert');
var mongo = require('mongodb');

var dbUrl = 'mongodb://localhost:27017/fallout';
var db;

mongo.MongoClient.connect(dbUrl, function(err, connection) {
	assert.equal(null, err);
	console.log('Connected to ' + dbUrl);
	db = connection;
	// TODO: Verify existence of collections and initialize.
});

function getNames(collection, callback) {
	console.log('Getting names (collection=' + JSON.stringify(collection) + ').');
	var cursor = db.collection(collection).find({}, { 'name': 1 });
	cursor.each(function(err, doc) {
		if ((err == null) && (doc != null)) {
			callback(doc.name);
		}
	});
}

function findDocument(collection, name, callback) {
	console.log('Finding document (collection=' + JSON.stringify(collection) + ', name=' + JSON.stringify(name) + ').');
	db.collection(collection).findOne({ 'name': name }, function(err, doc) {
		if (err == null) {
			console.log('Found document (doc=' + JSON.stringify(doc) + ').');
			callback(doc);
		} else {
			console.log('Failed to find document (err=' + JSON.stringify(err) + ').');
			callback(undefined);
		}
	});
}

function insertDocument(collection, doc, callback) {
	console.log('Inserting document (doc=' + JSON.stringify(doc) + ').');
	db.collection(collection).insertOne(doc, function(err, result) {
		if (err == null) {
			console.log('Inserted document (result=' + JSON.stringify(result) + ').');
			if (callback !== undefined) callback(result);
		} else {
			console.log('Failed to insert document (err=' + JSON.stringify(err) + ').');
			if (callback !== undefined) callback(undefined);
		}
	});
}

function updateDocument(collection, doc, upsert, callback) {
	if (callback === undefined) {
		callback = upsert;
		upsert = false;
	} else if (upsert === undefined) {
		upsert = false;
	}

	console.log('Updating document (upsert=' + JSON.stringify(upsert) + ', doc=' + JSON.stringify(doc) + ').');
	db.collection(collection).updateOne({ 'name': doc.name }, doc, { upsert: upsert }, function(err, result) {
		if (err == null) {
			console.log('Updated document (result=' + JSON.stringify(result) + ').');
			if (callback !== undefined) callback(result);
		} else {
			console.log('Failed to update document (err=' + JSON.stringify(err) + ').');
			if (callback !== undefined) callback(undefined);
		}
	});
}

function deleteDocument(collection, name, callback) {
	console.log('Deleting document (collection=' + JSON.stringify(collection) + ', name=' + JSON.stringify(name) + ').');
	db.collection(collection).removeOne({ 'name': name }, function(err, count) {
		if (err == null) {
			console.log('Deleted document (count=' + JSON.stringify(count) + ').');
			if (callback !== undefined) callback(count);
		} else {
			console.log('Failed to delete document (err=' + JSON.stringify(err) + ').');
			if (callback !== undefined) callback(undefined);
		}
	});
}
