from rest_framework import serializers
from .models import Register
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model= Register
        exclude = ['rf_identifier', 'blocked', 'user']

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user
