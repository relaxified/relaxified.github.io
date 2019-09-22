// Encounter header
var encounterDefine = "Time: {duration} \xa0\xa0\xa0\xa0\xa0\xa0\xa0 Total DPS: {ENCDPS} \xa0\xa0\xa0\xa0\xa0\xa0\xa0 <span id=\"hpstoggle\" class=\"fas fa-ad\" onClick=\"toggleHPS()\" style=\"display: none;\">&#9881</span>";

// Allows HTML use in encounter
var useHTMLEncounterDefine = true;

// Enable healing table
var enableHealerTable = false;

// Header labels
var headerDefine =
[
    // { text: "#", width: "5%", align: "center" },
    { text: "Job", width: "8%", align: "center" },
    { text: "Name", width: "20%", align: "center" },
    { text: "DPS", width: "10%", align: "center" },
    { text: "Crit", width: "5%", align: "center"},
    { text: "DH", width: "5%", align: "center" },
    { text: "CDH", width: "5%", align: "center"},
];

// Body data
var bodyDefine =
[
    // { text: rankingText, width: "5%", align: "center", effect: deadYatsuEffect },
    { html: "<img src='./images/glow/{JobOrName}.png' onerror='this.src=\"./images/error.png\"' style='width=60%;height:60%;' />", align: "center" },
    { text: "{name}", width: "20%", align: "left" },
    { text: "{encdps}", width: "10%", align: "center" },
    { text: "{crithit%}", width: "5%", align: "center" },
    { text: "{DirectHitPct}", width: "5%", align: "center" },
    { text: "{CritDirectHitPct}", width: "5%", align: "center" },
];

// Healing header labels
var healingHeaderDefine =
[
    { text: "Job", width: "8%", align: "center" },
    { text: "Name", width: "20%", align: "center" },
    { text: "HPS", width: "10%", align: "center" },
    { text: "H", width: "5%", align: "center" },
    { text: "OvH", width: "5%", align: "center" },
];

// Healing body data
var healingBodyDefine =
[
    { html: "<img src='./images/glow/{JobOrName}.png' onerror='this.src=\"./images/error.png\"' style='width=60%;height:60%;' />", align: "center" },
    { text: "{name}", width: "20%", align: "left" },
    { text: "{enchps}", width: "10%", align: "center" },
    { text: "{healed%}", width: "5%", align: "center" },
    { text: "{OverHealPct}", width: "5%", align: "center" },
];

function rankingText(combatant, index) {
    return (index + 1).toString();
}

function deadYatsuEffect(cell, combatant, index) {
    var deaths = parseInt(combatant["deaths"]);
    if (deaths > 0) {
        cell.style.color = "#FFA0A0";
        cell.style.textShadow = "-1px 0 3px #802020, 0 1px 3px #802020, 1px 0 3px #802020, 0 -1px 3px #802020";
    }
}

function toggleHPS() {
    if (enableHealerTable == false) {
        enableHealerTable = true;
        document.getElementById("healingTable").style.display = "initial";
        document.getElementById("hpstoggle").style.color = "#FFC0CB";
    }
    else {
        enableHealerTable = false;
        document.getElementById("healingTable").style.display = "none";
        document.getElementById("hpstoggle").style.color = "white";
    }
}

document.addEventListener("onOverlayDataUpdate", function (e) {
    update(e.detail);
});
window.addEventListener("message", function (e) {
    if (e.data.type === "onOverlayDataUpdate") {
        update(e.data.detail);
    }
});

function update(data) {
    updateEncounter(data);
    if (document.getElementById("combatantTableHeader") == null) {
        updateCombatantListHeader();
    }
    updateCombatantList(data);
}

function updateEncounter(data) {
    var encounterElem = document.getElementById('encounter');

    var elementText;
    if (typeof encounterDefine === 'function') {
        elementText = encounterDefine(data.Encounter);
        if (typeof elementText !== 'string') {
            console.log("updateEncounter: 'encounterDefine' is declared as function but not returns a value as string.");
            return;
        }
    } else if (typeof encounterDefine === 'string') {
        elementText = parseActFormat(encounterDefine, data.Encounter);
    } else {
        console.log("updateEncounter: 'encounterDefine' should be string or function that returns string.");
        return;
    }

    if (!useHTMLEncounterDefine) {
        encounterElem.innerText = parseActFormat(elementText, data.Encounter);
    } else {
        encounterElem.innerHTML = parseActFormat(elementText, data.Encounter);
    }
}

