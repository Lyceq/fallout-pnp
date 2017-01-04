// Attacker card row and colimn indexes
var damageRow = 0, damageColumn = 1, dtRow = 1, dtColumn = 1, dtIgnoreColumn = 2, drRow = 2, drColumn = 1, drIgnoreColumn = 2;

// Target column indexes
var nameColumn = 0, armorColumn = 1, normalColumn = 2, laserColumn = 4, fireColumn = 6, plasmaColumn = 8, explosionColumn = 10, actionColumn = 12;

// Appends a message to the log element.
function log(msg) {
	document.getElementById("log").innerHTML += msg + "<br />";
}

function selectCard(id) {
	cards = document.getElementsByClassName("attackerCard");
	for (var i = 0; i < cards.length; i++) {
		if (cards[i].getAttribute("id") == id) {
			cards[i].setAttribute("attacker", "selected");
		} else {
			cards[i].setAttribute("attacker", "clear");
		}
	}
	
	if (calculateDamage !== undefined) calculateDamage();
}

function createAttackerStat(id, label) {
	var row = document.createElement("tr");
	var labelCell = document.createElement("td");
	labelCell.setAttribute("class", "fieldLabel");
	labelCell.innerHTML = label;
	row.appendChild(labelCell);

	var statCell = document.createElement("td");
	row.appendChild(statCell);

	var statInput = document.createElement("input");
	statInput.setAttribute("id", id);
	statInput.setAttribute("class", "fieldInput");
	statInput.setAttribute("type", "number");
	statInput.setAttribute("value", 0);
	statCell.appendChild(statInput);

	return row;
}

function appendIgnoreCheckbox(row, id) {
	var ignoreCell = document.createElement("td");
	ignoreCell.innerHTML = "Ignore<input type='checkbox' id='" + id + "' />";
	row.appendChild(ignoreCell);
}

function createAttackerCard(idPrefix, name) {
	var card = document.createElement("div");
	card.setAttribute("id", idPrefix)
	card.setAttribute("class", "attackerCard");
	card.setAttribute("onclick", "selectCard('" + idPrefix + "')");

	var border = document.createElement("div");
	border.setAttribute("id", idPrefix + "-border");
	border.setAttribute("class", "dialog");
	card.appendChild(border);

	var header = document.createElement("h3");
	header.setAttribute("id", idPrefix + "-name");
	header.innerHTML = name;
	border.appendChild(header);

	var table = document.createElement("table");
	table.setAttribute("id", idPrefix + "-table");
	table.setAttribute("class", "cardTable");
	border.appendChild(table);

	var damageRow = createAttackerStat(idPrefix + "-damage", "Damage:");
	table.appendChild(damageRow);

	var dtRow = createAttackerStat(idPrefix + "-dtpenalty", "DT Adjust:");
	appendIgnoreCheckbox(dtRow, "dtignore");
	table.appendChild(dtRow);

	var drRow = createAttackerStat(idPrefix + "-drpenalty", "DR Adjust:");
	appendIgnoreCheckbox(drRow, "drignore");
	table.appendChild(drRow);

	return card;
}

function getSelectedAttackerCard() {
	cards = document.getElementsByClassName("attackerCard");
	for (var i = 0; i < cards.length; i++) {
		if (cards[i].getAttribute("attacker") == "selected") {
			return cards[i];
		}
	}
}

function getAttackerFromCard(card) {
	if (card === undefined) {
		return {
			"damage": 0,
			"dtpenalty": 0,
			"dtignore": false,
			"drpenalty": 0,
			"drignore": false
		};
	}

	var table = card.childNodes[0].childNodes[1];
	var attacker = {
		"name": card.childNodes[0].childNodes[1].innerHTML;
		"damage": parseInt(table.childNodes[damageRow].childNodes[damageColumn].childNodes[0].value),
		"dtpenalty": parseInt(table.childNodes[dtRow].childNodes[dtColumn].childNodes[0].value),
		"dtignore": table.childNodes[dtRow].childNodes[dtIgnoreColumn].childNodes[1].checked,
		"drpenalty": parseFloat(table.childNodes[drRow].childNodes[drColumn].childNodes[0].value) / 100.0,
		"drignore": table.childNodes[drRow].childNodes[drIgnoreColumn].childNodes[1].checked
	}

	if (isNaN(attacker.drpenalty)) attacker.drpenalty = 0.0;
	return attacker;
}

