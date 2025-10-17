from django.core.management.base import BaseCommand
from notifications.models import NotificationTemplate


class Command(BaseCommand):
    help = 'Create default notification templates'

    def handle(self, *args, **options):
        """Create default notification templates"""
        
        templates = [
            {
                'name': 'medication_reminder',
                'notification_type': 'medication',
                'title_template': 'Medication Reminder',
                'message_template': 'Time to take {medication_name} ({time})',
                'is_active': True
            },
            {
                'name': 'new_health_article',
                'notification_type': 'health-tip',
                'title_template': 'New Health Tip',
                'message_template': '{article_title}',
                'is_active': True
            },
            {
                'name': 'sync_complete',
                'notification_type': 'sync',
                'title_template': 'Sync Complete',
                'message_template': '{device_name} data synced successfully...',
                'is_active': True
            },
            {
                'name': 'general_notification',
                'notification_type': 'general',
                'title_template': '{title}',
                'message_template': '{message}',
                'is_active': True
            }
        ]
        
        created_count = 0
        updated_count = 0
        
        for template_data in templates:
            template, created = NotificationTemplate.objects.get_or_create(
                name=template_data['name'],
                defaults=template_data
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created template: {template.name}')
                )
            else:
                # Update existing template
                for key, value in template_data.items():
                    if key != 'name':
                        setattr(template, key, value)
                template.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated template: {template.name}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully processed {len(templates)} templates. '
                f'Created: {created_count}, Updated: {updated_count}'
            )
        )
