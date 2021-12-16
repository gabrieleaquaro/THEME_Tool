
const green_transp = '#33CC3380';
const green = '#33CC33';
const yellow_transp = '#FFFF3380';
const yellow = '#FFFF33';
const orange_transp = '#ffae0080';
const orange = '#ffae00';
const red_transp = '#FF333380';
const red = '#FF3333';


const { Chart } = require("chart.js");
const { contentTracing } = require("electron");
const { truncate } = require("original-fs");

const size_labels = 18

//Icon loading
feather.replace()

// popover enabling
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})


// import jQuery
window.$ = window.jQuery = require('jquery');

function snackbarShow(color = "#28a745", text = "Nuovo report creato e pronto per la modifica!"){
    var x = document.getElementById("snackbar");
    x.style.backgroundColor = color;
    //SHOW
    x.className = "show";
    x.innerText = text;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

//Update the results at the end of the page, given the pageTitle
function updateResults(currentPage, report){

    //Switch alla funzione giusta in base alla pagina 
    switch (currentPage) {
        case 'prob_errore':
            updateProbError_results(report[currentPage]);
            break;

        case 'barriere_dirette':
            updateBarriereDirette_results(report[currentPage]);
            break;

        case 'barriere_salvaguardia':
            updateBarriereSalvaguardia_results(report[currentPage]);
            break;
        
        case 'valori_culturali':
            updateValoriCulturali_results(report[currentPage]);
            break;

        case 'risultati':
            updateRisultati_results(report);
            break;

        case 'interventi':
            updateInterventi_results(report);

        default:
          break;
      }
      
}

//Update della tabella a fie di Prob Errore
function updateProbError_results(data){

    elements_PSF = ["TempoDisponibie","StressDaMinaccia","ComplessitàTask","Esperienza" ,"Procedure" ,"InterazioneUmanoMacchina","ContestoAmbientale","Affaticamento"]

    
    var PSFComposto = 1
    var Cluster1 = 1
    var Cluster2 = 1
    var Cluster3 = 1

    elements_PSF.forEach(function(key){
        if(data[key] != null && data[key] != "-"){
            PSFComposto = PSFComposto * data[key] ;
    }});

    elements_PSF.slice(0, 4).forEach(function(key){
        if(data[key] != null && data[key] != "-"){
            //console.log(key)
            Cluster1 = Cluster1 * data[key] ;
    }});
    //console.log("----------")
    elements_PSF.slice(4, 6).forEach(function(key){
        if(data[key] != null && data[key] != "-"){
            //console.log(key)
            Cluster2 = Cluster2 * data[key] ;
    }});
    //console.log("----------")
    elements_PSF.slice(6, 8).forEach(function(key){
        if(data[key] != null && data[key] != "-"){
            //console.log(key)
            Cluster3 = Cluster3 * data[key] ;
    }});

    tipotask = data["TipoTask"] 

    if(tipotask != null){
        ProbErrore = PSFComposto * tipotask;

        ProbErroreAdj = ProbErrore/(tipotask*(PSFComposto-1)+1);

        document.getElementById("PSFComposto").innerText = Math.round(PSFComposto * 100) / 100;
        updateJSON("PSFComposto", Math.round(PSFComposto * 100000) / 100000);

        document.getElementById("ProbErrore").innerText = Math.round(ProbErrore * 100000) / 100000;
        updateJSON("ProbErrore",Math.round(ProbErrore * 100000) / 100000);

        document.getElementById("ProbErroreAdj").innerText = Math.round(ProbErroreAdj * 10000 ) * 100 / 10000 + "%";
        updateJSON("ProbErroreAdj",Math.round(ProbErroreAdj * 100000) / 100000);
    
        if (document.getElementById("Cluster1")){
            document.getElementById("Cluster1").innerText = Math.round(Cluster1 * 100) / 100 ;
        }
        updateJSON("Cluster1",Math.round(Cluster1 * 100) / 100 );

        if (document.getElementById("Cluster2")){
            document.getElementById("Cluster2").innerText = Math.round(Cluster2 * 100) / 100 ;
        }
        updateJSON("Cluster2",Math.round(Cluster2 * 100) / 100 );

        if (document.getElementById("Cluster3")){
            document.getElementById("Cluster3").innerText = Math.round(Cluster3 * 100) / 100 ;
        }
        updateJSON("Cluster3",Math.round(Cluster3 * 100) / 100);

    }
}

//Update della tabella a file barriere dirette
function updateBarriereDirette_results(data){

    elements = ["PrestSicuraCompiti","Adesione","PrestSicuraContesto","Partecipazione" ,"LavoroSquad" ,"Comunicazione"]

    var val;
    var total_val = 0;
    for(var i = 1; i< elements.length + 1; i++){
        val = 0
        max = i != 6 ? 6 : 7
        var count = 0
        for(var j = 1; j < max; j++){
            if(data["barriere_dirette_"+i+"_" + j] == undefined){
                val = "-"
                break
            }
            else if(data["barriere_dirette_"+i+"_" + j] != '-'){
                val += parseFloat(data["barriere_dirette_"+i+"_" + j])
                count += 1
            }
        }
        if(val != "-"){
            val = Math.round(val / count * 100) / 100;
            total_val = total_val + val
        }   
        document.getElementById(elements[i - 1]).innerText = val;
        document.getElementById(elements[i - 1] + "_1").innerText =  val;
        updateJSON(elements[i - 1],  val);
        
    }
    updateJSON("average_barriere_dirette",  Math.round(total_val/6 * 100) / 100);


}

//Update della tabella a file barriere dirette
function updateBarriereSalvaguardia_results(data){

    elements = ["CompNonTechSicurezza","CompTechSicurezza","MotivazioneSicurezza","CittadinanzaSicurezza","ValutazioneSicurezza","LeaderHSE","ClimaHSE"]

    var val;

    for(var i = 1; i< elements.length + 1; i++){
        val=0
        max = (i==2 || i == 3) ? 6 : i == 7 ? 11 : 9 
        var count = 0
        
        for(var j = 1; j< max; j++){
            //console.log("barriere_salvaguardia_"+i+"_" + j +': ', data["barriere_salvaguardia_"+i+"_" + j])
            if(data["barriere_salvaguardia_"+i+"_" + j] == undefined){
                val = "-"
                break
            }
            else if(data["barriere_salvaguardia_"+i+"_" + j] != '-'){
                val += parseFloat(data["barriere_salvaguardia_"+i+"_" + j])
                count += 1
            }
        }
        if(val != "-"){
            val = Math.round(val / count * 100) / 100;
        }   
        document.getElementById(elements[i - 1]).innerText = val;
        document.getElementById(elements[i - 1] + "_1").innerText =  val;
        updateJSON(elements[i - 1],  val);
    }
}

//Update della tabella a file barriere dirette
function updateValoriCulturali_results(data){

    elements = ["Individualismo","DistPotere","RigeIncertezza","Mascolinità","Orientamento"]

    var val;

    for(var i = 1; i< elements.length + 1; i++){
        val = 0
        max = 4
        var count = 0
        for(var j = 1; j < max; j++){
            //console.log("valori_culturali_"+i+"_" + j +':', data["valori_culturali_"+i+"_" + j])
            if(data["valori_culturali_"+i+"_" + j] == undefined){
                val = "-"
                break
            }
            else if(data["valori_culturali_"+i+"_" + j] != '-'){
                val += parseFloat(data["valori_culturali_"+i+"_" + j])
                count += 1
            }
            
        }
        if(val != "-"){
            val = Math.round(val / count * 100) / 100;
        }   
        
        document.getElementById(elements[i - 1]).innerText = val;
        document.getElementById(elements[i - 1] + "_1").innerText =  val;
        updateJSON(elements[i - 1],  val);
    }
}


//Update dei risultati in results page
function updateRisultati_results(report){
    if(report['prob_errore']){
        //First table of PSF
        elements_PSF = ["TempoDisponibie","StressDaMinaccia","ComplessitàTask","Esperienza" ,"Procedure" ,"InterazioneUmanoMacchina","ContestoAmbientale","Affaticamento"]
        elements_PSF.forEach(function(key){
            if(report['prob_errore'][key] != null){
                let value = report['prob_errore'][key];
                if(document.getElementById(key)){
                    document.getElementById(key).innerText = value;
                }
                
                let color = value <= 1 ? green_transp : value <= 2  ? yellow_transp : red_transp;
                document.getElementById(key).parentNode.style.backgroundColor = color; 
            }
            else{
                document.getElementById(key).innerText = '-';
            }
        })
        generateChart_PSF(report["prob_errore"]);
        generateBarChart_PSF(report["prob_errore"]);

        other_elements = ["Cluster1", "Cluster2", "Cluster3"]
        
        other_elements.forEach(function(key){
            if(report['prob_errore'][key] != undefined){
                document.getElementById(key).innerText = report['prob_errore'][key]
            }else{
                document.getElementById(key).innerText = "-"
            }
        })


        
    }else{
        generateChart_PSF({});
        generateBarChart_PSF({});
        elements_PSF = ["TempoDisponibie","StressDaMinaccia","ComplessitàTask","Esperienza" ,"Procedure" ,"InterazioneUmanoMacchina","ContestoAmbientale","Affaticamento", "Cluster1", "Cluster2", "Cluster3"]
        elements_PSF.forEach(function(key){

            document.getElementById(key).innerText = '-';
        });
    }

    if(report['barriere_dirette']){
        //First table of Barriere Dirette
        elements_barriereDirette = ["PrestSicuraCompiti","Adesione","PrestSicuraContesto","Partecipazione" ,"LavoroSquad" ,"Comunicazione"]
        elements_barriereDirette.forEach(function(key){
            if(report['barriere_dirette'][key] != null && !isNaN(report['barriere_dirette'][key])){
                let value = report['barriere_dirette'][key];
                document.getElementById(key).innerText = Math.round(value*100)/100;
                let color = value <= 0.5 ? red_transp : value <= 0.7 ? yellow_transp : green_transp;
                document.getElementById(key).parentNode.style.backgroundColor = color; 
            }
            else{
                document.getElementById(key).innerText = '-';
            }
        })
        generateChart_Barriere_dirette(report["barriere_dirette"]);
        generateBarChart_BD(report["barriere_dirette"]);

        
    }else{
        generateChart_Barriere_dirette({});
        generateBarChart_BD({});
        elements_barriereDirette = ["PrestSicuraCompiti","Adesione","PrestSicuraContesto","Partecipazione" ,"LavoroSquad" ,"Comunicazione"]
        elements_barriereDirette.forEach(function(key){
            document.getElementById(key).innerText = '-';
        });
    }

    if(report['barriere_salvaguardia']){
        //First table of Barriere Dirette
        elements_barriereSalvaguardia = ["CompNonTechSicurezza","CompTechSicurezza","MotivazioneSicurezza","CittadinanzaSicurezza","ValutazioneSicurezza","LeaderHSE","ClimaHSE"]
        elements_barriereSalvaguardia.forEach(function(key){
            if(report['barriere_salvaguardia'][key] != null && report['barriere_salvaguardia'][key] != '-' ){
                let value = report['barriere_salvaguardia'][key];
                document.getElementById(key).innerText = Math.round(value*100)/100;
                let color = value <= 0.5 ? red_transp : value <= 0.7 ? yellow_transp : green_transp;
                document.getElementById(key).parentNode.style.backgroundColor = color; 
            }
            else{
                document.getElementById(key).innerText = '-';
            }
        })
        generateChart_Barriere_Salvaguardia(report["barriere_salvaguardia"]);
        generateBarChart_BS(report["barriere_salvaguardia"]);

    }else{
        generateChart_Barriere_Salvaguardia({});
        generateBarChart_BS({});
        elements_barriereSalvaguardia = ["CompNonTechSicurezza","CompTechSicurezza","MotivazioneSicurezza","CittadinanzaSicurezza","ValutazioneSicurezza","LeaderHSE","ClimaHSE"]
        elements_barriereSalvaguardia.forEach(function(key){
            document.getElementById(key).innerText = '-';
        });
    }

    total_valori = 0
    if(report['valori_culturali']){
        //First table of Barriere Dirette
        elements = ["Individualismo","DistPotere","RigeIncertezza","Mascolinità","Orientamento"]
        elements.forEach(function(key){
            if(report['valori_culturali'][key] != null && report['valori_culturali'][key] != '-' ){
                let value = report['valori_culturali'][key];
                if(Math.round(value*100)/100 > 0.68){
                    document.getElementById(key).innerText = "VH"
                }else if(Math.round(value*100)/100 > 0.34){
                    document.getElementById(key).innerText = "H"
                }else if(Math.round(value*100)/100 > 0){
                    document.getElementById(key).innerText = "L"
                }else{
                    document.getElementById(key).innerText = "VL"
                }
                document.getElementById(key+"_bar").setAttribute("aria-valuenow", value * 100);
                document.getElementById(key+"_bar").setAttribute("style","width: "+( value * 100)+"%");
                document.getElementById(key+"_bar").style.color = '#000000';
                document.getElementById(key+"_bar").innerText = ( value * 100)+"%";
                if(value < 0.01){
                    document.getElementById(key + "_bar").parentNode.innerText = ( value * 100)+"%";
                }
                total_valori = total_valori + value
            }
            else{
                document.getElementById(key).innerText = '-';
                document.getElementById(key+"_bar").setAttribute("aria-valuenow", 0);
                document.getElementById(key+"_bar").setAttribute("style","width: 0%");
                document.getElementById(key+"_bar").parentNode.innerText = "0%";
            }
        })
        generateChart_Valori_Culturali(report["valori_culturali"]);
    }else{
        generateChart_Valori_Culturali({});
        elements = ["Individualismo","DistPotere","RigeIncertezza","Mascolinità","Orientamento"]
        elements.forEach(function(key){
            document.getElementById(key).innerText = '-';
        });
    }

    // ----------------------------------------------------------------------
    // altri valori per la pagina risultati
    if(report['prob_errore']){
        if(report['prob_errore']["ProbErroreAdj"] != undefined && report['prob_errore']["ProbErroreAdj"] != "-"){
            document.getElementById("ProbErroreAdj_bar").setAttribute("aria-valuenow", report['prob_errore']["ProbErroreAdj"] * 100);
            document.getElementById("ProbErroreAdj_bar").setAttribute("style","width: "+( report['prob_errore']["ProbErroreAdj"] * 100)+"%");
            document.getElementById("ProbErroreAdj_bar").style.color = '#000000';
            document.getElementById("ProbErroreAdj_bar").innerText = Math.round(report['prob_errore']["ProbErroreAdj"] * 100 * 100) / 100  +"%";
            if(report['prob_errore']["ProbErroreAdj"] <= 0.01){
                document.getElementById("ProbErroreAdj_bar").parentNode.innerText = Math.round(report['prob_errore']["ProbErroreAdj"] * 100 * 100) / 100  +"%";
            }
            
        }else{
            document.getElementById("ProbErroreAdj_bar").setAttribute("aria-valuenow", 0);
            document.getElementById("ProbErroreAdj_bar").setAttribute("style","width: 0%");
            document.getElementById("ProbErroreAdj_bar").parentNode.innerText ="0%";

        }
        if(report['prob_errore']['ProbErroreAdj'] != undefined){
            document.getElementById("ProbErroreAdj_2").innerText = report['prob_errore']['ProbErrore']
            value = report['prob_errore']['ProbErrore']
            let color = value < 0.001 ? green_transp : value > 0.01  ? red_transp  : yellow_transp;
            document.getElementById("ProbErroreAdj_2").style.backgroundColor = color; 
        }
        if(report['prob_errore']['DescrizioneTask']){
            document.getElementById("task_description").innerHTML = report['prob_errore']['DescrizioneTask']
        }


    }else{
        document.getElementById("ProbErroreAdj_bar").setAttribute("aria-valuenow", 0);
        document.getElementById("ProbErroreAdj_bar").setAttribute("style","width: 0%");
        document.getElementById("ProbErroreAdj_bar").parentNode.innerText ="0%"
        document.getElementById("ProbErroreAdj_2").innerText = "-"
    }

    var val = 0
    var change = true

    if(report['barriere_dirette']){
        elements_barriereDirette = ["PrestSicuraCompiti","Adesione","PrestSicuraContesto","Partecipazione" ,"LavoroSquad" ,"Comunicazione"]
        elements_barriereDirette.forEach(function(key){
            if(report['barriere_dirette'][key] == undefined || report['barriere_dirette'][key] == '-' ){
                document.getElementById("average_barriere_dirette").setAttribute("aria-valuenow", 0);
                document.getElementById("average_barriere_dirette").setAttribute("style","width: 0%");
                change = false
            }
            val += parseFloat(report['barriere_dirette'][key])
        })
        if(change){
            average_barriere_dirette = Math.round(val/6*100)/100
            document.getElementById("average_barriere_dirette").setAttribute("aria-valuenow", average_barriere_dirette * 100);
            document.getElementById("average_barriere_dirette").setAttribute("style","width: "+( average_barriere_dirette * 100)+"%");
            document.getElementById("average_barriere_dirette").style.color = '#000000';
            document.getElementById("average_barriere_dirette").innerText = (average_barriere_dirette * 100)+"%";
            if(average_barriere_dirette <= 0.01){
                document.getElementById("average_barriere_dirette").parentNode.innerText = (average_barriere_dirette * 100)+"%";
            }
        }
    }else{
        average_barriere_dirette = 0
        document.getElementById("average_barriere_dirette").setAttribute("aria-valuenow", 0);
        document.getElementById("average_barriere_dirette").setAttribute("style","width: 0%");
        document.getElementById("average_barriere_dirette").parentNode.innerText = "0%";
    }

    val = 0
    change = true

    if(report['barriere_salvaguardia']){
        elements_barriereSalvaguardia = ["CompNonTechSicurezza","CompTechSicurezza","MotivazioneSicurezza","CittadinanzaSicurezza","ValutazioneSicurezza","LeaderHSE","ClimaHSE"]
        elements_barriereSalvaguardia.forEach(function(key){
           
            if(report['barriere_salvaguardia'][key] == undefined || report['barriere_salvaguardia'][key] == '-' ){
                document.getElementById("average_barriere_salvaguardia").setAttribute("aria-valuenow", 0);
                document.getElementById("average_barriere_salvaguardia").setAttribute("style","width: 0%");
                change = false
            }
            val += parseFloat(report['barriere_salvaguardia'][key])
        })
        
        if(change){
            average_barriere_salvaguardia = Math.round(val/7*100)/100
            document.getElementById("average_barriere_salvaguardia").setAttribute("aria-valuenow", average_barriere_salvaguardia * 100);
            document.getElementById("average_barriere_salvaguardia").setAttribute("style","width: "+( average_barriere_salvaguardia * 100)+"%");
            document.getElementById("average_barriere_salvaguardia").style.color = '#000000';
            document.getElementById("average_barriere_salvaguardia").innerText = (average_barriere_salvaguardia * 100)+"%";
            if(average_barriere_salvaguardia <= 0.01){
                document.getElementById("average_barriere_salvaguardia").parentNode.innerText = (average_barriere_salvaguardia * 100)+"%";
            }
        }
    }else{
        average_barriere_salvaguardia = 0
        document.getElementById("average_barriere_salvaguardia").setAttribute("aria-valuenow", 0);
        document.getElementById("average_barriere_salvaguardia").setAttribute("style","width: 0%");
        document.getElementById("average_barriere_salvaguardia").parentNode.innerText ="0%";
    }

    if(average_barriere_salvaguardia + average_barriere_dirette > 0){
        document.getElementById("average_barriere").setAttribute("aria-valuenow", (average_barriere_salvaguardia + average_barriere_dirette)/2 * 100);
        document.getElementById("average_barriere").setAttribute("style","width: "+( (average_barriere_salvaguardia + average_barriere_dirette)/2 * 100)+"%");
        document.getElementById("average_barriere").style.color = '#000000';
        document.getElementById("average_barriere").innerText = Math.round(((average_barriere_salvaguardia + average_barriere_dirette)/2) * 100 * 100) / 100 +"%";
        if((average_barriere_salvaguardia + average_barriere_dirette)/2 <= 0.01){
            document.getElementById("average_barriere").parentNode.innerText = Math.round(((average_barriere_salvaguardia + average_barriere_dirette)/2) * 100 * 100) / 100 +"%";
        }
    }else{
        document.getElementById("average_barriere").setAttribute("aria-valuenow", 0);
        document.getElementById("average_barriere").setAttribute("style","width: 0%");
        document.getElementById("average_barriere").parentNode.innerText = "0%";
    }


    var coeff_bas = -1
    var coeff_bd = -1

    if(average_barriere_dirette >= 0.75){
        coeff_bd = 0.2
    }else if(average_barriere_dirette >= 0.6){
        coeff_bd = 0.6
    }else if(average_barriere_dirette >= 0.3){
        coeff_bd = 1
    }else if(average_barriere_dirette >= 0.15){
        coeff_bd = 1.4
    }else if(average_barriere_dirette >= 0){
        coeff_bd = 1.8
    }

    if(average_barriere_salvaguardia >= 0.75){
        coeff_bas = 0.2
    }else if(average_barriere_salvaguardia >= 0.6){
        coeff_bas = 0.6
    }else if(average_barriere_salvaguardia >= 0.3){
        coeff_bas = 1
    }else if(average_barriere_salvaguardia >= 0.15){
        coeff_bas = 1.4
    }else if(average_barriere_salvaguardia >= 0){
        coeff_bas = 1.8
    }

    
    
    if(report['prob_errore'] && coeff_bas >=0 && coeff_bd >= 0){
        if(report['prob_errore']["TipoTask"] && report['prob_errore']["PSFComposto"]){
            ProbErroreAdj_barriere_valori = (report['prob_errore']["TipoTask"]*report['prob_errore']["PSFComposto"]*coeff_bd*coeff_bas)/(report['prob_errore']["TipoTask"]*(report['prob_errore']["PSFComposto"]*coeff_bd*coeff_bas-1)+1)

            document.getElementById("ProbErroreAdj_barriere_valori").setAttribute("aria-valuenow", ProbErroreAdj_barriere_valori * 100);
            document.getElementById("ProbErroreAdj_barriere_valori").setAttribute("style","width: "+( ProbErroreAdj_barriere_valori * 100)+"%");
            document.getElementById("ProbErroreAdj_barriere_valori").style.color = '#000000';
            document.getElementById("ProbErroreAdj_barriere_valori").innerText = Math.round(ProbErroreAdj_barriere_valori * 100*100)/100+"%";    
            if(ProbErroreAdj_barriere_valori <= 0.01){
                document.getElementById("ProbErroreAdj_barriere_valori").parentNode.innerText = Math.round(ProbErroreAdj_barriere_valori * 100*100) / 100+"%";    

            }

            document.getElementById("ProbErroreAdj_barriere_valori_2").innerText = Math.round(ProbErroreAdj_barriere_valori * 1000000) / 1000000;
            value= ProbErroreAdj_barriere_valori
            colori = [green_transp,yellow_transp,red_transp]
            let i = value < 0.001 ? 0 : value > 0.01  ? 2  : 1;
            document.getElementById("ProbErroreAdj_barriere_valori_2").style.backgroundColor = colori[i]; 
            
            commenti = ["Risultato positivo – da mantenere: almeno un ordine di grandezza inferiore al target","Risultato da attenzionare”: dello stesso ordine di grandezza del target","Risultato da migliorare: almeno un ordine di grandezza superiore al target"]
            document.getElementById("Comment").innerText = commenti[i]
        }else{
            document.getElementById("ProbErroreAdj_barriere_valori").setAttribute("aria-valuenow", 0);
            document.getElementById("ProbErroreAdj_barriere_valori").setAttribute("style","width: 0%"); 
        }

    }else{
        document.getElementById("ProbErroreAdj_barriere_valori").setAttribute("aria-valuenow", 0);
        document.getElementById("ProbErroreAdj_barriere_valori").setAttribute("style","width: 0%");
    }
}

//Update results in interventi page
function updateInterventi_results(report){
    var redTrasparent = getComputedStyle(document.documentElement).getPropertyValue("--red-primary-transparent");
    var red = getComputedStyle(document.documentElement).getPropertyValue("--red-primary");
    const annex = JSON.parse(fs.readFileSync(base_dir + "annex_interventi.json"));

    function interventsCreation(group){
        document.getElementById(group+"_icon").style.display = "Block"

        //Modify the Title
        var el = document.getElementById(group + '_title');             
        el.parentElement.style.backgroundColor = redTrasparent;
        el.style.color = red;
        el.innerHTML = 'Critico  <span data-feather="chevron-down" style="width:10px"></span>';
        //Generate the table elements
        var table = document.getElementById(group + '_table');
        annex[group].forEach(function(dict){
            let row = document.createElement('tr');
            row.scope = "row";
            Object.keys(dict).forEach(function(k){
                let td = document.createElement('td');
                let p = document.createElement('p');
                p.innerText = dict[k];
                td.appendChild(p)
                if(k == "Raccomandazioni" || k == 'Descrizione'){
                    p.classList = "reduced";
                }
                row.appendChild(td);
            });
            table.appendChild(row);                 
        });
    }
    
    function createVCRaccomendation(group, value){

        document.getElementById(group+"_icon").style.display = "Block"
        var el = document.getElementById(group + '_title');           
          
        el.style.color = '#000';
        //Modify the Title
        if(value == 'H'){
            el.innerHTML = 'ALTO  <span data-feather="chevron-down" style="width:10px"></span>';
        }
    
        //Generate the table elements
        var table = document.getElementById(group + '_table');
        annex[group +'_'+ value].forEach(function(dict){
            let row = document.createElement('tr');
            row.scope = "row";
            Object.keys(dict).forEach(function(k){
                let td = document.createElement('td');
                let p = document.createElement('p');
                p.innerText = dict[k];
                td.appendChild(p)
                if(k == "Descrizione"){
                    p.classList = "reduced";
                }
                row.appendChild(td);
            });
            table.appendChild(row);                 
        });
    }
    
    if(report["prob_errore"]){
        if(   report["prob_errore"]["TempoDisponibie"] > 1
        || report["prob_errore"]["StressDaMinaccia"]  > 1
        || report["prob_errore"]["ComplessitàTask"] > 1
        || report["prob_errore"]["ContestoAmbientale"] > 1){
             interventsCreation("PSF_Task");
        }
        if(report["prob_errore"]["Procedure"] > 1
        || report["prob_errore"]["InterazioneUmanoMacchina"]  > 1) {
            interventsCreation("PSF_Tecnico");
        }
    
        if(report["prob_errore"]["Esperienza"] > 1
        || report["prob_errore"]["Affaticamento"]  > 1) 
        {
            interventsCreation("PSF_Lavoratori")
        }
    }

    
    if(report["barriere_dirette"]){
        if(report["barriere_dirette"]["PrestSicuraCompiti"] < 0.5 ||
        report["barriere_dirette"]["Adesione"] < 0.5 ||
        report["barriere_dirette"]["PrestSicuraContesto"] < 0.5 ||
        report["barriere_dirette"]["Partecipazione"] < 0.5 
        )
        {
                interventsCreation("BarriereDiretteIndv");
        }
        
        if(report["barriere_dirette"]["Comunicazione"] < 0.5 || report["barriere_dirette"]["LavoroSquad"] < 0.5){
            interventsCreation("BarriereDiretteTeam");
        }
    }

    if (report["barriere_salvaguardia"]){
        if(report["barriere_salvaguardia"]["CompNonTechSicurezza"] < 0.5){
            interventsCreation("B_SalvaguardiaNonTecn");
        }
    
        if(report["barriere_salvaguardia"]["CompTechSicurezza"] < 0.5){
            interventsCreation("B_SalvaguardiaTecn");
        }
        
        if(report["barriere_salvaguardia"]["MotivazioneSicurezza"] < 0.5){
            interventsCreation("MotivazioneSicurezza");
        }
    
        if(report["barriere_salvaguardia"]["CittadinanzaSicurezza"] < 0.5){
            interventsCreation("CittadinanzaSicurezza");
        }
        
        if(report["barriere_salvaguardia"]["LeaderHSE"] < 0.5){
            interventsCreation("LeaderHSE");
        }
        
        if(report["barriere_salvaguardia"]["ClimaHSE"] < 0.5){
            interventsCreation("ClimaHSE");
        }
        
        if(report["barriere_salvaguardia"]["ValutazioneSicurezza"] < 0.5){
            interventsCreation("ValutazioneSicurezza");
        }
    }

    if(report["valori_culturali"]){
        if(report["valori_culturali"]["Individualismo"] < 0.34){
            createVCRaccomendation("Individualismo", 'L');
        }else{
            createVCRaccomendation("Individualismo", 'H')
        }
    
        if(report["valori_culturali"]["DistPotere"] < 0.34){
            createVCRaccomendation("DistPotere", 'L');
        }else{
            createVCRaccomendation("DistPotere", 'H')
        }
    
        if(report["valori_culturali"]["RigeIncertezza"] < 0.34){
            createVCRaccomendation("RigeIncertezza", 'L');
        }else{
            createVCRaccomendation("RigeIncertezza", 'H')
        }
    
        if(report["valori_culturali"]["Mascolinità"] < 0.34){
            createVCRaccomendation("Mascolinità", 'L');
        }else{
            createVCRaccomendation("Mascolinità", 'H')
        }
    
        if(report["valori_culturali"]["Orientamento"] < 0.34){
            createVCRaccomendation("Orientamento", 'L');
        }else{
            createVCRaccomendation("Orientamento", 'H')
        }
    }

    
}

function toggleIconRotation(id){
    var  el = document.getElementById(id);
    if(el.classList.contains('open')){
        el.classList.remove('open');
    }else{
        el.classList.add('open');
    }
}

//GENERATE THE CHART OF PSF IN RESUTS PAGE
function generateChart_PSF(values){
    const DATA_COUNT = 8;
    const chart_labels = ["Tempo",
                         "Stress da Minaccia",
                         "Complessità",
                         "Esperienza",
                         "Procedure",
                         "Interazione U-M",
                         "Contesto Amb.",
                         "Affaticamento"
                        ];
    var values_list =  [values["TempoDisponibie"],values["StressDaMinaccia"],values["ComplessitàTask"],
                        values["Esperienza"],values["Procedure"],values["InterazioneUmanoMacchina"],
                        values["ContestoAmbientale"],values["Affaticamento"]]; 

    
    //To rescale the values that makes no sense elseway on the graph
    const values_map = {
        0.1   : 0.5  ,
        0.5   : 1,
        1     : 2,
        '1.0' : 2,
        2     : 3,
        5     : 3.3,
        10    : 3.4,
        15    : 3.5,
        20    : 3.6,
        50    : 3.8,
        100   : 4
    } 
    var chart_data = values_list.map(x => values_map[x]);
    var max_value = Math.max(...chart_data);

    //Datasets for the chart
    const data = {
        labels: chart_labels,
        datasets: [
            {
                label: 'Effetto negativo',
                data: [4,4,4,4,4,4,4,4],
                backgroundColor : red_transp,
                borderColor : '#00000000',
                pointRadius : 0,
                order: 5,
                fill : {value: 3},
                hoverRadius : 0,
                hitRadius: 0,
            },
            {   
                label: 'Basso effetto negativo',
                data: [3,3,3,3,3,3,3,3],
                backgroundColor : yellow_transp,
                borderColor :'#00000000',
                pointRadius : 0,
                order: 3,
                fill:{value: 2},
                hoverRadius : 0,
                hitRadius: 0
            },
            {   
                label: 'Effetto positivo o neutro',
                data: [2,2,2,2,2,2,2,2],
                backgroundColor : green_transp,
                borderColor :'#00000000',
                pointRadius : 0,
                order: 2,
                fill: 'origin',
                hoverRadius : 0,
                hitRadius: 0
            },
            {
                label: 'Valore',
                data: chart_data,
                borderColor: '#000',
                backgroundColor: '#a6a6a600',
                pointBackgroundColor: function(context){
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value <= 2 ? green : value <= 3  ? yellow : red;
                }, 
                pointRadius: 4,
                order:1,
            },
            
        ]
    };

    //chart Configuration   
    const plugin_1 = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,    
            scale:{
                stepSize:1,
                min : 0,
                ticks:{
                    beginAtZero: true,
                    max: max_value,
                    stepSize: 1,
                    display: false,
                },
            },
            scales:{
                r:{
                    ticks:{
                        display:false,
                        max: max_value,
                    },
                    pointLabels: {
                        font: {
                          size: size_labels
                        }
                      }
                },
            },
            plugins: {
                title: {
                display: false,
                text: 'PSF'
                },
                legend: {
                    display: true,
                    labels: {
                        filter: function(item, chart) {
                            // Logic to remove a particular legend item goes here
                            return !item.text.includes('Valore');
                        }
                    }
                },
                
                tooltip:{
                    callbacks:{
                        label: function(context){
                            var inverse_values_map = {
                                0.5   : 0.1  ,
                                1     : 0.5  ,
                                2     : 1    ,
                                3     : 2    ,
                                3.3   : 5    ,
                                3.4   : 10   ,
                                3.5   : 15   ,
                                3.6   : 20   ,
                                3.8   : 50   ,
                                4     : 100  
                            } 
                            return 'Valore: ' + inverse_values_map[context.raw];
                        }
                    }
                }        
            }
        },
        plugins: [plugin_1]
      };

    var canvas = document.getElementById("chart_PSF")
    var canvas_expanded = document.getElementById("expanded_chart_PSF");
    new Chart(canvas.getContext("2d"), config);  
    new Chart(canvas_expanded.getContext("2d"), config);
}

