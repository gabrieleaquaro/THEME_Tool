const { nodeName } = require("jquery");

function addRow(report){
    if(report["name"] != 'default'){
        var tr = document.createElement("tr");
        // nome
        var td_name = document.createElement("td")
        td_name.innerText = report["name"]
        tr.id = report["name"];
        tr.append(td_name);
        td_name.modifing = false;        

        var updateHandler = function(name){
            return function(){
                updateCurrent(name);
            }
        }

        var deleteHandler = function(name){
            return function(){
                delete_report(name)
            }
        }

        var createClickHandler = function(td){
            return function(){
                var changeName = function(td, textarea){
                    return function(){
                        if(window.event.keyCode == 13){
                            report_name = td.parentNode.id;
                            newName = textarea.value.slice(0, -1); 
                            validation = changeReportName(report_name, newName);
                            if(validation || newName == report_name){
                                textarea.parentNode.removeChild(textarea);
                                td.parentNode.id = newName;
                                td.innerText = newName;
                                td.parentNode.getElementsByTagName('button')[0].onclick = updateHandler(newName);
                                td.parentNode.getElementsByTagName('button')[1].onclick = deleteHandler(newName);
                                td.modifing = false;
                            }else{
                                textarea.className += 'error';
                                textarea.value = report_name;
                                setTimeout(function(){textarea.className = ''}, 1000);
                            }
                        }
                        //esc
                        if(window.event.keyCode == 27){
                            textarea.parentNode.removeChild(textarea);
                            td.innerText = td.parentNode.id;
                        }
                    }
                }
                if(td.modifing == false){
                    var area = document.createElement("textarea");
                    area.value = td.innerText
                    area.rows = 1;
                    area.style.resize = 'none';
                    area.addEventListener("keyup", changeName(td, area));
                    td.innerText = "";
                    td.append(area);
                    td.style.width = '27%';
                    td.modifing = true;
                }
            }
        }
        
        td_name.onclick = createClickHandler(td_name);

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
    }
}

function removeRow(report_name){
    x = document.getElementById(report_name);
    x.parentNode.removeChild(x);
}

function setUnmodifiable(report_name){
    if(report_name != 'default'){
        document.getElementById(report_name).getElementsByTagName("button")[0].disabled = true;
    }
}

function setModifiable(report_name){
    if(report_name != 'default'){
        document.getElementById(report_name).getElementsByTagName("button")[0].disabled = false;
    }
}

function setUndeleteble(report_name){
    if(report_name != 'default'){
        document.getElementById(report_name).getElementsByTagName("button")[1].disabled = true;
    }
}

function refreshReports(){
    document.getElementById("tBody").innerHTML = "";
    var files = fs.readdirSync(base_dir + 'dati/');
    reports = []
    // read file
    Object.keys(files).forEach(function(key) {
        let rawdata = fs.readFileSync(base_dir + 'dati/' + files[key]);
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



