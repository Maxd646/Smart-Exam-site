from django.db import models
from django.contrib.auth.models import User

class Register(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    rf_identifier = models.CharField(max_length=255, null=True, blank=True)  
    national_id = models.CharField(max_length=32, null=True, blank=True)
    full_name = models.CharField(max_length=150, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    education_level = models.CharField(max_length=64, null=True, blank=True)
    national_id_photo = models.ImageField(upload_to='national_id_photos/', null=True, blank=True)     
    def __str__(self):
        return self.user.username
