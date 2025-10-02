from django.db import models
from django.contrib.auth.models import User

class Register(models.Model):
    user=models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    education_level = models.CharField(max_length=64, null=True, blank=True)
    national_id_photo = models.ImageField(upload_to='national_id_photos/', null=True, blank=True)
    national_id = models.CharField(max_length=32, null=True, blank=True) 
    blocked = models.BooleanField(default=False) 
    rf_identifier = models.CharField(max_length=255, null=True, blank=True)    
    face_encoding = models.BinaryField(null=True, blank=True)
    extracted_face_photo = models.ImageField(upload_to='extracted_faces/', null=True, blank=True)
    iris_encoding = models.BinaryField(null=True, blank=True)      
    fingerprint_encoding = models.BinaryField(null=True, blank=True)  
    def __str__(self):
        return self.user.username
