/* This script reads the JSON data file from the web server */

$.ajax({
    url: '/api/start_scan_thread',
    type: 'GET'
});

/* function that processes the data received from the response */
$.ajax({
    url: '/api/hosts',
    type: 'GET',
    success: function(arr) {
        hosts = arr['json_list'];

        if(hosts.length <= 0) {
            $('#compList').append("<div class='compCard'>No Hosts added. <a href='/newhost'>Add a host</a></div>");
        }
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

        console.log(hosts);

        for(i = 0; i < hosts.length; i++) {
            // Determine which img to use
            if(hosts[i].warning == 1) {
                compImg = "/static/BadComp.png";
            }
            else if(hosts[i].warning == 0) {
                compImg = "/static/GoodComp.png";
            }

            // Set all variables
            ipAddress = hosts[i].ip_addr;
            macAddress = hosts[i].mac_address;
            riskRating = hosts[i].risk_rating;

            // Create computer cards
            out +=
                "<div class='compCard' id='card" + i + "' onmouseover='showInfo(" + i + ")' onmouseout='hideInfo(" + i + ")'>" +
                    "<img src='" + compImg + "' class='compIcon' />" +
                "</div>";

            // Create divs that will display the computer info
            info +=
                "<div class='infoDivs' id='comp" + i + "' style='display: none;'>" +
                "<p><span class='label'>IP Address: </span> " + hosts[i].ip_addr + "<br/>" +
                "<span class='label'>MAC Address: </span> " + hosts[i].mac_address + "<br/>" +
                "<span class='label'>OS: </span> " + hosts[i].os + "<br/>" +
                "<span class='label'>Ports: </span> " + hosts[i].open_ports + "<br/>" +
                "<span class='label'>Risk Rating: </span> " + hosts[i].risk_rating + "</p></div>";

            $.ajax({
                url: '/api/hosts/'+(i+1),
                type: 'GET',
                success: function(data) {
                    scans = data['scans'];
                    scaninfo = "<div class='infoDivs' id='comp-scan" + (data.host_information.id-1) + "' style='display:none'><p><span class='label'>Scans: </span><ul>";
                    for(var j = 0; j < scans.length; j++) {
                        scaninfo += "<li>Scanned " + scans[j].created_at + " with fingerprint " + (scans[j].os_cpe_match ? "match" : "mismatch") + "</li>";
                    }
                    scaninfo += "</ul></p></div>";
                    $('#info').append(scaninfo);
                }
            });

        }

        // Add divs to dom
        $('#compList').append(out);
        $('#info').append(info);
    }
});

function showInfo(i) {
    $('#comp' + i).toggle();
    $('#comp-scan' + i).toggle();
}

function hideInfo(i) {
    $('#comp' + i).hide();
    $('#comp-scan' + i).hide();
}
