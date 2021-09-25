//Icon loading
feather.replace()

//TODO Find a way to pass "report"
//If added to a data filed, passing the event e, it updates the corresponding 
//field in the json variable
function updateJSON(e){
    field = e.target.id;
    data = e.target.value;
    report[field] = data;
}

//Gets a file and load it into report variable
function load_data(event){

}


//Saves the current report status into a file
function save(){
    d = new Date();
    var filename = "report_" + d.getDate()+ "_" + d.getMonth();
    var text = JSON.stringify(global.report)
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