//GENERATES THE BAR-CHART FOR THE PSF 
function generateBarChart_PSF(values){
    const DATA_COUNT = 8;
    const chart_labels = ["Tempo",
                         "Stress da Minaccia",
                         "Complessità",
                         "Esperienza",
                         "Procedure",
                         "Interazione U-M",
                         "Contesto Amb.",
                         "Affaticamento"
                        ];

    var values_list =  [values["TempoDisponibie"],values["StressDaMinaccia"],values["ComplessitàTask"],
                        values["Esperienza"],values["Procedure"],values["InterazioneUmanoMacchina"],
                        values["ContestoAmbientale"],values["Affaticamento"]]; 

    
    //To rescale the values that makes no sense elseway on the graph
    const values_map = {
        0.1   : 1    , 
        0.5   : 0.5  ,
        1     : 0    ,
        '1.0' : 0    ,
        2     : -0.3 ,
        5     : -0.5 ,
        10    : -0.75,
        15    : -0.85,
        20    : -0.9 ,
        50    : -0.95,
        100   : -1   
    } 

    var chart_data = values_list.map(x => values_map[x]);
    var max_value = Math.max(...chart_data);

    //Datasets for the chart
    const data = {
        labels: chart_labels,
        datasets: [
            {
                label: 'Valore',
                data: chart_data,
                borderColor: '#00000000',
                backgroundColor: function(context){
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value < -0.3 ? red_transp : value < 0  ? yellow_transp : green_transp;
                },
                order:1,
            },
            
        ]
    };


    //chart Configuration       
    const plugin_a = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            scales:{
                x:{ 
                    grid: {
                        color: function(context) {
                            if (context.tick.value == 0) {
                                return '#e7e7e7';
                            } 
                                return '#00000000';
                          },
                    },                    
                    min : '-1',
                    max : 1,
                    ticks:{
                        display:false
                    },

                },

            },
            barPercentage : .9,
            barThickness : 15,
            minBarLength: 5,
            responsive: true,
            plugins: {
                title: {
                    display: false,
                },
                legend: {
                    display: false,

                },
                tooltip:{
                    callbacks:{
                        label: function(context){
                            var inverse_values_map = {
                            1   : 0.1  ,
                            0.5 : 0.5  ,
                            0   : 1    ,
                            '-0.3': 2    ,
                            '-0.5': 5    ,
                            '-0.75': 10   ,
                            '-0.85': 15   ,
                            '-0.9': 20   ,
                            '-0.95': 50   ,
                            '-1'   : 100  
                            } 
                            return 'Valore: ' + inverse_values_map[context.raw];
                        }
                    }
                }
            }
        },
        plugins: [plugin_a]
    };

    var canvas = document.getElementById("chart_PSF_Bar");
    new Chart(canvas.getContext("2d"), config);  
}