// Create an element for displaying a target's name.
function createTargetNameField(id, name) {
	var field = document.createElement("span");
	field.setAttribute("id", id);
	field.setAttribute("class", "targetNameField");
	field.innerHTML = name;
	return field;
}

// Create an element that allows user to input damage resistance.
function createResistanceInput(id) {
	var input = document.createElement("input");
	input.setAttribute("id", id);
	input.setAttribute("class", "damageResistanceInput");
	input.setAttribute("type", "text");
	input.setAttribute("pattern", "([xX][0-9]+(\.[0-9]*)?|[0-9]+/-?[0-9]+%?)");
	input.setAttribute("placeholder", "DT/DR");
	input.setAttribute("size", "6");
	return input;
}

// Create an element to display the damage for a target.
function createDamageOutput(id) {
	var output = document.createElement("output");
	output.setAttribute("id", id);
	output.setAttribute("class", "damageOutputField");
	output.setAttribute("for", "damage dtpenalty dtignore drpenalty drignore");
	output.innerHTML="0";
	return output;
}

// Create a table cell for a target's resistance input.
function createResistanceInputCell(idPrefix, damageType) {
	var cell = document.createElement("td");
	cell.setAttribute("id", idPrefix + "-input-cell");
	cell.setAttribute("class", "damageResistanceInputCell");
	cell.appendChild(createResistanceInput(idPrefix + damageType + "-resistance"));
	return cell;
}

// Create a table cell for a target's damage calculation output.
function createResistanceOutputCell(idPrefix, damageType) {
	var cell = document.createElement("td");
	cell.setAttribute("id", idPrefix + "-output-cell");
	cell.setAttribute("class", "damageResistanceOutputCell");
	cell.appendChild(createDamageOutput(idPrefix + damageType + "-damage"));
	return cell;
}

// Create an element for triggering an action on a target.
function createActionButton(id, name, onclick) {
	var button = document.createElement("input");
	button.setAttribute("id", id);
	button.setAttribute("type", "button");
	button.setAttribute("class", "actionButton");
	button.setAttribute("value", name);
	button.setAttribute("onclick", onclick);
	return button;
}

// Create a full complement of action buttons for a target.
function createActionBlock(name) {
	var idPrefix = "target-" + name + "-action-";
	var block = document.createElement("div");
	block.setAttribute("id", idPrefix + "block");
	block.setAttribute("class", "actionBlock");

	block.appendChild(createActionButton(idPrefix + "save", "Save", "saveTarget('" + name + "')"));
//	block.appendChild(createActionButton(idPrefix + "rename", "Rename", "renameTarget('" + name + "')"));
	block.appendChild(createActionButton(idPrefix + "delete", "Delete", "deleteTarget('" + name + "')"));
	block.appendChild(createActionButton(idPrefix + "reload", "Reload", "reloadTarget('" + name + "')"));

	return block;
}

