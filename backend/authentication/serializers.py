from rest_framework import serializers
from .models import (
    Alert, 
    UserProfile, 
    ExamSession, 
    Examorientetion, 
    ExamAnswer, 
    ExamQuestion,
    RegistrationGuidance
)

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
        

class ExamAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamAnswer
        fields = "__all__"
class ExamQuestionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = ExamQuestion
        fields = ['id', 'question_text', 'options']

    def get_options(self, obj):
        return {
            "A": obj.option_a,
            "B": obj.option_b,
            "C": obj.option_c,
            "D": obj.option_d
        }
class RegistrationGuidanceSerializer(serializers.ModelSerializer):
    class Meta:
        model =RegistrationGuidance
        fields="__all__"