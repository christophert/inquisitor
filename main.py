# Load libraries

import os
import sys
import json

if not os.geteuid() == 0:
    sys.exit('Script must be run as root')

#import twisted HTTP libraries
from flask import Flask, jsonify, request, abort, render_template
from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, backref, sessionmaker
from sqlbase import db, init_db, ScanRecord, HostProfile

#import classes
from ContinuousScanProcess import ScanningProcess
import nmap_scanning
# import manuf


# p = manuf.MacParser()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/inquisitor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
init_db(app)
global s
s = None

@app.route('/')
def root_page():
    return render_template('index.html');

@app.route('/newhost')
def newhost_page():
    return render_template('new.html');

@app.route('/api/start_scan_thread', methods=['GET'])
def start_scan():
    global s
    if s is None:
        s = ScanningProcess()
    else:
        return jsonify({"running": True})
    return jsonify({"start": True})


@app.route('/api/scans', methods=['GET'])
def get_scans():
    return jsonify(ScanRecord.serialize_list(ScanRecord.query.all()))

@app.route('/api/hosts', methods=['GET'])
def get_hosts():
    return jsonify(json_list = HostProfile.serialize_list(HostProfile.query.all()))

@app.route('/api/hosts/<int:host_id>', methods=['GET'])
def get_host(host_id):
    return jsonify({"host_information": HostProfile.query.get(host_id).serialize(), "scans": ScanRecord.serialize_list(ScanRecord.query.filter_by(host_profile_id=host_id))})


@app.route('/api/hosts', methods=['POST'])
def make_hosts():
    if not request.json or not 'hostname' in request.json or not 'ip_addr' in request.json or not 'mac_address' in request.json or not 'os' in request.json:
        abort(400)
    tmp = HostProfile(hostname=request.json["hostname"], ip_addr=request.json["ip_addr"], mac_address = request.json["mac_address"], os = request.json["os"], risk_rating=0, warning=0)

    # tmp = p.get_manuf(request.args["mac_address"])
    # print tmp
    db.session.add(tmp)
    db.session.commit()
    db.session.refresh(tmp)

    #scan the host
    scan_return = nmap_scanning.init_scan(str(request.json["ip_addr"]))
    tmp_scanrd = ScanRecord(host_profile_id=tmp.id, os_cpe_result=json.dumps(scan_return), os_cpe_match=False)
    if len(scan_return['cpe']) > 0:
        for i in scan_return['cpe']:
            if tmp.os.lower() in i:
                tmp_scanrd.os_cpe_match=True
        if not tmp_scanrd.os_cpe_match:
            tmp.warning = 1
            db.session.add(tmp)
        if len(scan_return['open_ports']) > 0:
            tmp.open_ports = json.dumps(scan_return['open_ports'])
    db.session.add(tmp_scanrd)
    db.session.commit()
    return jsonify(tmp_scanrd.serialize())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', threaded=True)