// Update combatant table headers
function updateCombatantListHeader() {
    var table = document.getElementById('combatantTable');
    var tableHeader = document.createElement("thead");
    tableHeader.id = "combatantTableHeader";
    var headerRow = tableHeader.insertRow();

    // Damage table header
    for (var i = 0; i < headerDefine.length; i++) {
        var cell = document.createElement("th");
        if (typeof headerDefine[i].text !== 'undefined') {
            cell.innerText = headerDefine[i].text;
        } else if (typeof headerDefine[i].html !== 'undefined') {
            cell.innerHTML = headerDefine[i].html;
        }
        cell.style.width = headerDefine[i].width;
        cell.style.maxWidth = headerDefine[i].width;
        if (typeof headerDefine[i].span !== 'undefined') {
            cell.colSpan = headerDefine[i].span;
        }
        if (typeof headerDefine[i].align !== 'undefined') {
            cell.style["textAlign"] = headerDefine[i].align;
        }
        headerRow.appendChild(cell);
    }

    table.tHead = tableHeader;

    // Healing table header
    var healingTable = document.getElementById('healingTable');
    var healingTableHeader = document.createElement("thead");
    healingTableHeader.id = "healingTableHeader";
    var healingHeaderRow = healingTableHeader.insertRow();

    for (var i = 0; i < healingHeaderDefine.length; i++) {
        var healingCell = document.createElement("th");
        if (typeof healingHeaderDefine[i].text !== 'undefined') {
            healingCell.innerText = healingHeaderDefine[i].text;
        } else if (typeof healingHeaderDefine[i].html !== 'undefined') {
            healingCell.innerHTML = healingHeaderDefine[i].html;
        }
        healingCell.style.width = healingHeaderDefine[i].width;
        healingCell.style.maxWidth = healingHeaderDefine[i].width;
        if (typeof healingHeaderDefine[i].span !== 'undefined') {
            healingCell.colSpan = healingHeaderDefine[i].span;
        }
        if (typeof healingHeaderDefine[i].align !== 'undefined') {
            healingCell.style["textAlign"] = healingHeaderDefine[i].align;
        }
        healingHeaderRow.appendChild(healingCell);
    }

    healingTable.tHead = healingTableHeader;
}

