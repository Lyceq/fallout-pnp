var stanceOptions = [
	{
		"value": "stand",
		"text": "Standing"
	}, {
		"value": "kneel",
		"text": "Kneeling"
	}, {
		"value": "prone",
		"text": "Prone"
	}
];

function createCharacterCard(id) {
	var card = createCard(id);
	var border = createBorder(id + "-border", true, "onCharacterCardClick('" + id + "', event)");
	var close = createCardRemoveButton(id + "-remove", id);
	var stats = createStatsTable(id + "-stats");
	
	var name = createNameField(id + "-name", "New Character");
	var hp = createNumberInput(id + "-hp");
	var ac = createNumberInput(id + "-ac");
	var weapon1 = createListInput(id + "-weapon1", "weapons");
	var weapon2 = createListInput(id + "-weapon2", "weapons");
	var armor = createListInput(id + "-armor", "armors");
	var helmet = createListInput(id + "-helmet", "helmets");
	var stance = createSelectInput(id + "-stance", stanceOptions);
	
	stats.appendChild(createStatsRowDouble(id + "-line1", "HP:", hp, "AC:", ac));
	stats.appendChild(createStatsRowSingle(id + "-line2", "Weapon 1:", weapon1, 3));
	stats.appendChild(createStatsRowSingle(id + "-line3", "Weapon 2:", weapon2, 3));
	stats.appendChild(createStatsRowSingle(id + "-line4", "Armor:", armor, 3));
	stats.appendChild(createStatsRowSingle(id + "-line5", "Helmet:", helmet, 3));
	stats.appendChild(createStatsRowSingle(id + "-line6", "Stance:", stance, 3));

	border.appendChild(close);
	border.appendChild(name);
	border.appendChild(stats);
	card.appendChild(border);
	return card;
}

function writeCharacterCard(character, cardId) {
	document.getElementById(cardId + "-name").innerHTML = character.name;
	document.getElementById(cardId + "-hp").value = character.hp;
	document.getElementById(cardId + "-ac").value = character.ac;
	document.getElementById(cardId + "-weapon1").value = character.weapon1;
	document.getElementById(cardId + "-weapon2").value = character.weapon2;
	document.getElementById(cardId + "-armor").value = character.armor;
	document.getElementById(cardId + "-helmet").value = character.helmet;
	document.getElementById(cardId + "-stance").value = character.stance;
}

function readCharacterCard(cardId) {
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
