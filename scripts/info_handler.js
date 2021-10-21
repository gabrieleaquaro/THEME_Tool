const PSFInfo = {
    "TipoTask": {
        '1':"",
        '0.55':"",
        '0.26':"",
        '0.16':"",
        '0.02':"",
        '0.003':"",
        '0.00002':"",
        '0.01':"",
        '0.001':""
    },
    "TempoDisponibie":{
        '100':"Automated Infos",
        '50':" ",
        '10':" ",
        '1.0':" ",
        '0.1':" ",
        '-': "Non Disponibile"
    },
    "StressDaMinaccia":{
        '5':"",
        '2':"",
        '1.0':"",
        '-': "Non Disponibile"
    },
    "ComplessitàTask":{
        '50':"",
        '10':"",
        '1.0':"",
        '0.1':"",
        '-': "Non Disponibile"
    },
    "Esperienza":{
        '100':"",
        '50':"",
        '15':"",
        '1.0':"",
        '-':"Non Disponibile"
    },
    "Procedure":{
        '50':"",
        '20':"",
        '5':"",
        '1.0':"",
        '0.1':"",
        '-':"Non Disponibile"
    },
    "InterazioneUmanoMacchina":{
        '100':"",
        '100':"",
        '50':"",
        '10':"",
        '1.0':"",
        '0.1':"",
        '-':"Non Disponibile"
    },
    "ContestoAmbientale":{
        '100':"",
        '50':"",
        '10':"",
        '1.0':"",
        '-':"Non Disponibile"
    },
    "Affaticamento":{
        '100':"",
        '10':"",
        '1.0':"",
        '-':"Non Disponibile"
    }    
}

function computeInfo(currentPage){
    if(currentPage == "prob_errore"){
        data = currReport["prob_errore"]
        Object.keys(data).forEach(function(k){
            el = document.getElementById(k+'_Info');
            if(el != null){
                el.setAttribute("data-bs-content", PSFInfo[k][data[k]]);
            }
        });
    }
}

var currReport = JSON.parse(fs.readFileSync('./dati/' + currentReport));
computeInfo(currentPage);