// Update combatant body data
function updateCombatantList(data) {
    // Damage table vars
    var table = document.getElementById('combatantTable');
    var oldTableBody = table.tBodies.namedItem('combatantTableBody');
    var newTableBody = document.createElement("tbody");
    newTableBody.id = "combatantTableBody";

    // Healing table vars
    var healingTable = document.getElementById('healingTable');
    var oldHealingTableBody = healingTable.tBodies.namedItem('healingTableBody');
    var newHealingTableBody = document.createElement("tbody");
    newHealingTableBody.id = "healingTableBody";

    var combatantIndex = 0;
    var healerIndex = 0;

    for (var combatantName in data.Combatant) {
        var combatant = data.Combatant[combatantName];
        combatant.JobOrName = combatant.Job.toLowerCase() || combatantName;
        var egiSearch = combatant.JobOrName.indexOf("-Egi (");
        if (egiSearch != -1) {
            combatant.JobOrName = combatant.JobOrName.substring(0, egiSearch);
        }
        else if (combatant.JobOrName.indexOf("Eos (") == 0) {
            combatant.JobOrName = "Eos";
        }
        else if (combatant.JobOrName.indexOf("Selene (") == 0) {
            combatant.JobOrName = "Selene";
        }
        else if (combatant.JobOrName.indexOf("Carbuncle (") != -1) {
            // currently no carbuncle pics
        }
        else if (combatant.JobOrName.indexOf(" (") != -1) {
            combatant.JobOrName = "choco";
        }

        // Healing table
        switch (combatant.JobOrName) {
            case "cnj":
            case "whm":
            case "sch":
            case "ast":

                // Cute icon :3
                if (combatantName == "YOU") {
                    combatant.JobOrName = "puppo_32";
                }
                var healingTableRow = newHealingTableBody.insertRow(newHealingTableBody.rows.length);
                for (var i = 0; i < healingBodyDefine.length; i++) {
                    var healingCell = healingTableRow.insertCell(i);
                    if (typeof healingBodyDefine[i].text !== 'undefined') {
                        var healingCellText;
                        if (typeof healingBodyDefine[i].text === 'function') {
                            healingCellText = healingBodyDefine[i].text(combatant, healerIndex);
                        } else {
                            healingCellText = parseActFormat(healingBodyDefine[i].text, combatant);
                        }
                        healingCell.innerText = healingCellText;
                    } else if (typeof healingBodyDefine[i].html !== 'undefined') {
                        var healingCellHTML;
                        if (typeof healingBodyDefine[i].html === 'function') {
                            healingCellHTML = healingBodyDefine[i].html(combatant, healerIndex);
                        } else {
                            healingCellHTML = parseActFormat(healingBodyDefine[i].html, combatant);
                        }
                        healingCell.innerHTML = healingCellHTML;
                    }
                    healingCell.style.width = healingBodyDefine[i].width;
                    healingCell.style.maxWidth = healingBodyDefine[i].width;
                    if (typeof (healingBodyDefine[i].align) !== 'undefined') {
                        healingCell.style.textAlign = healingBodyDefine[i].align;
                    }
                    if (typeof healingBodyDefine[i].effect === 'function') {
                        healingBodyDefine[i].effect(healingCell, combatant, healerIndex);
                    }
                }
                healerIndex++;

            default:
            
                // Cute icon :3
                if (combatantName == "YOU") {
                    combatant.JobOrName = "puppo_32";
                }
                // Damage table
                var tableRow = newTableBody.insertRow(newTableBody.rows.length);
                for (var i = 0; i < bodyDefine.length; i++) {
                    var cell = tableRow.insertCell(i);
                    if (typeof bodyDefine[i].text !== 'undefined') {
                        var cellText;
                        if (typeof bodyDefine[i].text === 'function') {
                            cellText = bodyDefine[i].text(combatant, combatantIndex);
                        } else {
                            cellText = parseActFormat(bodyDefine[i].text, combatant);
                        }
                        cell.innerText = cellText;
                    } else if (typeof bodyDefine[i].html !== 'undefined') {
                        var cellHTML;
                        if (typeof bodyDefine[i].html === 'function') {
                            cellHTML = bodyDefine[i].html(combatant, combatantIndex);
                        } else {
                            cellHTML = parseActFormat(bodyDefine[i].html, combatant);
                        }
                        cell.innerHTML = cellHTML;
                    }
                    cell.style.width = bodyDefine[i].width;
                    cell.style.maxWidth = bodyDefine[i].width;
                    if (typeof (bodyDefine[i].align) !== 'undefined') {
                        cell.style.textAlign = bodyDefine[i].align;
                    }
                    if (typeof bodyDefine[i].effect === 'function') {
                        bodyDefine[i].effect(cell, combatant, combatantIndex);
                    }
                }
        }
        combatantIndex++;
    }

    if (enableHealerTable != false) {
        document.getElementById("healingTable").style.display = "initial";
        document.getElementById("hpstoggle").style.color = "#FFC0CB";
    }
    else {
        document.getElementById("healingTable").style.display = "none";
        document.getElementById("hpstoggle").style.color = "white";
    }

    if (oldTableBody != void (0)) {
        table.replaceChild(newTableBody, oldTableBody);
    }
    else {
        table.appendChild(newTableBody);
    }

    if (oldHealingTableBody != void (0)) {
        healingTable.replaceChild(newHealingTableBody, oldHealingTableBody);
    }
    else {
        healingTable.appendChild(newHealingTableBody);
    }
}

function parseActFormat(str, dictionary)
{
    var result = "";

    var currentIndex = 0;
    do {
        var openBraceIndex = str.indexOf('{', currentIndex);
        if (openBraceIndex < 0) {
            result += str.slice(currentIndex);
            break;
        }
        else {
            result += str.slice(currentIndex, openBraceIndex);
            var closeBraceIndex = str.indexOf('}', openBraceIndex);
            if (closeBraceIndex < 0) {
                // parse error!
                console.log("parseActFormat: Parse error: missing close-brace for " + openBraceIndex.toString() + ".");
                return "ERROR";
            }
            else {
                var tag = str.slice(openBraceIndex + 1, closeBraceIndex);
                if (typeof dictionary[tag] !== 'undefined') {
                    result += dictionary[tag];
                } else {
                    console.log("parseActFormat: Unknown tag: " + tag);
                    result += "ERROR";
                }
                currentIndex = closeBraceIndex + 1;
            }
        }
    } while (currentIndex < str.length);

    return result;
}