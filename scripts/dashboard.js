//Icon loading
feather.replace()

//Gets a file and load it into report variable
function load_data(event){

}

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

    switch (currentPage) {
        case 'prob_errore':
            updateProbError_results(report[currentPage]);
            break;
        
        default:
          console.log("Nothing results to compute here...");
      }
      
}

function updateProbError_results(data){
    
}