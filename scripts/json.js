"use strict";
const fs = require("fs");

// Check that config file exists or create it
let rawdata
if (!fs.existsSync('./config.json')){
    fs.writeFileSync('./config.json', JSON.stringify({ "currentReport": "default.json"}, null, 4));
}
rawdata = fs.readFileSync('./config.json'); 
let config = JSON.parse(rawdata);
var currentReport = config["currentReport"]

// mostrare report a video
showUpdate()

// Checks taht dati folder exists
if(!fs.existsSync('./dati/')){
    fs.mkdirSync('./dati/');
}

//Checks that the current report exists and load it
if(!fs.existsSync('./dati/' + currentReport)){
    let date_to_print = new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear()
    fs.writeFileSync('./dati/' + currentReport,  JSON.stringify({"name" : currentReport, "date" : Date.now(), "dateToPrint" : date_to_print}, null, 4));
}

rawdata = fs.readFileSync('./dati/' + currentReport);
let report = JSON.parse(rawdata);

var currentPage = document.getElementById("title").innerText

updatePage(report)

function updatePage(report){
    // con dati.json modifica tutti i campi nella pagina
    if(currentPage != ""){
        if (report[currentPage] == null){
            report[currentPage] = {}
        }
        
        Object.keys(report[currentPage]).forEach(function(key) {
            //console.log('Key : ' + key + ', Value : ' + report[currentPage][key])
            document.getElementById(key).value = report[currentPage][key]
        })
        
        updateResults(currentPage, report);
    }
}

// on change fai si che dati.json venga modificato e poi salva il file nel path
function updateJSONevent(e){
    var field = e.target.id;
    var data = e.target.value;
    updateJSON(field,data)
    //In update results le tabelle alla fine di ogni pagina vengono riempite
    updateResults(currentPage, report) 
}

function updateJSON(field,data){
    report[currentPage][field] = data;
    fs.writeFileSync('./dati/' + currentReport,  JSON.stringify(report, null, 4));
}

// create new report
function newReport(){
    var i = 1;
    do{
        var report_name = "report_" + new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_"+i+".json";
        i++;
    }while(fs.existsSync('./dati/' + report_name));

    var data = {
        "name" : report_name,
        "date": Date.now(),
        "dateToPrint": new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()
    }
       
    var data_string = JSON.stringify(data, null, 4);
    fs.writeFileSync('./dati/' + report_name, data_string);
    if(currentPage == ""){
        refreshReports(data);
    }
    snackbarShow();
    updateCurrent(report_name, false);
}

// update stats in config of current report
function updateCurrent(report_name, printSnackbar = true){
    var old_rep = config["currentReport"];
    config["currentReport"] = report_name
    currentReport = report_name

    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    showUpdate()
    if(printSnackbar){
        snackbarShow("#28a745", "Report Corrente Aggiornato");
    }
    if(currentPage == ""){
        setUnmodifiable(report_name);
        setModifiable(old_rep);
    }
    updatePage(JSON.parse(fs.readFileSync('./dati/' + report_name)));
}

//delete the report file with the passed name
function delete_report(name){
    if (confirm('Sei sicuro di voler cancellare questo report? (AZIONE IRREVERSIBILE!)')) {
        if(name  == currentReport){            
            updateCurrent("default.json");
        }
        removeRow(name);
        fs.unlinkSync("./dati/" + name);
        snackbarShow("#dc3545", "Report Eliminato");
        
    }
    else {
        var color = "#ffc107";
        var text = "Eliminazione Annullata, report conservato";
        snackbarShow(color , text);
      }
    }

//Saves the current report status into a file
function save(){
    var d = new Date();
    var filename = "report_" + d.getDate()+ "_" + d.getMonth();
    var text = fs.readFileSync('./dati/' + currentReport);
    download(filename, text);
}


//Download a text file with the passed information
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename + '.json');
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
 }

//Gets a file and load it into report variable
function load_data(event){
    var file = event.target.files[0]
    var reader = new FileReader();

    reader.onload = onReaderLoad;
    reader.readAsText(file);
}

function onReaderLoad(event){
    var data = JSON.parse(event.target.result);
    console.log(data)

    //TODO do something with the data read...
}

function show_loader(){
    document.getElementById("file-loader").style = "padding-left:5%;";
}

function resetCurrent(){
    if (confirm('Resettare questo report allo stato originale?')){
        let date_to_print = new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear()
        let resetted_report = {"name" : currentReport, "date" : Date.now(), "dateToPrint" : date_to_print};
        fs.writeFileSync('./dati/' + currentReport,  JSON.stringify(resetted_report, null, 4));
        refreshPage();
    }
    else{
        var color = "#ffc107";
        var text = "Reset Annullato";
        snackbarShow(color , text);
    }
}

function showUpdate(){
    document.getElementById("current_report_title").innerText = currentReport.split(".")[0]
}

function refreshPage(){
    document.location.reload(true)
  }
