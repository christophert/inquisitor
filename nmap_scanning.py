from libnmap.process import NmapProcess
from libnmap.parser import NmapParser, NmapParserException
from libnmap.reportjson import ReportEncoder
from time import sleep
import manuf

def init_scan(target):
    parsed = None
    nmap_proc = NmapProcess(target, options="-O")
    rc = nmap_proc.run()
    if rc != 0:
        print "Nmap initial scan failed"

    try:
        parsed = NmapParser.parse(nmap_proc.stdout)
    except NmapParserException as e:
        print "Exception raised while parsing Nmap report: " + str(e.msg)

    for host in parsed.hosts:
        if host.is_up():
            retarray = {'ip': host.address, 'cpe': [], 'open_ports': []}
            retarray['open_ports'] = host.get_open_ports()
            if host.os_fingerprinted:
                for osm in host.os.osmatches:
                    print "Name: %s Accuracy: %s" % (osm.name, str(osm.accuracy))

                    for osc in osm.osclasses:
                        for cpe in osc.cpelist:
                            retarray['cpe'].append(cpe.cpestring)
                    return retarray
            else:
                print "No Fingerprint available"
