from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class ChatMessage(models.Model):
    MESSAGE_TYPES = [
        ('user', 'User'),
        ('ai', 'AI'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages')
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES)
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.user.username} - {self.message_type} - {self.timestamp}"
