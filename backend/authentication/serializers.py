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

from rest_framework import serializers
from .models import Examorientetion

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
    instructions = serializers.CharField(source='description')  # map description → instructions
    video_url = serializers.FileField(source='media', allow_null=True)  # map media → video_url

    class Meta:
        model =RegistrationGuidance
        fields=["id", "instructions", "video_url"]