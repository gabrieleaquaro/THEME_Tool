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

function snackbarShow(color = "#5cd65c", text = "Nuovo report creato e pronto per la modifica!"){
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

        case 'risultati':
            updateRisultati_results(report);
            break;

        default:
          break;
      }
      
}

//Update della tabella a fie di Prob Errore
function updateProbError_results(data){

    elements_PSF = ["TempoDisponibie","StressDaMinaccia","ComplessitàTask","Esperienza" ,"Procedure" ,"InterazioneUmanoMacchina","ContestoAmbientale","Affaticamento"]

    var PSFComposto = 1

    elements_PSF.forEach(function(key){
        if(data[key] != null && data[key] != "-"){
            PSFComposto = PSFComposto * data[key] ;
    }});

    tipotask = data["TipoTask"] 
    if(tipotask != null){
      ProbErrore = PSFComposto * tipotask;

      ProbErroreAdj = ProbErrore/(tipotask*(PSFComposto-1)+1);

      document.getElementById("PSFComposto").innerText = Math.round(PSFComposto * 10000) / 10000;
      updateJSON("PSFComposto",PSFComposto);

      document.getElementById("ProbErrore").innerText = Math.round(ProbErrore * 10000) / 10000;
      updateJSON("ProbErrore",ProbErrore);

      document.getElementById("ProbErroreAdj").innerText = Math.round(ProbErroreAdj * 100*100) / 100 + "%";
      updateJSON("ProbErroreAdj",ProbErroreAdj);
    }
}


//Update dei risultati in results page
function updateRisultati_results(report){
    if(report['prob_errore']){
        //First table of PSF
        elements_PSF = ["TempoDisponibie","StressDaMinaccia","ComplessitàTask","Esperienza" ,"Procedure" ,"InterazioneUmanoMacchina","ContestoAmbientale","Affaticamento"]
        elements_PSF.forEach(function(key){
            if(report['prob_errore'][key] != null){
                document.getElementById(key).innerText = report['prob_errore'][key];
            }
            else{
                document.getElementById(key).innerText = '-';
            }
        })
        generateChart_PSF(report["prob_errore"]);
    }
    else{
        generateChart_PSF({});
        elements_PSF = ["TempoDisponibie","StressDaMinaccia","ComplessitàTask","Esperienza" ,"Procedure" ,"InterazioneUmanoMacchina","ContestoAmbientale","Affaticamento"]
        elements_PSF.forEach(function(key){
            document.getElementById(key).innerText = '-';
        });
    }
}

//GENERATE THE CHART OF PSF IN RESUTS PAGE
function generateChart_PSF(values){
    const DATA_COUNT = 8;
    const chart_labels = ["Tempo",
                         "Pericolosità ",
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
        1     : 2,
        '1.0' : 2,
        2     : 3,
        5     : 4,
        10    : 5,
        15    : 6,
        20    : 7,
        50    : 8,
        100   : 9
    } 
    var chart_data = values_list.map(x => values_map[x]);
    var max_value = Math.max(...chart_data);

    //Datasets for the chart
    const data = {
        labels: chart_labels,
        datasets: [
            {   
                lable: 'red',
                data: [8,8,8,8,8,8,8,8],
                backgroundColor : '#FFFFFF00',
                borderColor :'#FF3333',
                pointRadius : 0,
                order: 5,
                hoverRadius : 0,
                hitRadius: 0,
                
            },
            {   
                label: 'orange',
                data: [6,6,6,6,6,6,6,6],
                backgroundColor : '#FFFFFF00',
                borderColor :'#ffae00',
                pointRadius : 0,
                order: 4,
                hoverRadius : 0,
                hitRadius: 0
            },
            {   
                label: 'yellow',
                data: [4,4,4,4,4,4,4,4],
                backgroundColor : '#FFFFFF00',
                borderColor :'#FFFF33',
                pointRadius : 0,
                order: 3,
                hoverRadius : 0,
                hitRadius: 0
            },
            {   
                data: [2,2,2,2,2,2,2,2],
                backgroundColor : '#FFFFFF00',
                borderColor :'#33CC33',
                pointRadius : 0,
                order:2,
                hoverRadius : 0,
                hitRadius: 0
            },
            {
                label: 'Valore',
                data: chart_data,
                borderColor: '#000',
                backgroundColor: '#a6a6a660',
                pointBackgroundColor: function(context){
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value <= 2 ? '#33CC33' : value <= 4 ? '#FFFF33' : value <= 6 ? '#ffae00' :'#FF3333';
                }, 
                pointRadius: 4,
                order:1,
            },
            
        ]
    };

    //Remvoes useless levels
    if(max_value <= 6){
      data.datasets.splice(0, 1)
      if(max_value  <= 4){
        data.datasets.splice(0, 1)
      }
    }

    //chart Configuration    
    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,    
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
                                2 : 1    ,
                                3 : 2    ,
                                4 : 5    ,
                                5 : 10   ,
                                6 : 15   ,
                                7 : 20   ,
                                8 : 50   ,
                                9 : 100  
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
