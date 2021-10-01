
//Icon loading
feather.replace()

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
        if(data[key] != null){
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
}

function generateChart_PSF(values){
    const DATA_COUNT = 8;
    const labels = ["Tempo disponibile",
                    "Pericolosità del Compito",
                    "Complessità del Compito",
                    "Esperienza/ Formazione",
                    "Procedure",
                    "Interazione Umano-Macchina",
                    "Contesto Ambientale",
                    "Affaticamento"];
    var values_list =  [values["TempoDisponibie"],values["StressDaMinaccia"],values["ComplessitàTask"],
                        values["Esperienza"],values["Procedure"],values["InterazioneUmanoMacchina"],
                        values["ContestoAmbientale"],values["Affaticamento"]]; 

    var max_present_value = Math.max(...values_list);
    var limit_max = max_present_value < 5 ? 2 :(max_present_value < 10 ? 5 : (max_present_value < 20 ? 15 : (max_present_value < 50 ? 30 : (max_present_value < 100 ? 60 : 100)))); 
    var stepSize = limit_max < 3 ? 0.5 : limit_max <  5 ? 1 : (limit_max < 10 ? 2 :(limit_max < 20 ? 5 : 15));            
    const data = {
        labels: labels,
        datasets: [
            // {   
            //     data: [100,100,100,100,100,100,100,100],
            //     backgroundColor : '#e3191920',
            //     borderColor :'#e3191920',
            //     pointRadius : 0,
            //     order: 4,
            //     clip:0
            // },
            // {   
            //     data: [10,10,10,10,10,10,10,10],
            //     backgroundColor : '#ede60e30',
            //     borderColor :'#ede60e30',
            //     pointRadius : 0,
            //     order: 3,
            //     clip:0
            // },
            // {   
            //     data: [5,5,5,5,5,5,5,5],
            //     backgroundColor : '#048f2040',
            //     borderColor :'#048f2040',
            //     pointRadius : 0,
            //     order: 3,
            //     clip:0
            // },
            // {   
            //     data: [1,1,1,1,1,1,1,1],
            //     backgroundColor : '#34eb4950',
            //     borderColor :'#34eb4950',
            //     pointRadius : 0,
            //     order:2,
            //     clip:0
            // },
            {
                label: 'Valore',
                data: values_list,
                borderColor: '#000',
                backgroundColor: '#a6a6a660',
                pointBackgroundColor: function(context){
                    var index = context.dataIndex;
                    var value = context.dataset.data[index];
                    return value <= 1 ? '#34eb49' : value <= 5 ? '#e9ed66' : '#e31919';
                }, 
                pointRadius: 4,
                order:1,
            },
            
        ]
    };

    
    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scale: {
                ticks: {
                    stepSize: stepSize
                },
                max: limit_max,
                min: 0,
            },
            plugins: {
                title: {
                display: true,
                text: 'PSF'
                },
                legend: {
                    display: false
                }
            },            
        },
      };

    var grapharea = document.getElementById("chart_PSF").getContext("2d");
    var PSF_chart = new Chart(grapharea,config);  
}
