"use strict";
const fs = require("fs");
const base_dir = './';

// Check that config file exists or create it
if (!fs.existsSync(base_dir + 'config')){
    fs.writeFileSync(base_dir + 'config', JSON.stringify({ "lastModifiedReport": "default", "openedWindows" : 0, "currentReports" : {0 : 'default'}}, null, 4));
}

var configData = fs.readFileSync(base_dir + 'config'); 
var config = JSON.parse(configData);
var currentReport = config["currentReports"][window.name]

if (window.name == ''){
    config["openedWindows"] += 1
    window.name =  Math.max(...Object.keys(config["currentReports"]).map(function(v) {return parseInt(v, 10);})) + 1
    config["currentReports"][window.name] = config['lastModifiedReport']
    currentReport = config["currentReports"][window.name]
    fs.writeFileSync(base_dir + 'config', JSON.stringify(config, null, 4));
}


// Checks that dati folder exists
if(!fs.existsSync(base_dir + 'dati/')){
    fs.mkdirSync(base_dir + 'dati/');
}

//Checks that the current report exists and load it
if(!fs.existsSync(base_dir + 'dati/' + currentReport)){
    let date_to_print = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()
    fs.writeFileSync(base_dir + 'dati/' + currentReport,  JSON.stringify({"name" : currentReport, "date" : Date.now(), "dateToPrint" : date_to_print}, null, 4));
}

let rawdata = fs.readFileSync(base_dir + 'dati/' + currentReport);
let report = JSON.parse(rawdata);

var currentPage = document.getElementById("title").innerText

// mostrare report a video
showUpdate()
updatePage(report)

function updatePage(report){
    // con dati modifica tutti i campi nella pagina
    if(currentPage != ""){
        if (report[currentPage] == null){
            report[currentPage] = {}
        }
        
        Object.keys(report[currentPage]).forEach(function(key) {
            //console.log('Key : ' + key + ', Value : ' + report[currentPage][key])
            if(document.getElementById(key)){
                document.getElementById(key).value = report[currentPage][key]
            }
            
        })
        
        updateResults(currentPage, report);
    }
}

// on change fai si che dati venga modificato e poi salva il file nel path
function updateJSONevent(e){
    var field = e.target.id;
    var data = e.target.value;
    updateJSON(field,data)
    //In update results le tabelle alla fine di ogni pagina vengono riempite
    updateResults(currentPage, report) 
}

function updateJSON(field,data){
    report[currentPage][field] = data;
    fs.writeFileSync(base_dir + 'dati/' + currentReport,  JSON.stringify(report, null, 4));
}

// create new report
function newReport(){
    var i = 1;
    do{
        var report_name = "report_" + new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_"+i+"";
        i++;
    }while(fs.existsSync(base_dir + 'dati/' + report_name));

    var data = {
        "name" : report_name,
        "date": Date.now(),
        "dateToPrint": new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()
    }
       
    var data_string = JSON.stringify(data, null, 4);
    fs.writeFileSync(base_dir + 'dati/' + report_name, data_string);
    if(currentPage == ""){
        refreshReports(data);
    }
    snackbarShow();
    updateCurrent(report_name, false);
}

// update stats in config of current report
function updateCurrent(report_name, printSnackbar = true, changeName = false){
    var old_rep = config["currentReports"][window.name];
    config["currentReports"][window.name] = report_name
    config['lastModifiedReport'] = report_name
    currentReport = report_name

    fs.writeFileSync(base_dir + 'config', JSON.stringify(config, null, 4));
    showUpdate()
    if(printSnackbar){
        snackbarShow("rgb(66,166,42)", "Report Corrente Aggiornato");
    }
    if(currentPage == "" && !changeName){
        setUnmodifiable(report_name);
        setModifiable(old_rep);
    }
    updatePage(JSON.parse(fs.readFileSync(base_dir + 'dati/' + report_name)));
}

