from django.apps import AppConfig


class HealthRecordsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'health_records'
    verbose_name = 'Health Records'
    
    def ready(self):
        """Import signal handlers when the app is ready"""
        try:
            import health_records.signals
        except ImportError:
            pass