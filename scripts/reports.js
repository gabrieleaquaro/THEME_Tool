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
reports.forEach(function(el) {
    var tr = document.createElement("tr");
    // nome
    var td_name = document.createElement("td")
    td_name.innerText = el["name"]
    tr.append(td_name)

    // data
    var td_date = document.createElement("td")
    td_date.innerText = el["dateToPrint"]
    tr.append(td_date)

    // bottone di modifica
    var td_button_modify = document.createElement("td")
    td_button_modify.innerHTML = '<button type="button" class="btn btn-outline-success" onclick="updateCurrent('+"'"+el["name"]+"'"+')" >Modifica</button>'
    tr.append(td_button_modify)

    // bottone di elimina
    var td_button_delete = document.createElement("td")
    td_button_delete.innerHTML = '<button type="button" class="btn btn-outline-danger" onclick="delete('+"'"+el["name"]+"'"+')">Elimina</button>'
    tr.append(td_button_delete)

    const element = document.getElementById("tBody");
    element.appendChild(tr);
})