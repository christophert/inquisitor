from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import json
import datetime

db = SQLAlchemy()

from sqlalchemy.inspection import inspect

class Serializer(object):

    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(l):
        return [m.serialize() for m in l]

class ScanRecord(db.Model, Serializer):
    __tablename__ = 'ScanRecords'

    id = db.Column(db.Integer, primary_key=True)
    host_profile_id = db.Column(db.Integer)
    os_cpe_result = db.Column(db.String)
    os_cpe_match = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return "<ScanRecord(host_profile_id='%d', os_cpe_result='%s', os_cpe_match='%s', created_at='%s')>" % (self.host_profile_id, self.os_cpe_result, self.os_cpe_match, self.created_at)

class HostProfile(db.Model, Serializer):
    __tablename__ = 'HostProfiles'

    id = db.Column(db.Integer, primary_key=True)
    hostname = db.Column(db.String)
    ip_addr = db.Column(db.String)
    mac_address = db.Column(db.String)
    os = db.Column(db.String)
    last_seen_good = db.Column(db.DateTime, nullable=True)
    last_seen_rogue = db.Column(db.DateTime, nullable=True)
    risk_rating = db.Column(db.Integer)
    warning = db.Column(db.Integer, default=0)
    manuf = db.Column(db.String)
    open_ports = db.Column(db.String, nullable=True)

    def __repr__(self):
        return "<HostProfile(hostname='%s', ip_addr='%s', mac_address='%s', os='%s', last_seen_good='%s', last_seen_rogue='%s', risk_rating='%s', warning='%d', manuf='%s', open_ports='%s')>" % (self.hostname, self.ip_addr, self.mac_address, self.os, self.last_seen_good, self.last_seen_rogue, self.risk_rating, self.warning, self.manuf, self.open_ports)

def init_db(app):
    with app.app_context():
        db.init_app(app)
        db.create_all()
        db.session.commit()


