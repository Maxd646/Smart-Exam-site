from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

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

class Exam(models.Model):
    title = models.CharField(max_length=255)
    duration_minutes = models.IntegerField()  # Exam duration in minutes

    def __str__(self):
        return self.title

class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, null=True, blank=True, related_name='questions')
    text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_option = models.CharField(max_length=1, choices=[('A','A'),('B','B'),('C','C'),('D','D')])

    def __str__(self):
        return self.text

class ExamSession(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    exam = models.ForeignKey('Exam', on_delete=models.CASCADE, null=True, blank=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_submitted = models.BooleanField(default=False)
    score = models.FloatField(null=True, blank=True)
    def __str__(self):
        return f"{self.student.username} - {self.exam.title}"
    def is_time_over(self):
        """Return True if exam time has expired."""
        return self.end_time and timezone.now() >= self.end_time

class ExamAnswer(models.Model):
    session = models.ForeignKey(ExamSession, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey('Question', on_delete=models.CASCADE, null=True, blank=True)
    selected_option = models.CharField(max_length=1, choices=[('A','A'),('B','B'),('C','C'),('D','D')], blank=True, null=True)
    last_saved = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.session.student.username} - {self.question.text}"


class Alert(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    username = models.CharField(max_length=150)
    national_id_photo = models.ImageField(upload_to='national_id_photos/', null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Alert for {self.username} at {self.timestamp}"
class Examorientetion(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    media = models.FileField(upload_to='exam_media/', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class RegistrationGuidance(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    media = models.FileField(upload_to='guidance/', null=True, blank=True)
    order = models.PositiveIntegerField(default=0)  

    def __str__(self):
        return self.title
