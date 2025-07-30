from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    face_encoding = models.BinaryField(null=True, blank=True)
    iris_encoding = models.BinaryField(null=True, blank=True)  # NEW: for iris biometrics
    fingerprint_encoding = models.BinaryField(null=True, blank=True)  # NEW: for fingerprint biometrics
    rf_identifier = models.CharField(max_length=255, null=True, blank=True)  # optional RF tag/device ID
    blocked = models.BooleanField(default=False)
    national_id = models.CharField(max_length=32, null=True, blank=True)
    full_name = models.CharField(max_length=150, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    education_level = models.CharField(max_length=64, null=True, blank=True)
    national_id_photo = models.ImageField(upload_to='national_id_photos/', null=True, blank=True)


    def __str__(self):
        return self.user.username

class ExamSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_flagged = models.BooleanField(default=False)  # True if cheating suspected
    reason = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.start_time.strftime('%Y-%m-%d %H:%M')}"

class Alert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    username = models.CharField(max_length=150)
    alert_type = models.CharField(max_length=50)
    reason = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    # Advanced fields for device and location info
    device_mac = models.CharField(max_length=50, null=True, blank=True)
    device_type = models.CharField(max_length=50, null=True, blank=True)
    signal_strength = models.IntegerField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    wifi_ssid = models.CharField(max_length=100, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"{self.username} - {self.alert_type} - {self.timestamp}"
