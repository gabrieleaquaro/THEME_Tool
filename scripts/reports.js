function addRow(report){
    var tr = document.createElement("tr");
    // nome
    var td_name = document.createElement("td")
    td_name.innerText = report["name"].split(".")[0]
    tr.id = report["name"];
    tr.append(td_name)

    // data
    var td_date = document.createElement("td")
    td_date.innerText = report["dateToPrint"]
    tr.append(td_date)

    // bottone di modifica
    var td_button_modify = document.createElement("td")
    td_button_modify.innerHTML = '<button type="button" class="btn btn-outline-success" onclick="updateCurrent('+"'"+report["name"]+"'"+')" >Modifica</button>'
    tr.append(td_button_modify)

    // bottone di elimina
    var td_button_delete = document.createElement("td")
    td_button_delete.innerHTML = '<button type="button" class="btn btn-outline-danger" onclick="delete_report('+"'"+report["name"]+"'"+')">Elimina</button>'
    tr.append(td_button_delete)

    const element = document.getElementById("tBody");
    element.appendChild(tr);

    if (report["name"] == currentReport){
        setUnmodifiable(report["name"]);
    }

    if (report["name"] == "default.json"){
        setUnmodifiable(report["name"]);
        setUndeleteble(report["name"]);
    }

}

function removeRow(report_name){
    x = document.getElementById(report_name);
    x.parentNode.removeChild(x);
}

function setUnmodifiable(report_name){
    document.getElementById(report_name).getElementsByTagName("button")[0].disabled = true;
}

function setModifiable(report_name){
    document.getElementById(report_name).getElementsByTagName("button")[0].disabled = false;
}

function setUndeleteble(report_name){
    document.getElementById(report_name).getElementsByTagName("button")[1].disabled = true;
}

function refreshReports(){
    document.getElementById("tBody").innerHTML = "";
    var files = fs.readdirSync('./dati/');
    reports = []
    // read file
    Object.keys(files).forEach(function(key) {
        let rawdata = fs.readFileSync('./dati/' + files[key]);
        let report = JSON.parse(rawdata);
        reports.push(report)
    })
    
    // sort file by data
    reports.sort(function(a,b) {
            return b.date - a.date
        });
    // insert file in table
    reports.forEach(report =>addRow(report));
}

refreshReports()

