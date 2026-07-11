import os
from django.shortcuts import redirect
from django.conf import settings


class CanonicalHostMiddleware:
    """Redirija 127.0.0.1 a localhost para mantener una URL canónica única."""
    
    def __init__(self, get_response):
        self.get_response = get_response
        # URL canónica (localhost)
        self.canonical_host = os.getenv("CANONICAL_HOST", "localhost:8000")
    
    def __call__(self, request):
        # Si el host es 127.0.0.1, redirija a localhost
        host = request.get_host()
        
        if host.startswith("127.0.0.1"):
            # Reemplaza 127.0.0.1 con localhost
            new_host = host.replace("127.0.0.1", "localhost")
            return redirect(
                f"{request.scheme}://{new_host}{request.get_full_path()}",
                permanent=False
            )
        
        response = self.get_response(request)
        return response

