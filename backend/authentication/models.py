from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    address = models.TextField(null=True, blank=True) 
    education_level = models.CharField(max_length=64, null=True, blank=True)
    national_id_photo = models.ImageField(upload_to='national_id_photos/', null=True, blank=True)
    national_id = models.CharField(max_length=32, null=True, blank=True)
    rf_identifier = models.CharField(max_length=255, null=True, blank=True)  
    face_encoding = models.BinaryField(null=True, blank=True)
    extracted_face_photo = models.ImageField(upload_to='extracted_faces/', null=True, blank=True)
    iris_encoding = models.BinaryField(null=True, blank=True)      
    fingerprint_encoding = models.BinaryField(null=True, blank=True) 
    

    blocked = models.BooleanField(default=False)
    def __str__(self):
        return self.user.username

class Alert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    username = models.CharField(max_length=150)
    national_id_photo = models.ImageField(upload_to='national_id_photos/', null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    def __str__(self):
        return f"{self.username} - {self.reason} - {self.timestamp}"
    
class ExamSession(models.Model):

    user= models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"ExamSession for {self.user.username} at {self.timestamp}"

class Examorientetion(models.Model):
    title=models.CharField(max_length=255)
    description=models.TextField()
    video_url=models.FileField(upload_to='exam_videos/', null=True, blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title