function createNumberInput(id, initial, min, max) {
	var input = document.createElement("input");
	input.setAttribute("id", id);
	input.setAttribute("class", "fieldNumber");
	input.setAttribute("type", "number");
	input.setAttribute("maxlength", "3");
	if (initial) input.setAttribute("value", initial);
	if (min) input.setAttribute("min", min);
	if (max) input.setAttribute("max", max);
	return input;
}

function createListInput(id, listName, placeholder, size) {
	var input = document.createElement("input");
	input.setAttribute("id", id);
	input.setAttribute("class", "fieldText");
	input.setAttribute("type", "text");
	input.setAttribute("list", listName);
	if (placeholder) input.setAttribute("placeholder", placeholder);
	if (size) input.setAttribute("size", size);
	return input;
}

function createSelectInput(id, options) {
	var input = document.createElement("select");
	input.setAttribute("id", id);
	input.setAttribute("class", "fieldSelect");

	for (var i = 0; i < options.length; i++) {
		var option = document.createElement("option");
		if (options[i].label) option.setAttribute("label", options[i].label);
		if (options[i].value) option.setAttribute("value", options[i].value);
		option.innerHTML = options[i].text;
		input.appendChild(option);
	}

	return input;
}

function createResistanceInput(id, initial) {
	var input = document.createElement("input");
	input.setAttribute("id", id);
	input.setAttribute("class", "fieldResistance");
	input.setAttribute("type", "text");
	input.setAttribute("pattern", "([xX][0-9]+(\.[0-9]*)?|[0-9]+/-?[0-9]+%?)");
	input.setAttribute("size", "6");
	input.setAttribute("placeholder", "DT/DR");
	if (initial) input.setAttribute("value", initial);
	return input;
}

function createButtonInput(id, label, onclick) {
	var input = document.createElement("input");
	input.setAttribute("id", id);
	input.setAttriubte("type", "button");
	input.setAttriubte("name", label);
	if (onclick) input.setAttribute("onclick", onclick);
	return input;
}

function createNameField(id, label) {
	var name = document.createElement("h3");
	name.setAttribute("id", id);
	name.setAttribute("class", "fieldName");
	name.innerHTML = label;
	return name;
}

function createCard(id) {
	var card = document.createElement("div");
	card.setAttribute("id", id);
	card.setAttribute("class", "card");
	return card;
}

function createBorder(id, highlight, onclick) {
	var border = document.createElement("div");
	border.setAttribute("id", id);
	border.setAttribute("class", highlight ? "borderHighlight" : "border");
	if (onclick) border.setAttribute("onclick", onclick);
	return border;
}

function createCardHeader(id) {
	var header = document.createElement("div");
	header.setAttribute("id", id);
	header.setAttribute("class", "cardHeader");
	return header;
}

function createStatsTable(id) {
	var table = document.createElement("table");
	table.setAttribute("id", id);
	table.setAttribute("class", "tableStats");
	return table;
}

function createStatsCell(id, colspan, isLabel) {
	var cell = document.createElement("td");
	cell.setAttribute("id", id);
	cell.setAttribute("class", isLabel ? "cellLabel" : "cellStats");
	if (colspan) cell.setAttribute("colspan", colspan);
	return cell;
}

function createStatsRow(id) {
	var row = document.createElement("tr");
	row.setAttribute("id", id);
	row.setAttribute("class", "rowStats");
	return row;
}

function createStatsRowSingle(idPrefix, label, control, colspan) {
	var row = createStatsRow(idPrefix + "-row");

	var labelCell = createStatsCell(idPrefix + "-label", undefined, true);
	labelCell.innerHTML = label;

	var controlCell = createStatsCell(idPrefix + "-control", colspan);
	controlCell.appendChild(control);

	row.appendChild(labelCell);
	row.appendChild(controlCell);
	return row;
}

