export var tables = [];
var svg = document.getElementById("schema-svg");
var grp = document.getElementById("group-svg-objects");

export class Table {
    constructor(width, height, title, properties, references) {
        this.width = width;
        this.height = height;
        let position = getRandomPosition(this.width, this.height);
        this.x = position[0];
        this.y = position[1];
        this.title = title;
        this.properties = properties;
        this.references = references;
        this.lastPositionX = 0;
        this.lastPositionY = 0;
    }

    setX(newX) {
        this.x = newX;
    }

    setY(newY) {
        this.y = newY;
    }
}

export class References {
    constructor() {
        this.referencedTable = '';
        this.currentColumns = [];
        this.referencedColumns = [];
    }
}

export class Property {
    constructor(name, datatype, notNull, isPrimaryKey) {
        this.name = name;
        this.datatype = datatype;
        this.notNull = notNull;
        this.isPrimaryKey = isPrimaryKey;
    }
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPosition(width, height) {
    let isOk = true;
    do {
        var tempX = getRndInteger(0, parseInt(getComputedStyle(svg).width) - width);
        var tempY = getRndInteger(0, parseInt(svg.getAttribute("height")) - height);
        isOk = true;
        tables.forEach(table => {
            if (isOk) {
                if (tempX >= table.x && tempX <= (table.x + table.width) && tempY >= table.y && (tempY <= table.y + table.height)) {
                    isOk = false;
                }
                if ((tempX + width) >= table.x && (tempX + width) <= (table.x + table.width) && tempY >= table.y && (tempY <= table.y + table.height)) {
                    isOk = false;
                }
                if (tempX >= table.x && tempX <= (table.x + table.width) && (tempY + height) >= table.y && ((tempY + height) <= table.y + table.height)) {
                    isOk = false;
                }
                if ((tempX + width) >= table.x && (tempX + width) <= (table.x + table.width) && (tempY + height) >= table.y && ((tempY + height) <= table.y + table.height)) {
                    isOk = false;
                }
                if (table.x >= tempX && table.x <= (tempX + width) && table.y >= tempY && (table.y <= tempY + height)) {
                    isOk = false;
                }
                if ((table.x + table.width) >= tempX && (table.x + table.width) <= (tempX + width) && table.y >= tempY && (table.y <= tempY + height)) {
                    isOk = false;
                }
                if (table.x >= tempX && table.x <= (tempX + width) && (table.y + table.height) >= tempY && ((table.y + table.height) <= tempY + height)) {
                    isOk = false;
                }
                if ((table.x + table.width) >= tempX && (table.x + table.width) <= (tempX + width) && (table.y + table.height) >= tempY && ((table.y + table.height) <= tempY + height)) {
                    isOk = false;
                }
            }
        });
    } while (!isOk);
    return [tempX, tempY];
}


function replaceWithDots(text) {
    if (text.length > 10) {
        let showName = "";
        for (let j = 0; j < 8; j++) {
            showName += text[j];
        }
        showName += "...";
        return showName;
    }
    return text;
}

export function createTable(title, properties, references, coordinates) {
    let noOfParams = properties.length;
    let table = new Table(260, 60 + noOfParams * 20, title, properties, references);


    if (coordinates != undefined) {
        console.log(coordinates);

        table.x = coordinates[0];
        table.y = coordinates[1];
    }

    //#region DrawTheTable 
    let newGroup = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    newGroup.setAttribute("id", "group-"+table.title);

    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    newElement.setAttribute("class", table.title);
    newElement.setAttribute("x", table.x);
    newElement.setAttribute("y", table.y);
    newElement.setAttribute("rx", "10");
    newElement.setAttribute("ry", "10");
    newElement.setAttribute("width", table.width);
    newElement.setAttribute("height", table.height);
    newElement.setAttribute("style","fill:#FFF;stroke:#AAA;stroke-width:2;");
    newGroup.appendChild(newElement);

    let newElementTitle = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    newElementTitle.setAttribute("class", table.title);
    newElementTitle.setAttribute("x", table.x + table.width / 2);
    newElementTitle.setAttribute("y", table.y + 20);
    newElementTitle.setAttribute("dominant-baseline", "middle");
    newElementTitle.setAttribute("text-anchor", "middle");
    let txt = document.createTextNode(table.title);
    newElementTitle.appendChild(txt);
    newGroup.appendChild(newElementTitle);

    for (let i = 0; i < properties.length; i++) {
        let newParam = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        newParam.setAttribute("class", table.title);
        newParam.setAttribute("x", table.x + 40);
        newParam.setAttribute("y", 30 + table.y + 20 * (i + 1));
        let txt = document.createTextNode(replaceWithDots(properties[i].name));
        newParam.appendChild(txt);
        newGroup.appendChild(newParam);
        let newParam2 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        newParam2.setAttribute("class", table.title);
        newParam2.setAttribute("x", (table.x + table.width / 2));
        newParam2.setAttribute("y", 30 + table.y + 20 * (i + 1));
        let txt2 = document.createTextNode(properties[i].datatype);
        newParam2.appendChild(txt2);
        newGroup.appendChild(newParam2);
    }
    grp.appendChild(newGroup);
    //#endregion
    tables.push(table);
    console.log(tables);
}

export function removeElementsByClass(className) {
    var elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

//stergerea tabelului ca si tabel independent dar si ca referinta
export function deleteTable(title) {
    removeElementsByClass(title);
    for (let index_table = 0; index_table < tables.length; index_table++) {
        for (let index_references = 0; index_references < tables[index_table].references.length; index_references++) {
            if (tables[index_table].references[index_references].referencedTable == title) {
                console.log(tables[index_table].references);
                tables[index_table].references.splice(index_references, 1);
            }
        }
        if (tables[index_table].title == title) {

            var index_deletetable = index_table;
        }
    }

    tables.splice(index_deletetable, 1);
}

//stergerea tabelului temporara pentru refacerea proprietatilor 
export function temporaryRemoveTable(title) {

    removeElementsByClass(title);
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].title == title) {
            tables.splice(i, 1);
            break;
        }
    }
}