//GENERATE THE CHART OF BARRIERE_DIRETTE IN RESUTS PAGE
function generateChart_Barriere_dirette(values){
    const DATA_COUNT = 8;
    const chart_labels = [["Prestazione sicura", "rispetto ai compiti"],
                         ["Adesione alle norme o","procedure di sicurezza "],
                         ["Prestazione sicura", "orientata al contesto"],
                         ["Partecipazione attiva", "alla sicurezza"],
                         "Lavoro di squadra",
                         ["Comunicazione inerente", "la sicurezza"]
                        ];

    var values_list =  [values["PrestSicuraCompiti"],
                        values["Adesione"],
                        values["PrestSicuraContesto"],
                        values["Partecipazione"],
                        values["LavoroSquad"],
                        values["Comunicazione"]]; 

    
    //Here we don't need to rescale because the values are already normalized
    var max_value = Math.max(...values_list);

    //Datasets for the chart
    const data = {
        labels: chart_labels,
        datasets: [
            {   
                label: 'Barriera non efficace',
                data: [0.5,0.5,0.5,0.5,0.5,0.5],
                backgroundColor : red_transp,
                borderColor : '#00000000',
                fill:'origin',
                order:2,
                pointRadius : 0,
                hoverRadius : 0,
                hitRadius: 0,
                
            },
            {   
                label: 'Barriera moderatamente efficace',
                data: [0.7,0.7,0.7,0.7,0.7,0.7],
                backgroundColor : yellow_transp,
                fill:{value:0.5},
                order:4,
                borderColor : '#00000000',
                pointRadius : 0,
                hoverRadius : 0,
                hitRadius: 0
            },
            {   
                label: "Barriera efficace",
                data: [1,1,1,1,1,1],
                backgroundColor : green_transp,
                borderColor :  '#00000000',
                pointRadius : 0,
                fill:{value:0.7},
                order:5,
                hoverRadius : 0,
                hitRadius: 0
            },            
            {
                label: 'Valore',
                data: values_list,
                borderColor: '#000',
                backgroundColor: '#a6a6a600',
                pointBackgroundColor: function(context){
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value <= 0.5 ? red_transp : value <= 0.7 ? yellow_transp :green_transp;
                }, 
                pointRadius: 4,
                order:1,
            },
            
        ]
    };

    //chart Configuration  

    const plugin_2 = {
        id: 'custom_canvas_background_color_2',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,    
            scale:{
                stepSize: 0.1,
                min : 0,
                max: 1,
                ticks:{
                    beginAtZero: true,
                    stepSize: 0.1,
                },
            },
            scales:{
                r:{
                    ticks:{
                        display:false,
                    },
                    pointLabels: {
                        font: {
                          size: size_labels
                        }
                      }
                },
            },
            plugins: {
                title: {
                display: false,
                text: 'Barriere Dirette'
                },
                legend: {
                    display: true,
                    labels: {
                        filter: function(item, chart) {
                            // Logic to remove a particular legend item goes here
                            return !item.text.includes('Valore');
                        }
                    }
                },            
            }   
        },
        plugins: [plugin_2]
      };
    
    var canvas = document.getElementById("chart_barriere_dirette")
    var canvas_expanded = document.getElementById("expanded_chart_barriere_dirette");
    new Chart(canvas.getContext("2d"), config);  
    new Chart(canvas_expanded.getContext("2d"), config); 
}

