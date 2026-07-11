import os
from pathlib import Path
os.chdir(Path(__file__).resolve().parent)
print('cwd', os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()
import core
import core.urls
print('core module file:', core.__file__)
print('core.urls file:', core.urls.__file__)
print('patterns:')
for p in core.urls.urlpatterns:
    print('  name=', getattr(p, 'name', None), 'pattern=', getattr(p, 'pattern', p))