//delete the report file with the passed name
function delete_report(name){
    if (confirm('Sei sicuro di voler cancellare questo report? (AZIONE IRREVERSIBILE!)')) {
        if(name  == currentReport){            
            updateCurrent("default");
        }
        removeRow(name);
        fs.unlinkSync("base_dir + 'dati/" + name);
        snackbarShow("rgb(192,0,0)", "Report Eliminato");
        
    }
    else {
        var color = "rgb(255, 213, 0)";
        var text = "Eliminazione Annullata, report conservato";
        snackbarShow(color , text);
      }
    }

//Saves the current report status into a file
function save(){
    var d = new Date();
    var filename = "report_" + d.getDate()+ "_" + d.getMonth();
    var text = fs.readFileSync(base_dir + 'dati/' + currentReport);
    download(filename, text);
}


//Download a text file with the passed information
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename + '');
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
 }

//Gets a file and load it into report variable
function load_data(event){
    var file = event.target.files[0]
    var reader = new FileReader();

    reader.fileName = file.name
    reader.onload = onReaderLoad;
    reader.readAsText(file);
}

function changeReportName(currentName, newName){
    report = JSON.parse(fs.readFileSync(base_dir + 'dati/'+ currentName));
    report["name"] = newName
    if(fs.existsSync(base_dir + 'dati/'+newName)){
        return false;
    }
    fs.writeFileSync(base_dir + 'dati/' + newName, JSON.stringify(report, null, 4));
    fs.unlinkSync(base_dir + 'dati/' + currentName);
    if(currentReport == currentName){
        updateCurrent(newName, true, true);
    }
    Object.keys(config["currentReports"]).forEach(function(key){ 
        if(config["currentReports"][key] == currentName){ 
            config["currentReports"][key] = newName;
            fs.writeFileSync(base_dir + 'config', JSON.stringify(config, null, 4));
        }
    });
    return true;
}

function onReaderLoad(event){
    try {
        var data = JSON.parse(event.target.result);
    } catch (e) {
        console.log(e);
        snackbarShow("#dc3545", "File caricato non valido");
    }
    console.log(data);

    var new_data = {}
    new_data["name"] = escapeHTML(event.target.fileName)
    new_data["date"] = escapeHTML(data["date"]);
    new_data["dateToPrint"] = escapeHTML(data["dateToPrint"]);
    
    const pages_ids = ["prob_errore", "barriere_dirette", "barriere_salvaguardia", "valori_culturali"]; 
    pages_ids.forEach(function(page_id){
        new_data[page_id] = {};
        Object.keys(data[page_id]).forEach(function(key){
            if(isElement(key)){
                new_data[page_id][key] = escapeHTML(data[page_id][key]); 
            }
        });
    }); 
      
    var i = 1;
    while(fs.existsSync(base_dir + 'dati/' + new_data["name"])){
        new_data["name"] = new_data["name"] + '_'+ i + ''; 
        i += 1;
    }
    fs.writeFileSync(base_dir + 'dati/' + new_data["name"],  JSON.stringify(new_data, null, 4));
    snackbarShow("#28a745", "Nuovo report caricato correttamente");
    if(currentPage == ''){
        refreshPage();
    }
}

