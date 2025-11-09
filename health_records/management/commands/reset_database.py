"""
Management command to drop all tables and reset the database.
WARNING: This will delete ALL data in the database!
"""
from django.core.management.base import BaseCommand
from django.db import connection
from django.conf import settings


class Command(BaseCommand):
	help = 'Drop all tables and reset the database (WARNING: Deletes all data!)'

	def add_arguments(self, parser):
		parser.add_argument(
			'--confirm',
			action='store_true',
			help='Confirm that you want to delete all data',
		)

	def handle(self, *args, **options):
		if not options['confirm']:
			self.stdout.write(
				self.style.ERROR(
					'WARNING: This will delete ALL data in the database!\n'
					'Run with --confirm to proceed.'
				)
			)
			return

		db_connection = connection
		db_vendor = db_connection.vendor

		self.stdout.write(self.style.WARNING('Dropping all tables...'))

		with db_connection.cursor() as cursor:
			if db_vendor == 'postgresql':
				# Get all table names
				cursor.execute("""
					SELECT tablename FROM pg_tables 
					WHERE schemaname = 'public'
				""")
				tables = cursor.fetchall()

				# Drop all tables with CASCADE
				for table in tables:
					table_name = table[0]
					self.stdout.write(f'Dropping table: {table_name}')
					cursor.execute(f'DROP TABLE IF EXISTS {table_name} CASCADE;')

				# Also drop all sequences
				cursor.execute("""
					SELECT sequence_name FROM information_schema.sequences 
					WHERE sequence_schema = 'public'
				""")
				sequences = cursor.fetchall()
				for seq in sequences:
					seq_name = seq[0]
					cursor.execute(f'DROP SEQUENCE IF EXISTS {seq_name} CASCADE;')

			elif db_vendor == 'sqlite':
				# SQLite - get all table names
				cursor.execute("""
					SELECT name FROM sqlite_master 
					WHERE type='table' AND name NOT LIKE 'sqlite_%'
				""")
				tables = cursor.fetchall()

				# Drop all tables
				for table in tables:
					table_name = table[0]
					self.stdout.write(f'Dropping table: {table_name}')
					cursor.execute(f'DROP TABLE IF EXISTS {table_name};')

			else:
				self.stdout.write(
					self.style.ERROR(f'Unsupported database vendor: {db_vendor}')
				)
				return

		self.stdout.write(
			self.style.SUCCESS(
				'\nAll tables dropped successfully!\n'
				'Now run: python manage.py migrate'
			)
		)

