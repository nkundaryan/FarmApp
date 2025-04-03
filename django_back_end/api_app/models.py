from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError(_('The Username must be set'))
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    objects = CustomUserManager()

    def __str__(self):
        return self.username

class Greenhouse(models.Model):
    STATUS_CHOICES = [
        ('inactive', 'Inactive'),
        ('active', 'Active'),
        ('maintenance', 'Maintenance')
    ]
    
    name = models.CharField(max_length=100)
    size = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='inactive')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.size} sq ft)"

class GrowingCycle(models.Model):
    CYCLE_STATUS_CHOICES = [
        ('preparing', 'Preparing'),
        ('growing', 'Growing'),
        ('harvesting', 'Harvesting'),
        ('completed', 'Completed'),
        ('terminated', 'Terminated Early')
    ]
    
    TERMINATION_REASON_CHOICES = [
        ('harvest_complete', 'Harvest Completed'),
        ('crop_failure', 'Crop Failure'),
        ('disease', 'Disease'),
        ('other', 'Other')
    ]
    
    greenhouse = models.ForeignKey(Greenhouse, on_delete=models.CASCADE, related_name='cycles')
    crop_name = models.CharField(max_length=100)
    seed_type = models.CharField(max_length=100)
    planting_date = models.DateField()
    expected_harvest_date = models.DateField()
    actual_harvest_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=CYCLE_STATUS_CHOICES)
    termination_reason = models.CharField(max_length=20, choices=TERMINATION_REASON_CHOICES, null=True, blank=True)
    termination_notes = models.TextField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.greenhouse.name} - {self.crop_name} ({self.planting_date})"

class WeeklyHarvest(models.Model):
    QUALITY_CHOICES = [
        ('good', 'Good'),
        ('medium', 'Medium'),
        ('bad', 'Bad')
    ]
    
    growing_cycle = models.ForeignKey(GrowingCycle, on_delete=models.CASCADE, related_name='harvests')
    week_number = models.IntegerField()
    harvest_date = models.DateField()
    weight = models.DecimalField(max_digits=10, decimal_places=2)
    quality = models.CharField(max_length=10, choices=QUALITY_CHOICES)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Week {self.week_number} - {self.weight}kg ({self.quality})"

class MaintenanceActivity(models.Model):
    MAINTENANCE_TYPE_CHOICES = [
        ('cleaning', 'Cleaning'),
        ('repair', 'Repair')
    ]
    
    MAINTENANCE_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed')
    ]
    
    MAINTENANCE_SCHEDULE_CHOICES = [
        ('planned', 'Planned'),
        ('unplanned', 'Unplanned')
    ]
    
    greenhouse = models.ForeignKey(Greenhouse, on_delete=models.CASCADE, related_name='maintenance')
    date = models.DateField()
    type = models.CharField(max_length=20, choices=MAINTENANCE_TYPE_CHOICES)
    schedule = models.CharField(max_length=20, choices=MAINTENANCE_SCHEDULE_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=MAINTENANCE_STATUS_CHOICES)
    completion_date = models.DateField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.greenhouse.name} - {self.type} ({self.date})"
