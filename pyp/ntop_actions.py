import requests
import pprint

cookies = {
    'user': 'admin',
    'password': 'password',
}

headers = {
    'Host': '192.168.1.106:3000',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:57.0) Gecko/20100101 Firefox/57.0',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.5',
}

params = (
    ('currentPage', '1'),
    ('perPage', '200'),
    ('sortColumn', 'column_thpt'),
    ('sortOrder', 'desc'),
)

r = requests.get('http://192.168.1.106:3000/lua/get_hosts_data.lua', headers=headers, params=params, cookies=cookies)
pprint.pprint(r.json())