function escapeHTML(unsafe) {
    return unsafe.toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function isElement(string){
    const ids_prob_errore = ["TipoTask","PSFComposto","ProbErrore","ProbErroreAdj","TempoDisponibie","StressDaMinaccia","ComplessitàTask","Esperienza","Procedure","InterazioneUmanoMacchina","ContestoAmbientale","Affaticamento","DescrizioneTask","TipoTask_note","TempoDisponibile_note","StressDaMinaccia_note","ComplessitàTask_note","Esperienza_note","Procedure_note","InterazioneUmanoMacchina_note","ContestoAmbientale_note","Affaticamento_note"];
    const ids_barriere_dirette = ["PrestSicuraCompiti","Adesione", "PrestSicuraContesto","Partecipazione","LavoroSquad","Comunicazione","barriere_dirette_1_1","barriere_dirette_1_2","barriere_dirette_1_3","barriere_dirette_1_4","barriere_dirette_1_5","barriere_dirette_2_1","barriere_dirette_2_2","barriere_dirette_2_3","barriere_dirette_2_4","barriere_dirette_2_5","barriere_dirette_3_1","barriere_dirette_3_2","barriere_dirette_3_3","barriere_dirette_3_4","barriere_dirette_3_5","barriere_dirette_4_1","barriere_dirette_4_2","barriere_dirette_4_3","barriere_dirette_4_4","barriere_dirette_4_5","barriere_dirette_5_1","barriere_dirette_5_2","barriere_dirette_5_3","barriere_dirette_5_4","barriere_dirette_5_5","barriere_dirette_6_1","barriere_dirette_6_2","barriere_dirette_6_3","barriere_dirette_6_4","barriere_dirette_6_5","barriere_dirette_6_6","barriere_dirette_1_1_note","barriere_dirette_1_2_note","barriere_dirette_1_3_note","barriere_dirette_1_4_note","barriere_dirette_1_5_note","barriere_dirette_2_1_note","barriere_dirette_2_2_note","barriere_dirette_2_3_note","barriere_dirette_2_4_note","barriere_dirette_2_5_note","barriere_dirette_3_1_note","barriere_dirette_3_2_note","barriere_dirette_3_3_note","barriere_dirette_3_4_note","barriere_dirette_3_5_note","barriere_dirette_4_1_note","barriere_dirette_4_2_note","barriere_dirette_4_3_note","barriere_dirette_4_4_note","barriere_dirette_4_5_note","barriere_dirette_5_1_note","barriere_dirette_5_2_note","barriere_dirette_5_3_note","barriere_dirette_5_4_note","barriere_dirette_5_5_note","barriere_dirette_6_1_note","barriere_dirette_6_2_note","barriere_dirette_6_3_note","barriere_dirette_6_4_note","barriere_dirette_6_5_note","barriere_dirette_6_6_note"];
    const ids_barriere_salvaguardia = ["CompNonTechSicurezza","CompTechSicurezza","MotivazioneSicurezza","CittadinanzaSicurezza","ValutazioneSicurezza","LeaderHSE","ClimaHSE","barriere_salvaguardia_1_1","barriere_salvaguardia_1_2","barriere_salvaguardia_1_3","barriere_salvaguardia_1_4","barriere_salvaguardia_1_5","barriere_salvaguardia_1_6","barriere_salvaguardia_1_7","barriere_salvaguardia_1_8","barriere_salvaguardia_2_1","barriere_salvaguardia_2_2","barriere_salvaguardia_2_3","barriere_salvaguardia_2_4","barriere_salvaguardia_2_5","barriere_salvaguardia_3_1","barriere_salvaguardia_3_2","barriere_salvaguardia_3_3","barriere_salvaguardia_3_4","barriere_salvaguardia_3_5","barriere_salvaguardia_4_1","barriere_salvaguardia_4_2","barriere_salvaguardia_4_3","barriere_salvaguardia_4_4","barriere_salvaguardia_4_5","barriere_salvaguardia_4_6","barriere_salvaguardia_4_7","barriere_salvaguardia_4_8","barriere_salvaguardia_5_1","barriere_salvaguardia_5_2","barriere_salvaguardia_5_3","barriere_salvaguardia_5_4","barriere_salvaguardia_5_5","barriere_salvaguardia_5_6","barriere_salvaguardia_5_7","barriere_salvaguardia_5_8","barriere_salvaguardia_6_1","barriere_salvaguardia_6_2","barriere_salvaguardia_6_3","barriere_salvaguardia_6_4","barriere_salvaguardia_6_5","barriere_salvaguardia_6_6","barriere_salvaguardia_6_7","barriere_salvaguardia_6_8","barriere_salvaguardia_7_1","barriere_salvaguardia_7_2","barriere_salvaguardia_7_3","barriere_salvaguardia_7_4","barriere_salvaguardia_7_5","barriere_salvaguardia_7_6","barriere_salvaguardia_7_7","barriere_salvaguardia_7_8","barriere_salvaguardia_7_9","barriere_salvaguardia_7_10","barriere_salvaguardia_1_1_note","barriere_salvaguardia_1_2_note","barriere_salvaguardia_1_3_note","barriere_salvaguardia_1_4_note","barriere_salvaguardia_1_5_note","barriere_salvaguardia_1_6_note","barriere_salvaguardia_1_7_note","barriere_salvaguardia_1_8_note","barriere_salvaguardia_2_1_note","barriere_salvaguardia_2_2_note","barriere_salvaguardia_2_3_note","barriere_salvaguardia_2_4_note","barriere_salvaguardia_2_5_note","barriere_salvaguardia_3_1_note","barriere_salvaguardia_3_2_note","barriere_salvaguardia_3_3_note","barriere_salvaguardia_3_4_note","barriere_salvaguardia_3_5_note","barriere_salvaguardia_4_1_note","barriere_salvaguardia_4_2_note","barriere_salvaguardia_4_3_note","barriere_salvaguardia_4_4_note","barriere_salvaguardia_4_5_note","barriere_salvaguardia_4_6_note","barriere_salvaguardia_4_7_note","barriere_salvaguardia_4_8_note","barriere_salvaguardia_5_1_note","barriere_salvaguardia_5_2_note","barriere_salvaguardia_5_3_note","barriere_salvaguardia_5_4_note","barriere_salvaguardia_5_5_note","barriere_salvaguardia_5_6_note","barriere_salvaguardia_5_7_note","barriere_salvaguardia_5_8_note","barriere_salvaguardia_6_1_note","barriere_salvaguardia_6_2_note","barriere_salvaguardia_6_3_note","barriere_salvaguardia_6_4_note","barriere_salvaguardia_6_5_note","barriere_salvaguardia_6_6_note","barriere_salvaguardia_6_7_note","barriere_salvaguardia_6_8_note","barriere_salvaguardia_7_1_note","barriere_salvaguardia_7_2_note","barriere_salvaguardia_7_3_note","barriere_salvaguardia_7_4_note","barriere_salvaguardia_7_5_note","barriere_salvaguardia_7_6_note","barriere_salvaguardia_7_7_note","barriere_salvaguardia_7_8_note","barriere_salvaguardia_7_9_note","barriere_salvaguardia_7_10_note"];
    const ids_valori_culturali = ["Individualismo","DistPotere","RigeIncertezza","Mascolinità","valori_culturali_1_1","valori_culturali_1_2","valori_culturali_1_3","valori_culturali_2_1","valori_culturali_2_2","valori_culturali_2_3","valori_culturali_3_1","valori_culturali_3_2","valori_culturali_3_3","valori_culturali_4_1","valori_culturali_4_2","valori_culturali_4_3","valori_culturali_5_1","valori_culturali_5_2","valori_culturali_5_3","Orientamento"];

    return ids_prob_errore.includes(string) || ids_barriere_dirette.includes(string) || ids_barriere_salvaguardia.includes(string) || ids_valori_culturali.includes(string)
}

function resetCurrent(){
    if (confirm('Resettare questo report allo stato originale?')){
        let date_to_print = new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear()
        let resetted_report = {"name" : currentReport, "date" : Date.now(), "dateToPrint" : date_to_print};
        fs.writeFileSync(base_dir + 'dati/' + currentReport,  JSON.stringify(resetted_report, null, 4));
        refreshPage();
    }
    else{
        var color = "rgb(255, 213, 0)";
        var text = "Reset Annullato";
        snackbarShow(color , text);
    }
}

function showUpdate(){
    document.getElementById("current_report_title").innerText = currentReport
}

function refreshPage(){
    document.location.reload(true)
  }
