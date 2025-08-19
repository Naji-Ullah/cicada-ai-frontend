from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ChatMessage


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'message_type', 'content', 'timestamp']


class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=10000) 