function JavaSplit(string, separator, n) {
    var split = string.split(separator);
    if (split.length <= n)
        return split;
    var out = split.slice(0, n - 1);
    out.push(split.slice(n - 1).join(separator));
    return out;
}

function showProperties() {
    tables.forEach(table => {
    });
}

export function getTables() {
    return tables;
}



window.formatSqlInput = function formatSqlInput(text) {
    //var input = document.getElementById('sql-command').value;
    var input = text;
    var textFormatted = '';
    var count = 0;
    var split = true;

    for (let i = 0; i < input.length; i++) {
        textFormatted += input[i];

        if (input[i] === '(' && count > 0) {
            split = false;
        }

        if (input[i] === ')' && count > 0) {
            split = true;
        }

        if (input[i] === '(' && count < 1) {
            textFormatted += '\n';
            count++;
        }

        if (input[i] === ',' && split) {
            textFormatted += '\n';
        }
    }
    return textFormatted;
}
window.runSQL = function runSQL() {
    var text = document.getElementById('sql-command');
    processTheCommand(text.value);
    text.value = "";
}

export function processTheCommand(tempText) {

    //format the input to be easier to parse the sql command
    var text = formatSqlInput(tempText.trim().toUpperCase());

    //split by new line
    var splittedText = text.split('\n');

    var re = RegExp("CREATE\\s+TABLE\\s+([A-Z_]+)\\s*\\(\\s*([A-Z_]+\\s+((TINY|SMALL|MEDIUM)?INT|BIGINT|DATE|DATETIME|TIMESTAMP|TIME|(TINY|MEDIUM|LONG)?TEXT|(TINY|MEDIUM|LONG)?BLOB|ENUM|(CHAR|VARCHAR)\\(([1-9]|[1-9][0-9]|[1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])\\))\\s*(\\sNOT\\s+NULL|\\sNULL)?\\s*(,|\\);?)\\s*)+(((PRIMARY\\s+KEY|UNIQUE)\\s*\\(\\s*([A-Z_]+\\s*,)*\\s*[A-Z_]+\\s*\\)\\s*(,|\\);?)\\s*)|(FOREIGN\\s+KEY\\s*\\(\\s*([A-Z_]+\\s*,)*\\s*[A-Z_]+\\s*\\)\\s*REFERENCES\\s+[A-Z_]+\\s*\\(\\s*\\(\\s*([A-Z_]+\\s*,)*\\s*[A-Z_]+\\s*\\)\\s*(,|\\);?)\\s*))*")
    var re2 = RegExp("^DROP\\s+TABLE\\s+([A-Z_]+)\\s*;?$")

    if (re.test(tempText.trim().toUpperCase())) {

        createSqlCommand(splittedText);
    }
    else {

        if (re2.test(tempText.trim().toUpperCase())) {
            var firstElement = splittedText[0];
            firstElement = firstElement.split(' ');
    
            if(getTable(firstElement[2].trim())){
                var references = getTable(firstElement[2].trim()).references;
                if (references.length > 0) {
                    for(let i=0; i<references.length; ++i){
                        removeElementsByClass(firstElement[2].trim()+"-"+references[i].referencedTable);
                        deleteTable(references[i].referencedTable);
                    }
                }

                deleteReferencedLines(firstElement[2].trim());
                deleteTable(firstElement[2].trim());
            }
        }
        else {
            document.getElementById("alert").style.display = 'block';
            setTimeout(function() {
                document.getElementById("alert").style.display = 'none';
            }, 2000);
        }
    }
}

