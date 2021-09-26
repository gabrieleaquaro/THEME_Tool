'use strict';
const fs = require('fs');

// Check that config file exists or create it
let rawdata
if (!fs.existsSync('./config.json')){
    fs.writeFileSync('./config.json', JSON.stringify({ "currentReport": "default.json"}, null, 4));
}
rawdata = fs.readFileSync('./config.json'); 
let config = JSON.parse(rawdata);
var currentReport = config["currentReport"]

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

// con dati.json modifica tutti i campi nella pagina
if(currentPage != ""){
    if (report[currentPage] == null){
        report[currentPage] = {}
    }
    
    Object.keys(report[currentPage]).forEach(function(key) {
        console.log('Key : ' + key + ', Value : ' + report[currentPage][key])
        document.getElementById(key).value = report[currentPage][key]
    })
    
}



// on change fai si che dati.json venga modificato e poi salva il file nel path
function updateJSON(e){
    var field = e.target.id;
    var data = e.target.value;
    report[currentPage][field] = data;
    fs.writeFileSync('./dati/' + currentReport,  JSON.stringify(report, null, 4));
}

// create new report
function newReport(){

    var report_name = "report_" + new Date().getDate() + "_" + (new Date().getMonth() + 1) + ".json"
    var data = {
        "name" : report_name,
        "date": Date.now(),
        "dateToPrint": new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear()
    }
    
    var i = 1
    while(fs.existsSync('./dati/' + report_name)){
        report_name = "report_" + new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_"+i+".json"
        i++
    }

   
    data = JSON.stringify(data, null, 4)
    fs.writeFileSync('./dati/' + report_name, data);
    updateCurrent(report_name)
    if(currentPage == ""){
        location.reload();
    }
}

// update stats in config of current report
function updateCurrent(report_name){
    config["currentReport"] = report_name
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
    console.log("Update to " + report_name)
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
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
 }

// TODO
// - insierie pagina con tabella che legga tutti i file in dati
// - dare la possibilità di cambiare nome al file json
// - sistemare data print aggiungendo anno e togliendo underscore
// - aggiungere nel dict anche il nome del file
// - sistemare menu laterale reports 
