from django import template
from django.utils.safestring import mark_safe

register = template.Library()

# Mapeo de nombres de equipos a nombres de archivos de logos
TEAM_LOGO_MAP = {
    'ALGERIA': 'algeria-national-team-logo-footylogos.png',
    'ARGENTINA': 'argentina-national-team-logo-footylogos.png',
    'AUSTRALIA': 'australia-national-team-logo-footylogos.png',
    'AUSTRIA': 'austria-national-team-logo-footylogos.png',
    'BELGIUM': 'belgium-national-team-logo-footylogos.png',
    'BOSNIA AND HERZEGOVINA': 'bosnia-and-herzegovina-national-team-logo-footylogos.png',
    'BRAZIL': 'brazil-national-team-logo-footylogos.png',
    'CABO VERDE': 'cabo-verde-national-team-logo-footylogos.png',
    'CANADA': 'canada-national-team-logo-footylogos.png',
    'COLOMBIA': 'colombia-national-team-logo-footylogos.png',
    'COTE D\'IVOIRE': 'cote-d-ivoire-national-team-logo-footylogos.png',
    'CROATIA': 'croatia-national-team-logo-footylogos.png',
    'CZECHIA': 'czechia-national-team-logo-footylogos.png',
    'DR CONGO': 'dr-congo-national-team-logo-footylogos.png',
    'ECUADOR': 'ecuador-national-team-logo-footylogos.png',
    'EGYPT': 'egypt-national-team-logo-footylogos.png',
    'ENGLAND': 'england-national-team-logo-footylogos.png',
    'FRANCE': 'france-national-team-logo-footylogos.png',
    'GERMANY': 'germany-national-team-logo-footylogos.png',
    'GHANA': 'ghana-national-team-logo-footylogos.png',
    'HAITI': 'haiti-national-team-logo-footylogos.png',
    'IRAN': 'iran-national-team-logo-footylogos.png',
    'IRAQ': 'iraq-national-team-logo-footylogos.png',
    'JAPAN': 'japan-national-team-logo-footylogos.png',
    'JORDAN': 'jordan-national-team-logo-footylogos (1).png',
    'MEXICO': 'mexico-national-team-logo-footylogos.png',
    'MOROCCO': 'morocco-national-team-logo-footylogos.png',
    'NETHERLANDS': 'netherlands-national-team-dutch-logo-footylogos.png',
    'NEW ZEALAND': 'new-zealand-national-team-logo-footylogos.png',
    'NORWAY': 'norway-national-team-logo-footylogos.png',
    'PANAMA': 'panama-national-team-logo-footylogos - copia.png',
    'PARAGUAY': 'paraguay-national-team-logo-footylogos.png',
    'PORTUGAL': 'portugal-national-team-logo-footylogos.png',
    'QATAR': 'qatar-national-team-logo-footylogos.png',
    'SAUDI ARABIA': 'saudi-arabia-national-team-logo-footylogos.png',
    'SCOTLAND': 'scotland-national-team-logo-footylogos.png',
    'SENEGAL': 'senegal-national-team-logo-footylogos.png',
    'SOUTH AFRICA': 'south-africa-national-team-logo-footylogos.png',
    'SOUTH KOREA': 'south-korea-national-team-logo-footylogos.png',
    'SPAIN': 'spain-national-team-logo-footylogos.png',
    'SWEDEN': 'sweden-national-team-logo-footylogos.png',
    'SWITZERLAND': 'switzerland-national-team-logo-footylogos.png',
    'TUNISIA': 'tunisia-national-team-logo-footylogos.png',
    'TURKEY': 'turkey-national-team-logo-footylogos.png',
    'URUGUAY': 'uruguay-national-team-logo-footylogos.png',
    'USA': 'usa-national-team-logo-footylogos.png',
    'UZBEKISTAN': 'uzbekistan-national-team-logo-footylogos.png',
}

@register.filter
def team_logo(team_name):
    """Obtiene el logo del equipo basado en su nombre"""
    if not team_name:
        return ''
    
    team_upper = team_name.strip().upper()
    return TEAM_LOGO_MAP.get(team_upper, '')

@register.filter
def team_logo_url(team_name):
    """Retorna la URL completa del logo del equipo"""
    logo_filename = team_logo(team_name)
    if logo_filename:
        return mark_safe(f"https://127.0.0.1:8000/static/images/logos/{logo_filename}")
    return ''