//GENERATES THE BAR-CHART FOR THE "BARRIRE DIRETTE" 
function generateBarChart_BD(values){
    const DATA_COUNT = 8;
    const chart_labels = [["Prestazione sicura", "rispetto ai compiti"],
                         ["Adesione alle norme o","procedure di sicurezza "],
                         ["Prestazione sicura", "orientata al contesto"],
                         ["Partecipazione attiva", "alla sicurezza"],
                         "Lavoro di squadra",
                         ["Comunicazione inerente", "la sicurezza"]
                        ];

    var values_list =  [values["PrestSicuraCompiti"],
                        values["Adesione"],
                        values["PrestSicuraContesto"],
                        values["Partecipazione"],
                        values["LavoroSquad"],
                        values["Comunicazione"]]; 


    var max_value = Math.max(...values_list);

    //Datasets for the chart
    const data = {
        labels: chart_labels,
        datasets: [
            {
                label: 'Valore',
                data: values_list,
                borderColor:'#00000000',
                backgroundColor: function(context){
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value <= 0.5 ? red_transp : value <= 0.7  ? yellow_transp : green_transp;
                },
                order:1,
            },
            
        ]
    };


    //chart Configuration       
    const plugin_b = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            scales:{
                x:{ 
                    grid: {
                        color: function(context) {
                            if (context.tick.value == 0.7) {
                              return '#e7e7e7';
                            } 
                            return '#00000000';
                          },
                        
                    },                    
                    min : 0,
                    max: 1,
                    ticks:{
                        stepSize : 0.7,
                        display:false,
                    },
                },
            },
            base : 0.7,
            barPercentage : .9,
            barThickness : 15,
            minBarLength: 5,
            responsive: true,
            plugins: {
                title: {
                    display: false,
                },
                legend: {
                    display: false,
                },
            }
        },
        plugins: [plugin_b]
    };

    var canvas = document.getElementById("chart_BD_Bar");
    new Chart(canvas.getContext("2d"), config);  
}

