import requests

token = '070816'
base_url = 'https://api.sportmonks.com/v3/football'

# Probar varios endpoints
endpoints = [
    '/leagues/search/FIFA World Cup',
    '/articles',
    '/timelines', 
    '/news',
    '/matches',
    '/teams'
]

for ep in endpoints:
    try:
        response = requests.get(
            f'{base_url}{ep}',
            params={'api_token': token},
            timeout=5
        )
        print(f'{ep}: {response.status_code}')
        if response.status_code == 200:
            data = response.json()
            if 'data' in data:
                print(f'  - Data count: {len(data["data"])}')
    except Exception as e:
        print(f'{ep}: ERROR - {str(e)[:50]}')
