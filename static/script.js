/* This script reads the JSON data file from the web server */

//$.ajax({
    //url: '/api/start_scan_thread',
    //type: 'GET'
//});

/* Declare the name of your json file */
var url = "test.json";

/* Create an XMLHttpRequest object to reqest data from a web server */
/* (the name of the request class has the legacy 'XML...' ) */
/* because it first read only XML data                      */
var httpObj = new XMLHttpRequest();

/* This function is called every time the status of the request object changes */
/* When the readystate is 4, and the status is 200, the response is ready */
/* (in other words, information is back from the server) */
httpObj.onreadystatechange = function() {
    if (httpObj.readyState == 4 && httpObj.status == 200) {
        /* read the response into the variable 'myArr' */
        var myArr = JSON.parse(httpObj.responseText);
        /* process the data you received from the response */
        myFunction(myArr);
    }
};

/* the open method specifies the type of http request  */
/*  --- we want to use GET (not POST),                 */
/*  --- we send the name of the file to get            */
/*  --- we use 'true' for an asynchronous request      */
httpObj.open("GET", url, true);
/* the send method with no parameters is used for GET  */
httpObj.send();
/*-----------------------------------------------------*/

/* function that processes the data received from the response */
function myFunction(arr) {
    /* create a variable to hold an html string */
    var out = "";
    var info = "";
    var i;
    var div = "";
    var compImg;
    var ipAddress;
    var macAddress;
    var numHosts;
    var ports;
    var riskRating;

    console.log(arr);

    for(i = 0; i < arr.length; i++) {
        // Determine which img to use
        if(arr[i].Malicious == 'true') {
            compImg = "BadComp.png";
        }
        else if(arr[i].Malicious == 'false') {
            compImg = "GoodComp.png";
        }

        // Set all variables
        ipAddress = arr[i].IPAddress;
        macAddress = arr[i].MACAddress;
        numHosts = arr[i].NumHosts;
        ports = arr[i].Ports;
        riskRating = arr[i].RiskRating;

        // Create computer cards
        out +=
            "<div class='compCard' id='card" + i + "' onmouseover='showInfo(" + i + ")' onmouseout='hideInfo(" + i + ")'>" +
                "<img src='" + compImg + "' class='compIcon' />" +
            "</div>";

        // Create divs that will display the computer info
        info +=
            "<div class='infoDivs' id='comp" + i + "' style='display: none;'>" +
            "<p><span class='label'>IP Address: </span> " + arr[i].IPAddress + "<br/>" +
            "<span class='label'>MAC Address: </span> " + arr[i].MACAddress + "<br/>" +
            "<span class='label'>Num Hosts: </span> " + arr[i].NumHosts + "<br/>" +
            "<span class='label'>Ports: </span> " + arr[i].Ports + "<br/>" +
            "<span class='label'>Risk Rating: </span> " + arr[i].RiskRating + "</p></div>";

    }

    // Add divs to dom
    $('#compList').append(out);
    $('#info').append(info);
}

function showInfo(i) {
    $('#comp' + i).toggle();
}

function hideInfo(i) {
    $('#comp' + i).hide();
}