//GENERATE THE CHART OF BARREIRE_SALVAGUARDIA IN RESUTS PAGE
function generateChart_Barriere_Salvaguardia(values){
    const DATA_COUNT = 8;

    const chart_labels = [["Competenze non-tecniche", "di sicurezza"],
                         ["Competenze tecniche","di sicurezza"],
                         ["Motivazione alla ", "sicurezza"],
                         ["Cittadinanza organizzativa ", "di sicurezza"],
                         ["Valutazione e sviluppo","delle competenze per la sicurezza"],
                         "Leadership per l'HSE",
                         "Clima e cultura di HSE"
                        ];

    var values_list =  [values["CompNonTechSicurezza"],
                        values["CompTechSicurezza"],
                        values["MotivazioneSicurezza"],
                        values["CittadinanzaSicurezza"],
                        values["ValutazioneSicurezza"],
                        values["LeaderHSE"],
                        values["ClimaHSE"]]; 

    
    //Here we don't need to rescale because the values are already normalized
    var max_value = Math.max(...values_list);

    //Datasets for the chart
    const data = {
        labels: chart_labels,
        datasets: [
            {   
                label: 'Barriera non efficace',
                data: [0.5,0.5,0.5,0.5,0.5,0.5,0.5],
                backgroundColor : red_transp,
                borderColor : '#00000000',
                fill:'origin',
                order:2,
                pointRadius : 0,
                hoverRadius : 0,
                hitRadius: 0,
                
            },
            {   
                label: 'Barriera moderatamente efficace',
                data: [0.7,0.7,0.7,0.7,0.7,0.7,0.7],
                backgroundColor : yellow_transp,
                fill:{value:0.5},
                order:4,
                borderColor : '#00000000',
                pointRadius : 0,
                hoverRadius : 0,
                hitRadius: 0
            },
            {   
                label: 'Barriera efficace',
                data: [1,1,1,1,1,1,1],
                backgroundColor : green_transp,
                borderColor :  '#00000000',
                pointRadius : 0,
                fill:{value:0.7},
                order:5,
                hoverRadius : 0,
                hitRadius: 0
            },
            {
                label: 'Valore',
                data: values_list,
                borderColor: '#000',
                backgroundColor: '#a6a6a600',
                pointBackgroundColor: function(context){
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value <= 0.5 ? red_transp : value <= 0.7 ? yellow_transp :green_transp;
                }, 
                pointRadius: 4,
                order:1,
            },
            
        ]
    };

    //chart Configuration 
    const plugin_3 = {
        id: 'custom_canvas_background_color_3',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,    
            scale:{
                stepSize: 0.1,
                min : 0,
                max: 1,
                ticks:{
                    beginAtZero: true,
                    stepSize: 0.1,
                },
            },
            scales:{
                r:{
                    ticks:{
                        display:false,
                    },
                    pointLabels: {
                        font: {
                          size: size_labels
                        }
                      }
                },
            },
            plugins: {
                title: {
                display: false,
                text: 'Barriere Salvaguardia'
                },
                legend: {
                    display: true,
                    labels: {
                        filter: function(item, chart) {
                            // Logic to remove a particular legend item goes here
                            return !item.text.includes('Valore');
                        }
                    }
                },            
            }   
        },
        plugins: [plugin_3]
      };
    
    var canvas = document.getElementById("chart_barriere_salvaguardia")
    var canvas_expanded = document.getElementById("expanded_chart_barriere_salvaguardia");
    new Chart(canvas.getContext("2d"), config);  
    new Chart(canvas_expanded.getContext("2d"), config);   
}

