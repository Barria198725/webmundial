import os
os.chdir(r'c:\Users\samte\Desktop\entregable\listo\IB\web')
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from django.template.loader import get_template
try:
    template = get_template('index.html')
    origin = getattr(template, 'origin', None)
    print('origin:', origin and origin.name)
    print('template repr:', template)
    if hasattr(template, 'template'):
        try:
            print('source:', template.template.source[:800])
        except Exception as e:
            print('source error:', e)
    else:
        print('No template.template attribute')
except Exception as e:
    import traceback; traceback.print_exc()