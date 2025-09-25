from django.contrib.auth.models import User
from django.db import models

class Alert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    username = models.CharField(max_length=150)
    reason = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    device_mac = models.CharField(max_length=50, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    def __str__(self):
        return f"{self.username} - {self.reason} - {self.timestamp}"
    
class ExamSession(models.Model):

    user= models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