//GENERATES THE BAR-CHART FOR THE "BARRIRE DIRETTE" 
function generateBarChart_BS(values){
    const DATA_COUNT = 8;

    const chart_labels = [["Competenze non-tecniche", "di sicurezza"],
                         ["Competenze tecniche","di sicurezza"],
                         ["Motivazione alla ", "sicurezza"],
                         ["Cittadinanza organizzativa ", "di sicurezza"],
                         ["Valutazione e sviluppo","delle competenze per la sicurezza"],
                         "Leadership per l'HSE",
                         "Clima e cultura di HSE"
                        ];

    var values_list =  [values["CompNonTechSicurezza"],
                        values["CompTechSicurezza"],
                        values["MotivazioneSicurezza"],
                        values["CittadinanzaSicurezza"],
                        values["ValutazioneSicurezza"],
                        values["LeaderHSE"],
                        values["ClimaHSE"]]; 


    //To rescale the values that makes no sense elseway on the graph
  
    var max_value = Math.max(...values_list);

    //Datasets for the chart
    const data = {
        labels: chart_labels,
        datasets: [
            {
                label: 'Valore',
                data: values_list,
                borderColor:'#00000000',
                backgroundColor: function(context){
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value <= 0.5 ? red_transp : value <= 0.7  ? yellow_transp : green_transp;
                },
                order:1,
            },
            
        ]
    };


    //chart Configuration       
    const plugin_c = {
        id: 'custom_canvas_background_color',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };
    const config = {
        type: 'bar',
        data: data,
        options: {
            indexAxis: 'y',
            scales:{
                x:{ 
                    grid: {
                        color: function(context) {
                            if (context.tick.value == 0.7) {
                              return '#e7e7e7';
                            } 
                            return '#00000000';
                          },
                    },                    
                    min : 0,
                    max: 1,
                    ticks:{
                        stepSize: 0.7,
                        display:false,
                    },
                },
            },
            base: 0.7,
            barPercentage : .9,
            barThickness : 15,
            minBarLength: 5,
            responsive: true,
            plugins: {
                title: {
                    display: false,
                },
                legend: {
                    display: false,
                },
            }
        },
        plugins: [plugin_c]
    };

    var canvas = document.getElementById("chart_BS_Bar");
    new Chart(canvas.getContext("2d"), config);  
}

