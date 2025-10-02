from rest_framework import serializers
from .models import Alert, UserProfile, ExamSession, Examorientetion

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model= UserProfile
        fields= "__all__"


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model=Alert
        fields= "__all__"


class ExamSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamSession
        fields = "__all__"
class ExamorientetionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Examorientetion
        fields = "__all__"
        

