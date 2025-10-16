from django.apps import AppConfig


class MedicationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'medication'
    verbose_name = 'Medication Management'
    
    def ready(self):
        """Import signal handlers when the app is ready"""
        try:
            import medication.signals  # noqa
        except ImportError:
            pass