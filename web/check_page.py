import urllib.request
html = urllib.request.urlopen('http://127.0.0.1:8000/').read().decode('utf-8', 'ignore')
print('Sedes del mundial' in html)
print('estados-unidos.png' in html)
print('mexico.png' in html)
print('canada.png' in html)
print(html[html.find('El Mundial Más Grande'):html.find('Debutantes 2026')])
