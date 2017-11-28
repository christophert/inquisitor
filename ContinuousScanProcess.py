from multiprocessing import Process
import nmap_scanning
import ntop_actions
from sqlbase import HostProfile, ScanRecord, db
import time
import json

class ScanningProcess:
    def __init__(self):
        p = Process(target=self.run, args=())
        p.daemon = True
        p.start()

    def run(self):
        while True:
            traffic_stats = ntop_actions.get_traffic_data()
            hosts = HostProfile.query.all()
            for host in hosts:
                if host.ip_addr in traffic_stats:
                    if traffic_stats[host.ip_addr] > 100000000000:
                        host.warning = 1
                        db.session.add(host)
                scanning_record = nmap_scanning.init_scan(str(host.ip_addr))
                tmp_scanrd = ScanRecord(host_profile_id=host.id, os_cpe_result=json.dumps(scanning_record), os_cpe_match=False)
                if len(scanning_record['cpe']) > 0:
                    for i in scanning_record['cpe']:
                        if host.os.lower() in i:
                            tmp_scanrd.os_cpe_match=True
                if len(scanning_record['open_ports']) > 0:
                    host.open_ports = scanning_record['open_ports']
                    db.session.add(host)
                if tmp_scanrd.os_cpe_match is False:
                    host.warning = 1 
                    db.session.add(host)
                db.session.add(tmp_scanrd)
                db.session.commit()
            time.sleep(300)