function createStatsRowDouble(idPrefix, label1, control1, label2, control2) {
	var row = createStatsRow(idPrefix + "-row");

	var labelCell1 = createStatsCell(idPrefix + "-label1", undefined, true);
	labelCell1.innerHTML = label1;

	var controlCell1 = createStatsCell(idPrefix + "-control1");
	controlCell1.appendChild(control1);

	var labelCell2 = createStatsCell(idPrefix + "-label2", undefined, true);
	labelCell2.innerHTML = label2;

	var controlCell2 = createStatsCell(idPrefix + "-control2");
	controlCell2.appendChild(control2);

	row.appendChild(labelCell1);
	row.appendChild(controlCell1);
	row.appendChild(labelCell2);
	row.appendChild(controlCell2);
	return row;
}

function onRemoveButtonClick(id, preHandler, postHandler, event) {
	if (typeof(preHandler) == "function") preHandler(id, event);
	var element = document.getElementById(idd);
	element.parentNode.removeChild(element);
	if (typeof(postHandler) == "function") postHandler(id, event);
	event.stopPropagation();
}

function createRemoveButton(id, ownerId, preHandler, postHandler) {
	var button = document.createElement("img");
	button.setAttribute("id", id);
	button.setAttribute("class", "imgButton");
	button.setAttribute("height", "16");
	button.setAttribute("width", "16");
	button.setAttribute("src", "images/close.png");
	button.setAttribute("alt", "Remove");
	button.setAttribute("onclick", "onRemoveButtonClick('" + ownerId + "', " + preHandler + ", " + postHandler + ", event)");
	return button;
}

function createCardRemoveButton(id, cardId) {
	return createRemoveButton(id, cardId, "onCardRemoving", "onCardRemoved");
}

function onCardSaveButtonClick(cardId, event) {
	if (typeof(onCardSave) == "function") onCardSave(cardId, event);
	event.stopPropagation();
}

function createCardSaveButton(id, cardId) {
	var button = document.createElement("img");
	button.setAttribute("id", id);
	button.setAttribute("class", "imgButton");
	button.setAttribute("heigth", "16");
	button.setAttribute("width", "16");
	button.setAttribute("src", "images/save.png");
	button.setAttribute("alt", "Save Card");
	button.setAttribute("onclick", "onCardSaveButtonClick('" + cardId + "', event)");
	return button;
}

var nextPromptId = 0;

function createPromptImage(id, src, alt) {
	var img = document.createElement("img");
	img.setAttribute("id", id);
	img.setAttribute("class", "promptIcon");
	img.setAttribute("src", "images/" + src + ".png");
	img.setAttribute("alt", alt);
	img.setAttribute("width", 32);
	img.setAttribute("height", 32);
	return img;
}

function createPromptRemoveButton(id, promptId) {
	return createRemoveButton(id, promptId, "onPromptRemoving", "onPromptRemoved");
}

function createPromptContentContainer(id) {
	var container = document.createElement("div");
	container.setAttribute("id", id);
	container.setAttribute("class", "promptContainer");
	return container;
}

function createPrompt(imgSrc, imgAlt, content) {
	var pId = "prompt" + nextPromptId++;
	var p = document.createElement("div");
	p.setAttribute("id", pId);
	p.setAttribute("class", "prompt");
	
	var border = createBorder(pId + "-border");
	var img = createPromptImage(pId + "-icon", imgSrc, imgAlt);
	var close = createPromptRemoveButton(id + "-remove", id);
	var container = createPromptContentContainer(id + "-content");
	container.appendChild(content);

	border.appendChild(img);
	border.appendChild(close);
	border.appendChild(container);

	p.appendChild(border);
	return p;
}

function createErrorPrompt(msg) {
	var content = document.createElement("div");
	content.innerHTML = msg;
	return createPrompt("error", "Error", content);
}

function createMessagePrompt(msg) {
	var content = document.createElement("div");
	content.innerHTML = msg;
	return createPrompt("info", "Server Message", content);
}
