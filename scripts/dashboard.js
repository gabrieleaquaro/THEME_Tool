//Icon loading
feather.replace()

//Gets a file and load it into report variable
function load_data(event){

}

function snackbarShow() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
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