//GENERATE CHART OF VALORI_CULTURALI IN RESULTS PAGE
function generateChart_Valori_Culturali(values){
    const DATA_COUNT = 8;

    const chart_labels = ["Individualismo",
                         "Distanza del potere",
                         "Rigetto all'incertezza",
                         "Mascolinità",
                         ["Orientamento", "a breve termine"]
                        ];

    var values_list =  [values["Individualismo"],
                        values["DistPotere"],
                        values["RigeIncertezza"],
                        values["Mascolinità"],
                        values["Orientamento"]]; 

    
    //Here we don't need to rescale because the values are already normalized
    var max_value = Math.max(...values_list);

    //Datasets for the chart
    const data = {
        labels: chart_labels,
        datasets: [
            {
                label: 'Valore',
                data: values_list,
                borderColor: '#00000000',
                pointBackgroundColor : '#a6a6a6a0',
                pointBorderColor: '#000',
                backgroundColor: '#a6a6a600', 
                pointRadius: 10,
                order:1,
            },
            
        ]
    };

    //chart Configuration  
    const plugin_4 = {
        id: 'custom_canvas_background_color_4',
        beforeDraw: (chart) => {
            const ctx = chart.canvas.getContext('2d');
            ctx.save();
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
        }
    };

    
    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,    
            scale:{
                stepSize: 0.33,
                min : -0.2,
                max: 1,
            },
            scales:{
                r:{
                    ticks:{
                        display:true,
                        callback: function(value, index, values) {
                            if(value == 1) return 'VH';
                            if(value <= 0) return 'VL';
                            return '';
                        },
                        beginAtZero : true,
                        font : {
                            showZero: true,
                            size: 20,
                        }
                    },
                    pointLabels: {
                        font: {
                          size: size_labels
                        }
                      }
                },
            },
            plugins: {
                title: {
                display: false,
                text: 'Valori Culturali'
                },
                legend: {
                    display: false,
                },         
            }   
        },
        plugins: [plugin_4]
      };
    
    var canvas = document.getElementById("chart_valori_culturali")
    var canvas_expanded = document.getElementById("expanded_chart_valori_culturali");
    new Chart(canvas.getContext("2d"), config);  
    new Chart(canvas_expanded.getContext("2d"), config);    
}



function saveChart(canvas_id){
    var canvas = document.getElementById(canvas_id)
    var a = document.createElement('a');
    var context = canvas.getContext("2d");
    context.save();
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();

    var image = Chart.getChart(canvas_id).toBase64Image();
    a.href = image;
    a.download = canvas_id + '.png';
    a.click()
}
