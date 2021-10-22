
const green_transp = '#33CC3380';
const green = '#33CC33';
const yellow_transp = '#FFFF3380';
const yellow = '#FFFF33';
const orange_transp = '#ffae0080';
const orange = '#ffae00';
const red_transp = '#FF333380';
const red = '#FF3333';


const { contentTracing } = require("electron");

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
            console.log(key)
            Cluster1 = Cluster1 * data[key] ;
    }});
    console.log("----------")
    elements_PSF.slice(4, 6).forEach(function(key){
        if(data[key] != null && data[key] != "-"){
            console.log(key)
            Cluster2 = Cluster2 * data[key] ;
    }});
    console.log("----------")
    elements_PSF.slice(6, 8).forEach(function(key){
        if(data[key] != null && data[key] != "-"){
            console.log(key)
            Cluster3 = Cluster3 * data[key] ;
    }});

    tipotask = data["TipoTask"] 

    if(tipotask != null){
        ProbErrore = PSFComposto * tipotask;

        ProbErroreAdj = ProbErrore/(tipotask*(PSFComposto-1)+1);

        document.getElementById("PSFComposto").innerText = Math.round(PSFComposto * 100) / 100;
        updateJSON("PSFComposto", Math.round(PSFComposto * 100) / 100);

        document.getElementById("ProbErrore").innerText = Math.round(ProbErrore * 100) / 100;
        updateJSON("ProbErrore",Math.round(ProbErrore * 100) / 100);

        document.getElementById("ProbErroreAdj").innerText = Math.round(ProbErroreAdj * 100) / 100 + "%";
        updateJSON("ProbErroreAdj",Math.round(ProbErroreAdj * 100) / 100 + "%");
    
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
        }   
        document.getElementById(elements[i - 1]).innerText = val
        document.getElementById(elements[i - 1] + "_1").innerText =  val
        updateJSON(elements[i - 1],  val);
        total_val = total_val + val
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
            console.log("barriere_salvaguardia_"+i+"_" + j +': ', data["barriere_salvaguardia_"+i+"_" + j])
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
            val = Math.round(val / count * 10000) / 10000;
        }   
        document.getElementById(elements[i - 1]).innerText = val
        document.getElementById(elements[i - 1] + "_1").innerText =  val
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
            console.log("valori_culturali_"+i+"_" + j +':', data["valori_culturali_"+i+"_" + j])
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
            val = Math.round(val / count * 10000) / 10000;
        }   
        

        document.getElementById(elements[i - 1]).innerText = val
        document.getElementById(elements[i - 1] + "_1").innerText =  val
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
                
                let color = value <= 1 ? green_transp : value <= 2  ? yellow_transp : value <= 5 ? orange_transp : red_transp;
                document.getElementById(key).parentNode.style.backgroundColor = color; 
            }
            else{
                document.getElementById(key).innerText = '-';
            }
        })
        generateChart_PSF(report["prob_errore"]);

        other_elements = ["Cluster1", "Cluster2", "Cluster3","ProbErroreAdj"]
        
        other_elements.forEach(function(key){
            console.log(report['prob_errore'][key])
            if(report['prob_errore'][key]){
                document.getElementById(key).innerText = report['prob_errore'][key]
            }else{
                document.getElementById(key).innerText = "-"
            }
        })
        
    }else{
        generateChart_PSF({});
        elements_PSF = ["TempoDisponibie","StressDaMinaccia","ComplessitàTask","Esperienza" ,"Procedure" ,"InterazioneUmanoMacchina","ContestoAmbientale","Affaticamento", "Cluster1", "Cluster2", "Cluster3","ProbErroreAdj"]
        elements_PSF.forEach(function(key){
            document.getElementById(key).innerText = '-';
        });
    }

    if(report['barriere_dirette']){
        //First table of Barriere Dirette
        elements_barriereDirette = ["PrestSicuraCompiti","Adesione","PrestSicuraContesto","Partecipazione" ,"LavoroSquad" ,"Comunicazione"]
        elements_barriereDirette.forEach(function(key){
            if(report['barriere_dirette'][key] != null){
                let value = report['barriere_dirette'][key];
                document.getElementById(key).innerText = Math.round(value*100)/100;
                let color = value < 0.2 ? red_transp : value < 0.4 ? orange_transp : value < 0.7 ? yellow_transp :green_transp;
                document.getElementById(key).parentNode.style.backgroundColor = color; 
            }
            else{
                document.getElementById(key).innerText = '-';
            }
        })
        generateChart_Barriere_dirette(report["barriere_dirette"]);

        
    }else{
        generateChart_Barriere_dirette({});
        elements_barriereDirette = ["PrestSicuraCompiti","Adesione","PrestSicuraContesto","Partecipazione" ,"LavoroSquad" ,"Comunicazione"]
        elements_barriereDirette.forEach(function(key){
            document.getElementById(key).innerText = '-';
        });
    }

    if(report['barriere_salvaguardia']){
        //First table of Barriere Dirette
        elements_barriereSalvaguardia = ["CompNonTechSicurezza","CompTechSicurezza","MotivazioneSicurezza","CittadinanzaSicurezza","ValutazioneSicurezza","LeaderHSE","ClimaHSE"]
        elements_barriereSalvaguardia.forEach(function(key){
            if(report['barriere_salvaguardia'][key] != null){
                let value = report['barriere_salvaguardia'][key];
                document.getElementById(key).innerText = Math.round(value*100)/100;
                let color = value < 0.2 ? red_transp : value < 0.4 ? orange_transp : value < 0.7 ? yellow_transp :green_transp;
                document.getElementById(key).parentNode.style.backgroundColor = color; 
            }
            else{
                document.getElementById(key).innerText = '-';
            }
        })
        generateChart_Barriere_Salvaguardia(report["barriere_salvaguardia"]);
    }else{
        generateChart_Barriere_Salvaguardia({});
        elements_barriereSalvaguardia = ["CompNonTechSicurezza","CompTechSicurezza","MotivazioneSicurezza","CittadinanzaSicurezza","ValutazioneSicurezza","LeaderHSE","ClimaHSE"]
        elements_barriereSalvaguardia.forEach(function(key){
            document.getElementById(key).innerText = '-';
        });
    }

    if(report['valori_culturali']){
        //First table of Barriere Dirette
        elements = ["Individualismo","DistPotere","RigeIncertezza","Mascolinità","Orientamento"]
        elements.forEach(function(key){
            if(report['valori_culturali'][key] != null){
                let value = report['valori_culturali'][key];
                document.getElementById(key).innerText = Math.round(value*100)/100;
            }
            else{
                document.getElementById(key).innerText = '-';
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

    // altri valori per la pagina risultati

    var val = 0
    var change = true

    if(report['barriere_dirette']){
        elements_barriereDirette = ["PrestSicuraCompiti","Adesione","PrestSicuraContesto","Partecipazione" ,"LavoroSquad" ,"Comunicazione"]
        elements_barriereDirette.forEach(function(key){
            if(report['barriere_dirette'][key] == undefined || report['barriere_dirette'][key] == '-' ){
                document.getElementById("average_barriere_dirette").innerText = '-'
                change = false
            }
            val += report['barriere_dirette'][key]
        })
        if(change){
            average_barriere_dirette = Math.round(val/6*100)/100
            document.getElementById("average_barriere_dirette").innerText = average_barriere_dirette + "%";
        }
    }else{
        average_barriere_dirette = 0
        document.getElementById("average_barriere_dirette").innerText = '-'
    }

    val = 0
    change = true

    if(report['barriere_salvaguardia']){
        elements_barriereSalvaguardia = ["CompNonTechSicurezza","CompTechSicurezza","MotivazioneSicurezza","CittadinanzaSicurezza","ValutazioneSicurezza","LeaderHSE","ClimaHSE"]
        elements_barriereSalvaguardia.forEach(function(key){
           
            if(report['barriere_salvaguardia'][key] == undefined || report['barriere_salvaguardia'][key] == '-' ){
                
                document.getElementById("average_barriere_salvaguardia").innerText = '-'
                change = false
            }
            val += report['barriere_salvaguardia'][key]
        })
        
        if(change){
            average_barriere_salvaguardia = Math.round(val/7*100)/100
            document.getElementById("average_barriere_salvaguardia").innerText = average_barriere_salvaguardia + "%";
        }
    }else{
        average_barriere_salvaguardia = 0
        document.getElementById("average_barriere_salvaguardia").innerText = '-'
    }

    if(average_barriere_salvaguardia + average_barriere_dirette > 0){
        document.getElementById("average_barriere").innerText = Math.round((average_barriere_salvaguardia + average_barriere_dirette)/2*100)/100 + "%"
    }else{
        document.getElementById("average_barriere").innerText = '-'
    }




}

//Update results in interventi page
function updateInterventi_results(report){
    var redTrasparent = getComputedStyle(document.documentElement).getPropertyValue("--red-primary-transparent");
    var red = getComputedStyle(document.documentElement).getPropertyValue("--red-primary");
    const annex = JSON.parse(fs.readFileSync("./scripts/annex_interventi.json"));

    var collapseFunction = function(p, a){
        return function (){
            if(p.classList.contains("collapse")){
                p.classList.remove("collapse");
                p.classList.add("notCollapsed")
                a.classList.remove("collapsed")                
            }else{
                p.classList.add("collapse");
                p.classList.remove("notCollapsed")
                a.classList.add("collapsed")      
            }  
        }
    }

    function interventsCreation(group){
        //Modify the Title
        var el = document.getElementById(group + '_title');             
        el.parentElement.style.backgroundColor = redTrasparent;
        el.style.color = red;
        el.innerText = "Critico";
        //Generate the table elements
        var table = document.getElementById(group + '_table');
        var row_number = 1
        annex[group].forEach(function(dict){
            let row = document.createElement('tr');
            row.scope = "row";
            Object.keys(dict).forEach(function(k){
                let td = document.createElement('td');
                let p = document.createElement('p');
                p.innerText = dict[k];
                td.appendChild(p)
                if(k == "Raccomandazioni" || k == 'Descrizione'){
                    td.classList = "collapsable"
                    p.classList = "reduced";
                    p.id = group + row_number + k; 
                }
                row.appendChild(td);
            });
            table.appendChild(row); 
            row_number += 1;                
        });
    }
    
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
    || report["prob_errore"]["Affaticamento"]  > 1) {
        interventsCreation("PSF_Lavoratori")
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
        0.1   : 1,
        0.5   : 2,
        1     : 3,
        '1.0' : 3,
        2     : 4,
        5     : 5,
        10    : 6,
        15    : 7,
        20    : 8,
        50    : 9,
        100   : 10
    } 
    var chart_data = values_list.map(x => values_map[x]);
    var max_value = Math.max(...chart_data);

    //Datasets for the chart
    const data = {
        labels: chart_labels,
        datasets: [
            {
                lable: 'red',
                data: [10,10,10,10,10,10,10,10],
                backgroundColor : red_transp,
                borderColor : red,
                pointRadius : 0,
                order: 5,
                fill : {value: 5},
                hoverRadius : 0,
                hitRadius: 0,
            },
            {   //FF333330
                lable: 'orange',
                data: [5,5,5,5,5,5,5,5],
                backgroundColor : orange_transp,
                borderColor :orange_transp,
                pointRadius : 0,
                order: 4,
                fill :{value: 4},
                hoverRadius : 0,
                hitRadius: 0,
                
            },
            {   
                label: 'yellow',
                data: [4,4,4,4,4,4,4,4],
                backgroundColor : yellow_transp,
                borderColor :yellow_transp,
                pointRadius : 0,
                order: 3,
                fill:{value: 3},
                hoverRadius : 0,
                hitRadius: 0
            },
            {   
                label: 'green',
                data: [3,3,3,3,3,3,3,3],
                backgroundColor : green_transp,
                borderColor :green,
                pointRadius : 0,
                order: 2,
                fill:'origin',
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
                    return value <= 3 ? green : value <= 4  ? yellow : value <= 5 ? orange :red;
                }, 
                pointRadius: 4,
                order:1,
            },
            
        ]
    };

    //Remvoes useless levels
    if(max_value <= 7){
      data.datasets.splice(0, 1)
      if(max_value  <= 5){
        data.datasets.splice(0, 1)
      }
    }

    //chart Configuration    
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
                    min: 0,
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
                },
            },
            plugins: {
                title: {
                display: false,
                text: 'PSF'
                },
                legend: {
                    display: false
                },
                tooltip:{
                    callbacks:{
                        label: function(context){
                            var inverse_values_map = {
                                1 : 0.1  ,
                                2 : 0.5  ,
                                3 : 1    ,
                                4 : 2    ,
                                5 : 5    ,
                                6 : 10   ,
                                7 : 15   ,
                                8 : 20   ,
                                9 : 50   ,
                                10 : 100  
                            } 
                            return 'Valore: ' + inverse_values_map[context.raw];
                        }
                    }
                },            
            }   
        },
      };
    
    var canvas = document.getElementById("chart_PSF")
    var PSF_chart = new Chart(canvas.getContext("2d"), config);  
    canvas.addEventListener('click', function() {
        //Apply white background
        var a = document.createElement('a');
        var context = canvas.getContext("2d");
        context.save();
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();

        var image = PSF_chart.toBase64Image();
        a.href = image;
        a.download = 'PSF_chart.png';
        a.click()
     }, false);
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
                lable: 'red',
                data: [0.2,0.2,0.2,0.2,0.2,0.2],
                backgroundColor : red_transp,
                borderColor :red,
                fill:'origin',
                order:2,
                pointRadius : 0,
                hoverRadius : 0,
                hitRadius: 0,
                
            },
            {   
                label: 'orange',
                data: [0.4,0.4,0.4,0.4,0.4,0.4],
                backgroundColor : orange_transp,
                borderColor :orange,
                fill:{value:0.2},
                order:3,
                pointRadius : 0,
                hoverRadius : 0,
                hitRadius: 0
            },
            {   
                label: 'yellow',
                data: [0.7,0.7,0.7,0.7,0.7,0.7],
                backgroundColor : yellow_transp,
                fill:{value:0.4},
                order:4,
                borderColor :yellow,
                pointRadius : 0,
                hoverRadius : 0,
                hitRadius: 0
            },
            {   
                data: [1,1,1,1,1,1],
                backgroundColor : green_transp,
                borderColor : green,
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
                    return value < 0.2 ? red_transp : value < 0.4 ? orange_transp : value < 0.7 ? yellow_transp :green_transp;
                }, 
                pointRadius: 4,
                order:1,
            },
            
        ]
    };

    //chart Configuration    
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
                },
            },
            plugins: {
                title: {
                display: false,
                text: 'Barriere Dirette'
                },
                legend: {
                    display: false
                },            
            }   
        },
      };
    
    var canvas = document.getElementById("chart_barriere_dirette")
    var PSF_chart = new Chart(canvas.getContext("2d"), config);  
    canvas.addEventListener('click', function() {
        //Apply white background
        var a = document.createElement('a');
        var context = canvas.getContext("2d");
        context.save();
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();

        var image = PSF_chart.toBase64Image();
        a.href = image;
        a.download = 'chart_barriere_dirette.png';
        a.click()
     }, false);
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
                lable: 'red',
                data: [0.2,0.2,0.2,0.2,0.2,0.2,0.2],
                backgroundColor : red_transp,
                borderColor :red,
                fill:'origin',
                order:2,
                pointRadius : 0,
                hoverRadius : 0,
                hitRadius: 0,
                
            },
            {   
                label: 'orange',
                data: [0.4,0.4,0.4,0.4,0.4,0.4,0.4],
                backgroundColor : orange_transp,
                borderColor :orange,
                fill:{value:0.2},
                order:3,
                pointRadius : 0,
                hoverRadius : 0,
                hitRadius: 0
            },
            {   
                label: 'yellow',
                data: [0.7,0.7,0.7,0.7,0.7,0.7,0.7],
                backgroundColor : yellow_transp,
                fill:{value:0.4},
                order:4,
                borderColor :yellow,
                pointRadius : 0,
                hoverRadius : 0,
                hitRadius: 0
            },
            {   
                data: [1,1,1,1,1,1,1],
                backgroundColor : green_transp,
                borderColor : green,
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
                    return value < 0.2 ? red_transp : value < 0.4 ? orange_transp : value < 0.7 ? yellow_transp :green_transp;
                }, 
                pointRadius: 4,
                order:1,
            },
            
        ]
    };

    //chart Configuration    
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
                },
            },
            plugins: {
                title: {
                display: false,
                text: 'Barriere Salvaguardia'
                },
                legend: {
                    display: false
                },            
            }   
        },
      };
    
    var canvas = document.getElementById("chart_barriere_salvaguardia")
    var PSF_chart = new Chart(canvas.getContext("2d"), config);  
    canvas.addEventListener('click', function() {
        //Apply white background
        var a = document.createElement('a');
        var context = canvas.getContext("2d");
        context.save();
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();

        var image = PSF_chart.toBase64Image();
        a.href = image;
        a.download = 'chart_barriere_salvaguardia.png';
        a.click()
     }, false);
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
                borderColor: '#000',
                backgroundColor: '#a6a6a620', 
                pointRadius: 4,
                order:1,
            },
            
        ]
    };

    //chart Configuration    
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
                    
                },
            },
            scales:{
                r:{
                    ticks:{
                        display:true,
                        callback: function(value, index, values) {
                            if(value == 0.9) return 'H';
                            if(value == 0.1) return 'L';
                            return '';
                        },
                        font : {
                            size: 20,
                        }
                    },
                },
            },
            plugins: {
                title: {
                display: false,
                text: 'Valori Culturali'
                },
                legend: {
                    display: false
                },            
            }   
        },
      };
    
    var canvas = document.getElementById("chart_valori_culturali")
    var PSF_chart = new Chart(canvas.getContext("2d"), config);  
    canvas.addEventListener('click', function() {
        //Apply white background
        var a = document.createElement('a');
        var context = canvas.getContext("2d");
        context.save();
        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#FFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();

        var image = PSF_chart.toBase64Image();
        a.href = image;
        a.download = 'chart_barriere_salvaguardia.png';
        a.click()
     }, false);
}

