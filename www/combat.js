var nextCardId = 0;
var cardIdsByName = { };
var collections = { };

var stanceList = [ "Standing", "Kneeling", "Prone" ];
var stances = {
	Standing: {
		rangeAttackModifier: 0,
		rangeDefendModifier: 0,
		meleeAttackModifier: 0,
		meleeDefendModifier: 0
	},
	Kneeling: {
		rangeAttackModifier: 10,
		rangeDefendModifier: 10,
		meleeAttackModifier: -10,
		meleeDefendModifier: -10
	},
	Prone: {
		rangeAttackModifier: 20,
		rangeDefendModifier: 20,
		meleeAttackModifier: -20,
		meleeDefendModifier: -20
	}
};

function onLoad() {
	getNamesFromServer( [ 'character', 'weapon', 'ammo', 'armor', 'helmet' ] );
}

// Card functions

function createCombatCard(cardId, name) {
	var card = createCard(cardId);
	var border = createBorder(cardId + "-border");
	var header = createHeader(cardId + "-header");
	var name = createNameField(cardId + "-name", name);
	var close = createCardRemoveButton(cardId + "-remove", cardId);
	
	var hp = createNumberInput(cardId + "-hp", 0, 0, 0);
	var ac = createNumberInput(cardId + "-ac", 0, 0, 0);
	var weapon1 = createListInput(cardId + "-weapon1", "weapon");
	var weapon2 = createListInput(cardId + "-weapon2", "weapon");
	var armor = createListInput(cardId + "-armor", "armor");
	var helmet = createListInput(cardId + "-helmet", "helmet");
	var stance = createSelectInput(cardId + "-stance", stanceList);

	var table = createStatsTable(cardId + "-stats");
	var row1 = createStatsRowDouble(cardId + "-row1", "HP:", hp, "AC:", ac);
	var row2 = createStatsRowSingle(cardId + "-row2", "Weapon 1:", weapon1);
	var row3 = createStatsRowSingle(cardId + "-row3", "Weapon 2:", weapon2);
	var row4 = createStatsRowSingle(cardId + "-row4", "Armor:", armor);
	var row5 = createStatsRowSingle(cardId + "-row5", "Helmet:", helmet);
	var row6 = createStatsRowSingle(cardId + "-row6", "Stance:", stance);

	table.appendChild(row1);
	table.appendChild(row2);
	table.appendChild(row3);
	table.appendChild(row4);
	table.appendChild(row5);
	table.appendChild(row6);

	header.appendChild(close);
	header.appendChild(name);

	border.appendChild(header);
	border.appendChild(table);

	card.appendChild(border);

	return card;
}

function getCardName(cardId) {
	return document.getElementById(cardId + "-name").innerHTML;
}

function readCombatCard(cardId) [
	return {
		name: document.getElementById(cardId + "-name").innerHTML,
		hp: document.getElementById(cardId + "-hp").value,
		ac: document.getElementById(cardId + "-ac").value,
		weapon1: document.getElementById(cardId + "-weapon1").value,
		weapon2: document.getElementById(cardId + "-weapon2").value,
		armor: document.getElementById(cardId + "-armor").value,
		helmet: document.getElementById(cardId + "-helmet").value,
		stance: document.getElementById(cardId + "-stance").value
	};
}

// Prompt functions

function createAttackPrompt(stage, damage) {
}

// Combat functions

function setCombatantHP(name, hp) {
	if (hp < 0) hp = 0;
	document.getElementById(cardIdsByName[name] + "-hp").value = hp;
}

function attack(stage) {
	// Calculate to hit
	// If it hits, roll damage.
	// Return -1 for hit, other number for damage of hit.
}

function singleAttack(stage) {
	// Make attack
	// Package in attack prompt
}

function targetedAttack(stage) {
	// Make targeted attack
	// Package in attack prompt
}

function burstAttack(stage) {
	// Make multiple attacks
	// Package in burst attack prompt
}

// Button event handlers

function onAddCard() {
	var name = sanitizeName(document.getElementById("name").value);
	var cardId = "card" + nextCardId++;
	var card = createCombatCard(cardId, name);
	cardIdsByName[name] = cardId;
	document.getElementById("cardBlock").appendChild(card);
	getObjectFromServer('character', name);
}

function onCardClick(id) {
	var role = document.querySelector('input[name="selectRole"]:checked').value;
	if (role == 'none') return;

	var card = document.getElementById(id);
	if (card == null) return;

	var current = document.querySelector('div[role="' + role + '"]');
	if (current) current.removeAttribute("role");

	card.setAttribute("role", role);
}

// Card event handlers

function onCardRemoving(cardId) {
	delete cardsByName[getCardName(cardId)];
}

// Server event handlers

handlers.gotName.push(function(response) {
	addOptionToDataList(response.type, response.name);
});

handlers.gotObject.push(function(response) {
	collections[response.type][response.data.name] = response.data;
});

handlers.objectUpdated.push(function(response) {
	if (response.name in collections[repsonse.type]) getObjectFromServer(response.type, response.name);
});

handlers.objectDeleted.push(function(response) {
	delete collections[response.type][response.name];
});
