from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, time, timedelta
from .models import (
    Medication, 
    MedicationReminder, 
    MedicationTaken, 
    MedicationType,
    FrequencyType,
    DosageUnit
)

User = get_user_model()


class MedicationModelTest(TestCase):
    """Test cases for Medication model"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.medication = Medication.objects.create(
            user=self.user,
            name='Aspirin',
            medication_type=MedicationType.PILL,
            dosage_amount=100,
            dosage_unit=DosageUnit.MG,
            frequency=FrequencyType.DAILY,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
            notes='Take with food'
        )
    
    def test_medication_creation(self):
        """Test medication creation"""
        self.assertEqual(self.medication.name, 'Aspirin')
        self.assertEqual(self.medication.user, self.user)
        self.assertEqual(self.medication.medication_type, MedicationType.PILL)
        self.assertEqual(self.medication.dosage_display, '100mg')
        self.assertTrue(self.medication.is_active)
        self.assertTrue(self.medication.reminder_enabled)
    
    def test_medication_dosage_display(self):
        """Test dosage display property"""
        self.assertEqual(self.medication.dosage_display, '100mg')
    
    def test_medication_is_current(self):
        """Test is_current property"""
        # Medication should be current since it starts today
        self.assertTrue(self.medication.is_current)
        
        # Create a medication that starts in the future
        future_medication = Medication.objects.create(
            user=self.user,
            name='Future Medication',
            medication_type=MedicationType.PILL,
            dosage_amount=50,
            dosage_unit=DosageUnit.MG,
            frequency=FrequencyType.DAILY,
            start_date=date.today() + timedelta(days=10)
        )
        self.assertFalse(future_medication.is_current)
        
        # Create a medication that ended yesterday
        past_medication = Medication.objects.create(
            user=self.user,
            name='Past Medication',
            medication_type=MedicationType.PILL,
            dosage_amount=25,
            dosage_unit=DosageUnit.MG,
            frequency=FrequencyType.DAILY,
            start_date=date.today() - timedelta(days=10),
            end_date=date.today() - timedelta(days=1)
        )
        self.assertFalse(past_medication.is_current)


class MedicationReminderModelTest(TestCase):
    """Test cases for MedicationReminder model"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.medication = Medication.objects.create(
            user=self.user,
            name='Test Medication',
            medication_type=MedicationType.PILL,
            dosage_amount=100,
            dosage_unit=DosageUnit.MG,
            frequency=FrequencyType.DAILY,
            start_date=date.today()
        )
        
        self.reminder = MedicationReminder.objects.create(
            medication=self.medication,
            time=time(8, 0)  # 8:00 AM
        )
    
    def test_reminder_creation(self):
        """Test reminder creation"""
        self.assertEqual(self.reminder.medication, self.medication)
        self.assertEqual(self.reminder.time, time(8, 0))
        self.assertTrue(self.reminder.is_active)
    
    def test_reminder_unique_constraint(self):
        """Test that duplicate reminders are not allowed"""
        with self.assertRaises(Exception):
            MedicationReminder.objects.create(
                medication=self.medication,
                time=time(8, 0)  # Same time
            )


class MedicationTakenModelTest(TestCase):
    """Test cases for MedicationTaken model"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.medication = Medication.objects.create(
            user=self.user,
            name='Test Medication',
            medication_type=MedicationType.PILL,
            dosage_amount=100,
            dosage_unit=DosageUnit.MG,
            frequency=FrequencyType.DAILY,
            start_date=date.today()
        )
        
        self.taken_record = MedicationTaken.objects.create(
            medication=self.medication,
            date=date.today(),
            taken=True
        )
    
    def test_taken_record_creation(self):
        """Test taken record creation"""
        self.assertEqual(self.taken_record.medication, self.medication)
        self.assertEqual(self.taken_record.date, date.today())
        self.assertTrue(self.taken_record.taken)
    
    def test_taken_record_unique_constraint(self):
        """Test that duplicate taken records are not allowed"""
        with self.assertRaises(Exception):
            MedicationTaken.objects.create(
                medication=self.medication,
                date=date.today(),  # Same date
                taken=False
            )


class MedicationEnumTest(TestCase):
    """Test cases for medication enums"""
    
    def test_medication_type_choices(self):
        """Test medication type choices"""
        choices = MedicationType.choices
        self.assertIn(('Pill', 'Pill'), choices)
        self.assertIn(('Injection', 'Injection'), choices)
        self.assertIn(('Drops', 'Drops'), choices)
        self.assertIn(('Inhaler', 'Inhaler'), choices)
        self.assertIn(('Cream', 'Cream'), choices)
        self.assertIn(('Spray', 'Spray'), choices)
    
    def test_frequency_type_choices(self):
        """Test frequency type choices"""
        choices = FrequencyType.choices
        self.assertIn(('Daily', 'Daily'), choices)
        self.assertIn(('Weekly', 'Weekly'), choices)
        self.assertIn(('As needed', 'As needed'), choices)
    
    def test_dosage_unit_choices(self):
        """Test dosage unit choices"""
        choices = DosageUnit.choices
        self.assertIn(('mg', 'mg'), choices)
        self.assertIn(('ml', 'ml'), choices)
        self.assertIn(('mcg', 'mcg'), choices)
        self.assertIn(('g', 'g'), choices)
        self.assertIn(('IU', 'IU'), choices)
        self.assertIn(('units', 'units'), choices)