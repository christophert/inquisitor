import requests
import config
import pprint
import json
import re

cookies = {
    'user': config.NTOPNG_USERNAME,
    'password': config.NTOPNG_PASSWORD,
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/57.0',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.5',
    'charset': 'utf-8',
}

params = (
    ('currentPage', '1'),
    ('perPage', '200'),
    ('sortColumn', 'column_thpt'),
    ('sortOrder', 'desc'),
)

def get_traffic_data():
    try:
        r = requests.get(config.NTOPNG_HOST_URL+'/lua/get_hosts_data.lua', headers=headers, params=params, cookies=cookies)
        jr = r.json() 
        ret = {}
        for i in jr['data']:
            ip = str(re.findall( r'[0-9]+(?:\.[0-9]+){3}', i['column_ip'])[0])
            if len(ip) <= 0:
                continue
            print i['column_traffic']
            traffic = str(i['column_traffic'])
            convtraf = 0
            if "Bytes" in traffic:
                convtraf =  float(traffic.split(' ')[0])
            elif "KB" in traffic:
                convtraf =  float(traffic.split(' ')[0])*1000
            elif "MB" in traffic:
                convtraf =  float(traffic.split(' ')[0])*1000000
            elif "GB" in traffic:
                convtraf =  float(traffic.split(' ')[0])*1000000000
            elif "TB" in traffic:
                convtraf =  float(traffic.split(' ')[0])*1000000000000
            ret[ip] = convtraf
        return ret
    except requests.exceptions.RequestException as e:
        print "Unable to interface with the ntopng server, skipping ntop functionality"
        return []
