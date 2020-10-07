// --- METHOD TO DECODE FROM HEX ---
//https://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex/26375459

String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

function updateRecord(){
    
    // --- UPDATING CURRENT DATE ---
    var d = new Date();
    var day = d.getDate().toString();

    if (d.getMonth()+1 < 10){
        var month = "0" + (d.getMonth()+1).toString();
    }
    else {
        var month = (d.getMonth()+1).toString();
    }

    var year = d.getFullYear().toString().slice(-2);

    var formattedDate = day + "/" + month + "/" + year

    document.getElementById("currentDate").innerHTML = formattedDate;


    // --- UPDATING RELEASE METADATA ---
    var ajax = new XMLHttpRequest();
    var method = 'GET';
    var url = 'scripts/data.php';
    var asynchronous = true;

    ajax.open(method, url, asynchronous);
    ajax.send();

    ajax.onreadystatechange = function(){

        // if request is successful
        if (this.readyState == 4 && this.status == 200) {

            try {

                // store response data and decode
                var data = JSON.parse(this.responseText);

                // make sure any cases of "(d)" after artist are removed - this is a quirk present in discogs for some artists
                var artist = data[0].artist.hexDecode().replace(/(\([0-9]\))/g,"");
                var title = data[0].title.hexDecode();
                var imgURL = data[0].imgURL.hexDecode();
                
                dataLayer.push({
                    'artist':artist,
                    'title':title,
                    'imgURL':imgURL
                })

                // generate YouTube URL for clickable album artwork
                searchQuery = title.replace(/ /g,"+").replace(/'|"|:|-|\?|\(|\)|\.|\/|!/g,"").replace(/\&/g,"and");
                searchQuery = searchQuery + "+" + artist.replace(/ /g,"+").replace(/'|"|:|-|\?|\(|\)|\.|\/|!/g,"");
                searchURL="https://www.youtube.com/results?search_query="+searchQuery;

                // generate HTML and insert into page
                html = "<a href='"+searchURL+"'><img alt='album artwork' src='"+imgURL+"'></a><p>title: "+title.toLowerCase()+"</p><p>artist: "+artist.toLowerCase()+"</p>";
                document.getElementById("image_box").innerHTML = html;    
            }
            catch(err) {
                console.log("Something went wrong. Really sorry about that. Today's release will be The Specials.")

                // if there's an error, just set the release to be the specials debut
                html = "<a href='https://www.youtube.com/results?search_query=the+specials'><img alt='album artwork' src='https://img.discogs.com/AO4k2hSnznwxooCitIPA7ZWspzI=/fit-in/600x588/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-14244754-1570625528-8124.jpeg.jpg'></a><p>title: the specials</p><p>artist: the specials</p>";
                document.getElementById("image_box").innerHTML = html;   
            }
        }
        else {
            // should be a couple of readyStates before a successful response
            console.log(".");
        }
    }
    
}




