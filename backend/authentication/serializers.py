from rest_framework import serializers
from .models import (
    Alert, 
    UserProfile, 
    Examorientetion, 
    RegistrationGuidance,
    Exam, 
    Question, 
    ExamSession, 
    ExamAnswer,
    Examorientetion

)

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d']

class ExamAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamAnswer
        fields = ['id', 'session', 'question', 'selected_option', 'last_saved']

class ExamSessionSerializer(serializers.ModelSerializer):
    answers = ExamAnswerSerializer(many=True, read_only=True)
    class Meta:
        model = ExamSession
        fields = ['id', 'student', 'exam', 'start_time', 'end_time', 'is_submitted', 'score', 'answers']

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'title', 'duration_minutes']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model= UserProfile
        fields= "__all__"


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model=Alert
        fields= "__all__"

class ExamorientetionSerializer(serializers.ModelSerializer):
    media_url = serializers.SerializerMethodField()

    class Meta:
        model = Examorientetion
        fields = ['id', 'title', 'description', 'media_url', 'uploaded_at']

    def get_media_url(self, obj):
        request = self.context.get('request')
        if obj.media:
            return request.build_absolute_uri(obj.media.url)
        return None

class RegistrationGuidanceSerializer(serializers.ModelSerializer):
    instructions = serializers.CharField(source='description')  # map description → instructions
    video_url = serializers.FileField(source='media', allow_null=True)  # map media → video_url

    class Meta:
        model =RegistrationGuidance
        fields=["id", "instructions", "video_url"]