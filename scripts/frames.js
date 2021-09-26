var previousMenuElementActive = document.getElementById("homeIndex")

function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
}

function changeFrame(element,src){
    console.log("Change frame page")
    var iFrame = document.getElementById("frame")
    iFrame.src = src

    // cambio colorazione degli indici del menù
    if(!previousMenuElementActive.isEqualNode(element)){
        console.log("Cambio active")
        previousMenuElementActive.classList.remove("active")
        element.classList.add("active")
        previousMenuElementActive = element
    }

}