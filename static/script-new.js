$(document).ready(function() {
    var hosts;
    $.ajax({
        url: '/api/hosts',
        type: 'GET',
        success: function(arr) {
            hosts = arr['json_list'];
        },
        complete: function(arr) {
            if(hosts.length <= 0) {
                $('#hosts-table').append('<tr><td colspan="25">No hosts added.</td></tr>');
            }

            console.log(hosts);

            for(var i = 0; i < hosts.length; i++) {
                var info = '';
                // append infodiv stuff
                info +=
                    "<div class='infoDivs' data-id='"+i+"' style='display: none;'>" +
                    "<p><span class='label'>IP Address: </span> " + hosts[i].ip_addr + "<br/>" +
                    "<span class='label'>MAC Address: </span> " + hosts[i].mac_address + "<br/>" +
                    "<span class='label'>OS: </span> " + hosts[i].os + "<br/>" +
                    "<span class='label'>Ports: </span> " + hosts[i].open_ports + "<br/>" +
                    "<span class='label'>Risk Rating: </span> " + hosts[i].risk_rating + "</p></div>";

                // append row data to table
                var rowData = '';
                if(hosts[i].warning == 1) {
                    rowData += '<tr data-id="'+i+'" class="table-danger"><td><span class="oi oi-monitor" style="color: red"></span> ' +hosts[i].ip_addr+'</td>';
                }
                else if(hosts[i].warning == 0) {
                    rowData += '<tr data-id="'+i+'" class="table-success"><td><span class="oi oi-monitor" style="color: green"></span> ' +hosts[i].ip_addr+'</td>';
                }

                rowData += '<td colspan="24"><div class="progress">';

                var scan_keybyhr = {};
                $.ajax({
                    url: '/api/hosts/'+hosts[i].id,
                    type: 'GET',
                    success: function(data) {
                        scans = data['scans'];

                        for(var s = 0; s < scans.length; s++) {
                            scan_keybyhr[scans[s].created_at_hour] = scans[s];
                        }
                        console.log(scan_keybyhr);
                        scaninfo = "<div class='infoDivs' id='comp-scan" + (data.host_information.id-1) + "' style='display:none'><p><span class='label'>Scans: </span><ul>";
                        for(var j = 0; j < scans.length; j++) {
                            scaninfo += "<li>Scanned " + scans[j].created_at + " with fingerprint " + (scans[j].os_cpe_match ? "match" : "mismatch") + "</li>";
                        }
                        scaninfo += "</ul></p></div>";
                        $('#info').append(info);
                        $('#info').append(scaninfo);
                    },
                    complete: function() {
                        for(var h = 1; h < 25; h++) {
                            if(scan_keybyhr[h] && scan_keybyhr[h].os_cpe_match == false) {
                                //do bar
                                rowData += '<div class="progress-bar bg-red" role="progressbar" style="width: 4.166%" aria=valuenow="4.166" aria-valuemin="0" aria-valuemax="100"></div>';
                                console.log("row false");
                            }
                            else if(scan_keybyhr[h] && scan_keybyhr[h].os_cpe_match == true) {
                                rowData += '<div class="progress-bar bg-success" role="progressbar" style="width: 4.166%" aria-valuenow="4.166" aria-valuemin="0" aria-valuemax="100"></div>';
                                console.log("row true");
                            }
                            else {
                                rowData += '<div class="progress-bar" role="progressbar" style="background-color: #DCDCDC;width: 4.166%" aria-valuenow="4.166" aria-valuemin="0" aria-valuemax="100"></div>';
                                console.log("row fail");
                            }
                        }
                        console.log(rowData);
                        $('#hosts-table').append(rowData);
                    }
                });

            }
        }
    });

});
$.ajax({
    url: '/api/start_scan_thread',
    type: 'GET'
});
$(document).on('mouseenter', '#hosts-table tr', function() {
    var i = $(this).data('id');
    $('.infoDivs[data-id='+i+']').show();
    $('#comp-scan' + i).show();
});
$(document).on('mouseleave', '#hosts-table tr', function() {
    var i = $(this).data('id');
    $('.infoDivs[data-id='+i+']').hide();
    $('#comp-scan' + i).hide();
});