export function deleteReferencedLines(baseTable){
    tables.forEach(table => {
        if(table.references.length){
            for(let i = 0; i < table.references.length; ++i){
                if(table.references[i].referencedTable == baseTable){
                    removeElementsByClass(table.title+"-"+baseTable);
                }
            }
        }
    });
}

function getTableNameFromSplittedText(text) {
    var index = 2;
    var tokens = text.split(' ');
    var tableName = tokens[index];
    while (tableName == '') {
        tableName = tokens[++index];
    }
    tableName = tableName.substring(0, tableName.length - 1)
    return tableName;
}

function createSqlCommand(mytext) {
    let hasReference = false;
    var properties = [];
    var globalReferences = [];
    var primaryKeys = [];
    var tableName = getTableNameFromSplittedText(mytext[0]);
    if(getTable(tableName)){
        document.getElementById("alert11").style.display = 'block';
        setTimeout(function() {
        document.getElementById("alert11").style.display = 'none';
        }, 2000);
        return;
    }

    for (let i = 1; i < mytext.length; i++) {

        //split text to take every column name with its properties
        var tokens = mytext[i].split('\n');
        var subtokens = tokens[0].trim();

        //create new property
        var property = new Property();

        var title = subtokens.split(' ')[0];
        var datatype = subtokens.split(' ')[1];
        var nullable = subtokens.split(' ')[2];

        //check if we have primary key at the end of query
        if (title != undefined && !title.includes("PRIMARY") && !title.includes("FOREIGN")) {
            property.name = title.trim();
            if (datatype != undefined) {
                if (datatype.substring(datatype.length - 1, datatype.length) === ',')
                    datatype = datatype.substring(0, datatype.length - 1);
                if(!"0123456789".includes(datatype[datatype.length-2]) && datatype[datatype.length-1]==")")
                    datatype = datatype.substring(0, datatype.length - 1);
                if(!"0123456789".includes(datatype[datatype.length-3]) && datatype[datatype.length-2]==")")
                    datatype = datatype.substring(0, datatype.length - 2);
                property.datatype = datatype.trim();
            }
            if (nullable != undefined && nullable == "NOT") {
                property.notNull = true;
            } else {
                property.notNull = false;
            }
            properties.push(property);
        } else {
            if (title.includes("PRIMARY")) {
                var pKeysTokens = subtokens.split(',');

                //get the first key from tokens
                var firstKey = pKeysTokens[0];
                firstKey = firstKey.split('(')[1].trim();
                firstKey = firstKey.split(')')[0].trim();
                primaryKeys.push(firstKey);

                //get the rest of the keys from tokens
                for (let j = 1; j < pKeysTokens.length - 1; j++) {
                    primaryKeys.push(pKeysTokens[j].trim());
                }

                //get the last keys from token
                var lastKey = pKeysTokens[pKeysTokens.length - 1];
                primaryKeys.push(lastKey.split(')')[0].trim());
            } else {
                //get the first keys from tokens
                var firstKey = subtokens;
                var references = new References();
                firstKey = firstKey.split('(')[1].trim();
                firstKey = firstKey.split(')')[0].trim();
                firstKey = firstKey.split(',');

                firstKey.forEach(fk => {
                    references.currentColumns.push(fk.trim());
                });

                //get referenced table name
                firstKey = subtokens;
                firstKey = firstKey.split(')')[1].trim();
                firstKey = firstKey.split(' ')[1];
                firstKey = firstKey.split('(')[0].trim();

                references.referencedTable = firstKey;

                //get referenced columns keys
                firstKey = subtokens;
                firstKey = firstKey.split('(')[2].trim();
                firstKey = firstKey.split(')')[0].trim();
                firstKey = firstKey.split(',');

                var refTable = getTable(references.referencedTable);

                if (refTable != undefined) {
                    var allKeysPrimary = true;
                    for (let i = 0; i < firstKey.length; i++) {
                        var ok = false;
                        for (let j = 0; j < refTable.properties.length; j++) {
                            if (refTable.properties[j].name == firstKey[i].trim() && refTable.properties[j].isPrimaryKey) {
                                //check for duplicates of columns name
                                if (!exists(references.referencedColumns, firstKey[i].trim()))
                                    references.referencedColumns.push(firstKey[i].trim());
                                ok = true;
                            }
                        }
                        if (!ok)
                            allKeysPrimary = false;
                    }
                    if (allKeysPrimary) {
                        hasReference = true;
                        globalReferences.push(references);
                    }
                }

            }
        }
    }

    //define primary key for properties
    for (let i = 0; i < properties.length; i++) {
        properties[i].isPrimaryKey = false;

        if (primaryKeys.includes(properties[i].name)) {
            properties[i].notNull = true;
            properties[i].isPrimaryKey = true;
        }
    }

    createTable(tableName, properties, globalReferences);
    if(hasReference){
        drawLine(getTable(tableName),refTable);
    }
}

