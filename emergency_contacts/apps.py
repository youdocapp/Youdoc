from django.apps import AppConfig


class EmergencyContactsConfig(AppConfig):
	default_auto_field = 'django.db.models.BigAutoField'
	name = 'emergency_contacts'
	verbose_name = 'Emergency Contacts'
	
	def ready(self):
		"""
		Import signal handlers when the app is ready.
		"""
		# Import signals if you have any
		# import emergency_contacts.signals
		pass