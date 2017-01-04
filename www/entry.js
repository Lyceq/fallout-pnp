var nextCardId = 0;
var cardIdByName = { };
var type = location.search.split('type=')[1];
var creator, reader, writer;

function onLoad() {
	if (!type) type = "character";

        switch (type) {
                case "character": 
			creator = createCharacterCard;
			reader = readCharacterCard;
			writer = writeCharacterCard;
			break;

                case "weapon":
			creator = createWeaponCard;
			reader = readWeaponCard;
			writer = writeWeaponCard;
			break;

                case "ammo":
			creator = createAmmoCard;
			reader = readAmmoCard;
			writer = writeAmmoCard;
			break;

                case "armor":
			creator = createArmorCard;
			reader = readArmorCard;
			writer = writeArmorCard;
			break;

                case "helmet":
			creator = createHelmetCard;
			reader = readHelmetCard;
			writer = writeHelmetCard;
			break;
	
                default:
			addPrompt(createErrorPrompt("Invalid object type: " + type));
			return;
        }

	getNamesFromServer(type);
}

// Button clicks in the action bar.

function onAdd() {
	var name = sanitizeName(document.getElementById("name").value);
	if (name in cardIdByName) return;

	var cardId = "card" + nextCardId++;
	var card = creator(cardId);

	cardIdByName[name] = cardId;
	document.getElementById("cardBlock").appendChild(card);
	getObjectFromServer(type, name);
}

function onDelete() {
	var name = sanitizeName(document.getElementById("name").value);
	deleteObjectFromServer(type, name);
}

function onSaveAll() {
	var cards = document.getElementsByClassName("card");
	for (var i = 0; i < cards.length; i++) {
		saveObjectToServer(type, reader(cards[i].getAttribute("id")));
	}
}

// Card event handlers

function onCardRemoving(cardId) {
	delete cardIdByName[getCardName(cardId)];
}

function onCardSave(cardId) {
	saveObjectToServer(type, reader(cardId));
}

// Server event handlers

handlers.msg.push(function(msg) {
	var prompts = document.getElementById("promptBlock");
	prompts.appendChild(createMsgPrompt(msg));
});

handlers.gotName.push(function(response) {
	if (response.type == type) addOptionToDataList("names", response.name);
});

handlers.gotObject.push(function(response) {
	if ((response.type == type) && (response.data.name in cardIdByName)) writer(cardIdByName[response.data.name], response.data);
});

handlers.objectUpdated.push(function(response) {
	if ((response.type == type) && (response.name in cardIdByName)) getObjectFromServer(response.name);
});

handlers.objectDeleted.push(function(response) {
	if (response.type == type) removeOptionFromDataList("names", response.name);
});