// Delete all children of a table row and populate it with elements for a target. The target is not actually written to the row.
function populateTargetRow(row, name, armor) {
	var idPrefix = "target-" + name + "-";

	// Clear out existing elements in row.
	while (row.childNodes.length > 0) row.removeChild(row.childNodes[0]);

	// Setup name cell
	var nameCell = document.createElement("td");
	nameCell.setAttribute("id", idPrefix + "name-cell");
	nameCell.setAttribute("class", "targetNameCell");
	nameCell.appendChild(createTargetNameField(idPrefix + "name", name));
	row.appendChild(nameCell);

	// Setup equipment cell
	var equipCell = document.createElement("td");
	equipCell.setAttribute("id", idPrefix + "armor-cell");
	equipCell.setAttribute("class", "targetNameCell");
	equipCell.appendChild(createTargetNameField(idPrefix + "armor", armor));
	row.appendChild(equipCell);

	// Add resistance cells
	row.appendChild(createResistanceInputCell(idPrefix, "normal"));
	row.appendChild(createResistanceOutputCell(idPrefix, "normal"));
	row.appendChild(createResistanceInputCell(idPrefix, "laser"));
	row.appendChild(createResistanceOutputCell(idPrefix, "laser"));
	row.appendChild(createResistanceInputCell(idPrefix, "fire"));
	row.appendChild(createResistanceOutputCell(idPrefix, "fire"));
	row.appendChild(createResistanceInputCell(idPrefix, "plasma"));
	row.appendChild(createResistanceOutputCell(idPrefix, "plasma"));
	row.appendChild(createResistanceInputCell(idPrefix, "explosion"));
	row.appendChild(createResistanceOutputCell(idPrefix, "explosion"));

	// Setup actions cell
	target = document.createElement("td");
	target.setAttribute("id", idPrefix + "actions-cell");
	target.setAttribute("class", "actionsCell");
	target.appendChild(createActionBlock(name));
	row.appendChild(target);
}

function sanitizeName(name) {
	if ((name === undefined) || (name ===  null)) return "";
	return name.trim();
}

// Create a new target row and add it to the table.
function newTargetRow(name, armor) {
	if (name == "") {
		log("Please enter a target name.");
		return;
	}
	if (findTargetRow(name) != null) {
		log("That target is already in the table.");
		return;
	}

	var table = document.getElementById("targets");
	var row = document.createElement("tr");
	row.setAttribute("id", "target-" + name + "-row");
	row.setAttribute("class", "targetRow");
	populateTargetRow(row, name, armor);
	table.appendChild(row);
	return row;
}

// Reads target data from table and sends it to the server.
function saveTarget(name) {
	var target = readTargetFromRow(findTargetRow(name));
	if (target == null) {
		log("Failed to read target data from table.");
		return;
	}

	saveTargetToServer(target);
	log("Saved data of target " + target.name + " to server.");
}

// Add a new target row and load it with data from the server.
function loadTarget(name, armor) {
	var row = newTargetRow(name, armor);
	if (row === undefined) return;
	getTargetFromServer(name);
	log("Requested data for target " + name + " from server.");
}

// Reload an existing target row with data from the server.
function reloadTarget(name) {
	getTargetFromServer(name);
	log("Requested data for target " + name + " from server.");
}

function deleteTarget(name) {
	var row = findTargetRow(name);
	if (row == null) return;
	row.parentNode.removeChild(row);
	deleteTargetOnServer(name);
	log("Requested target " + name + " be deleted from server.");
}

// Find the for a specific target.
function findTargetRow(name) {
	return document.getElementById("target-" + name + "-row");
}

// Read target data from a row into an object.
function readTargetFromRow(row) {
	if (row == null) return null;
	return {
		name: row.childNodes[nameColumn].childNodes[0].innerHTML,
		armor: row.childNodes[armorColumn].childNodes[0].innerHTML,
		resistances: {
			normal: row.childNodes[normalColumn].childNodes[0].value,
			laser: row.childNodes[laserColumn].childNodes[0].value,
			fire: row.childNodes[fireColumn].childNodes[0].value,
			plasma: row.childNodes[plasmaColumn].childNodes[0].value,
			explosion: row.childNodes[explosionColumn].childNodes[0].value
		}
	}
}

// Write target data to an existing row.
function writeTargetToRow(row, target) {
	if (row == null) return;
	row.childNodes[nameColumn].childNodes[0].value = target.name;
	row.childNodes[normalColumn].childNodes[0].value = target.resistances.normal;
	row.childNodes[laserColumn].childNodes[0].value = target.resistances.laser;
	row.childNodes[fireColumn].childNodes[0].value = target.resistances.fire;
	row.childNodes[plasmaColumn].childNodes[0].value = target.resistances.plasma;
	row.childNodes[explosionColumn].childNodes[0].value = target.resistances.explosion;
}

