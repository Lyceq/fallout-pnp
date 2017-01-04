function onCardCloseClick(id, event) {
	var card = document.getElementById(id);
	card.parentNode.removeChild(card);
	event.stopPropagation(); // Prevents selection of card.
}

function addOptionToDataList(listId, option) {
	var list = document.getElementById(listId);
	if (list == null) return;

	for (var i = 0; i < list.childNodes.length; i++) {
		if (list.childNodes[i].innerHTML == option) return;
	}

	var e = document.createElement("option");
	e.innerHTML = option;
	list.appendChild(e);
}

function removeOptionFromDataList(listId, option) {
	var list = document.getElementById(listId);
	if (list == null) return;

	for (var i = 0; i < list.childNodes.length; i++) {
		if (list.childNodes[i].innerHTML == option) {
			list.removeChild(list.childNodes[i]);
			return;
		}
	}
}
