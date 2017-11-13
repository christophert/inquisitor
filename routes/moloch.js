var express = require('express');
var router = express.Router();
var request = require('request');


var demoun = "moloch";
var demopw = "moloch";
var option = {
    url: 'https://demo.molo.ch/sessions.json?bounding=last&date=-1&facets=1&fields=pr,tipv61-term,tipv62-term,fp,http.statuscode,a1,g1,p1,a2,g2,p2,us,esrc,edst,esub,efn,dnsho,tls.alt,ircch,prot-term,pr,portall,all,greip,ipall,pa1,xff,db,as1,tlscnt,tls.alt,a1&flatten=1&interval=auto&length=50&order=fp:desc',
    'auth': {
        'user': 'moloch',
        'pass': 'moloch',
        'sendImmediately': false 
    }
}

router.get('/sessions', function(req, res, next) {
    request(option, function(error, response, body) {
        var globdata = JSON.parse(body);
        console.log(globdata['recordsFiltered']);

        for(var i = 0; i < globdata['data'].length; i++) {
            //parse source IP
            var srcipp4 = globdata['data'][i]['a1'] & 255;
            var srcipp3 = ((globdata['data'][i]['a1'] >> 8) & 255);
            var srcipp2 = ((globdata['data'][i]['a1'] >> 16) & 255);
            var srcipp1 = ((globdata['data'][i]['a1'] >> 24) & 255);

            console.log(srcipp4 + "." + srcipp3 + "." + srcipp2 + "." + srcipp1);
        }
    });
});

module.exports = router;
