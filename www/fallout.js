function parseDamageMitigation(dmit) {
	dmit = dmit.trim().toLowerCase();
	if (dmit.charAt(0) == "x") {
		dt = 0;
		dr = parseFloat(dmit.substr(1));
	} else {
		dmit = dmit.split("/");
		dt = parseInt(dmit[0]);
		dr = 1.0 - (parseFloat(dmit[1])) / 100.0;
	}
	return { "dt": dt, "dr": dr };
}

function adjustDamage(attacker, mitigation) {
	var dmg = attacker.damage;
	var dtp = attacker.dtpenalty;
	var drp = attacker.drpenalty;
	var dt = mitigation.dt;
	var dr = mitigation.dr;

	if ((dmg === undefined) || (dmg === null) || isNaN(dmg)) dmg = 0;
	if ((dt === undefined) || (dt === null) || isNaN(dt)) dt = 0;
	if ((dr === undefined) || (dr === null) || isNaN(dr)) dr = 1.0;
	if ((dtp === undefined) || (dtp === null) || isNaN(dtp)) dtp = 0;
	if ((drp === undefined) || (drp === null) || isNaN(drp)) dtp = 0.0;

	if (attacker.dtignore) { dt = 0; }
	if (attacker.drignore && dr < 1.0) { dr = 1.0; }

	dt = Math.max(dt + dtp, 0);

	if ((dr <= 1.0) && (drp < -1.0 + dr)) drp = -1.0 + dr;
	if ((dr > 1.0) && (drp < 0.0)) drp = 0.0;

	dr -= drp;
	dr = Math.max(dr, 0.0);

	dmg -= dt;
	dmg = Math.max(dmg, 0);

	dmg *= dr;
	dmg = Math.max(dmg, 0);

	return {
		dt: dt,
		dr: dr,
		damage: Math.floor(dmg)
	};
}

function buildDamageMitigationString(dt, dr) {
	if (dr > 1.0) {
		if (dt == 0) {
			return "x" + dr.toFixed(2);
		} else {
			return dt + "x" + dr.toFixed(0);
		}
	} else {
		return dt + "/" + ((1.0 - dr) * 100).toFixed(0) + "%";
	}
}
