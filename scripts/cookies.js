
function previousAcceptance(){
    
    if (document.cookie.split(';').some((item) => item.trim().startsWith('cookieConsentGiven='))) {
    
        document.getElementById("cookiePopup").style.visibility = "hidden";
        document.getElementById("cookiePopup").remove();
       
        document.getElementsByTagName("BODY")[0].style.visibility = "visible";
        
        var image_box = document.getElementById("image_box");
        if(image_box){
            document.getElementsByClassName("inner cover")[0].classList.add("animate__animated");
            document.getElementsByClassName("inner cover")[0].classList.add("animate__zoomIn");    
        }
    }
}

function declineCookies(){
    window.location.href = "https://www.youtube.com/watch?v=IR-QoOS4pBQ"
}

function acceptCookies(){
    document.getElementById("cookiePopup").classList.add("animate__animated");
    document.getElementById("cookiePopup").classList.add("animate__zoomOut");
    
    document.getElementsByTagName("BODY")[0].style.visibility = "visible";
    
    var image_box = document.getElementById("image_box");
    if(image_box){
        document.getElementsByClassName("inner cover")[0].classList.add("animate__animated");
        
        document.getElementsByClassName("inner cover")[0].classList.add("animate__zoomIn");    
    }
   
    var d = new Date();
    d.setTime(d.getTime() + (1095 * 24 * 60 * 1000)); // 1095 day expiry
    document.cookie = "cookieConsentGiven=true; path=/; expires=" + d.toUTCString(); + "; domain=www.richvaughan.co.uk";
    
    document.getElementById("cookiePopup").style.visibility = "hidden";
    document.getElementById("cookiePopup").remove();
    
    dataLayer.push({
        'event': 'cookiesAccepted'
    })

}