export function getTable(tableName) {
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].title == tableName) {
            return tables[i];
        }
    }
}

function exists(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (element == array[i])
            return true;
    }
    return false;
}

export function drawLine(baseTable, refTable){
    let startPointX = (baseTable.x + baseTable.lastPositionX) + baseTable.width/2;
    let startPointY = (baseTable.y + baseTable.lastPositionY) + baseTable.height/2;
    let endPointX = (refTable.x + refTable.lastPositionX) + refTable.width/2;
    let endPointY = (refTable.y + refTable.lastPositionY) + refTable.height/2;
    let intermediatePointX = startPointX > endPointX ? endPointX-2 : endPointX+2;

    let newElement = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    newElement.setAttribute("class", baseTable.title+"-"+refTable.title);
    newElement.setAttribute("x1", startPointX);
    newElement.setAttribute("y1", startPointY);
    newElement.setAttribute("x2", intermediatePointX);
    newElement.setAttribute("y2", startPointY);
    newElement.setAttribute("style","stroke:#FFF;stroke-width:4;");
    grp.insertAdjacentElement("afterbegin", newElement);
    newElement = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    newElement.setAttribute("class", baseTable.title+"-"+refTable.title);
    newElement.setAttribute("x1", endPointX);
    newElement.setAttribute("y1", startPointY);
    newElement.setAttribute("x2", endPointX);
    newElement.setAttribute("y2", endPointY);
    newElement.setAttribute("style","stroke:#FFF;stroke-width:4;");
    grp.insertAdjacentElement("afterbegin", newElement);
}

export function redrawReferencedLines(baseTable){

    let tableReferences = baseTable.references;
    if (tableReferences.length > 0) {
        for(let i=0; i<tableReferences.length; ++i){
            removeElementsByClass(baseTable.title+"-"+tableReferences[i].referencedTable);
        }
    }
    deleteReferencedLines(baseTable.title);

    if (tableReferences.length > 0) {
        for(let i=0; i<tableReferences.length; ++i){
            let refTable = getTable(tableReferences[i].referencedTable);
            drawLine(baseTable,refTable);
        }
    }

    tables.forEach(table => {
        if(table.references.length){
            for(let i = 0; i < table.references.length; ++i){
                if(table.references[i].referencedTable == baseTable.title){
                    drawLine(table, baseTable)
                }
            }
        }
    });
}

processTheCommand("CREATE TABLE          tabel(       nume INT NOT NULL, num int, nume2 int, PRIMARY KEY(num, nume));");

processTheCommand("CREATE TABLE tabelu(numelemeuecelmailung int NOT NULL, num int, numiii int, FOREIGN KEY(num, numiii) REFERENCES tabel(nume, num))");

// processTheCommand("CREATE TABLE tabelul(nume int, num int NOT NULL, num int, PRIMARY KEY(nume));");

// processTheCommand("CREATE TABLE Persons (ID int NOT NULL, LastName varchar(255) NOT NULL, FirstName varchar(255), Age int, PRIMARY KEY(FirstName, LastName));");

// processTheCommand("CREATE TABLE employee(id int, name varchar(100), PRIMARY KEY(id));");

// processTheCommand("CREATE TABLE employee_details(idd int, address varchar(100), PRIMARY KEY(idd));");

//processTheCommand("DROP TABLE tabel");

showProperties();

export default getTables;