from django.conf import settings
from django.utils.deprecation import MiddlewareMixin


class CSRFExemptMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Check if the request path is in the CSRF exempt URLs
        if hasattr(settings, 'CSRF_EXEMPT_URLS'):
            for url in settings.CSRF_EXEMPT_URLS:
                if request.path.startswith(url):
                    setattr(request, '_dont_enforce_csrf_checks', True)
                    break
        return None 