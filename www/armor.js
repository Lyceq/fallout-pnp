function createArmorCard(id) {
	var card = createCard(id);
	var border = createBorder(id + "-border");
	var header = createCardHeader(id + "-header");
	var name = createNameField(id + "-name", "New Armor");
	var close = createCardRemoveButton(id + "-remove", id);
	var save = createCardSaveButton(id + "-save", id);
	var ac = createNumberInput(id + "-ac");
	var resNormal = createResistanceInput(id + "-resNormal");
	var resLaser = createResistanceInput(id + "-resLaser");
	var resFire = createResistanceInput(id + "-resFire");
	var resPlasma = createResistanceInput(id + "-resPlasma");
	var resExplosion = createResistanceInput(id + "-resExplosion");

	var table = createStatsTable(id + "-stats");
	var row1 = createStatsRowSingle(id + "-row1", "AC:", ac);
	var row2 = createStatsRowSingle(id + "-row2", "Normal:", resNormal);
	var row3 = createStatsRowSingle(id + "-row3", "Laser:", resLaser);
	var row4 = createStatsRowSingle(id + "-row4", "Fire:", resFire);
	var row5 = createStatsRowSingle(id + "-row5", "Plasma:", resPlasma);
	var row6 = createStatsRowSingle(id + "-row6", "Explosion:", resExplosion);

	table.appendChild(row1);
	table.appendChild(row2);
	table.appendChild(row3);
	table.appendChild(row4);
	table.appendChild(row5);
	table.appendChild(row6);

	header.appendChild(close);
	header.appendChild(save);
	header.appendChild(name);

	border.appendChild(header);
	border.appendChild(table);

	card.appendChild(border);

	return card;
}

function getCardName(cardId) {
	return document.getElementByName(cardId + "-name").innerHTML;
}

function writeArmorCard(cardId, armor) {
	document.getElementById(cardId + "-name").innerHTML = armor.name;
	document.getElementById(cardId + "-ac").value = armor.ac;
	if ("resistances" in armor) {
		document.getElementById(cardId + "-resNormal").value = armor.resistances.normal;
		document.getElementById(cardId + "-resLaser").value = armor.resistances.laser;
		document.getElementById(cardId + "-resFire").value = armor.resistances.fire;
		document.getElementById(cardId + "-resPlasma").value = armor.resistances.plasma;
		document.getElementById(cardId + "-resExplosion").value = armor.resistances.explosion;
	}
}

function readArmorCard(cardId) {
	return {
		name: document.getElementById(cardId + "-name").innerHTML,
		ac: document.getElementById(cardId + "-ac").value,
		resistances: {
			normal: document.getElementById(cardId + "-resNormal").value,
			laser: document.getElementById(cardId + "-resLaser").value,
			fire: document.getElementById(cardId + "-resFire").value,
			plasma: document.getElementById(cardId + "-resPlasma").value,
			explosion: document.getElementById(cardId + "-resExplosion").value
		}
	};
}
