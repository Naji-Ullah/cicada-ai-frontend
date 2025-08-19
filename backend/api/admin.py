from django.contrib import admin
from .models import ChatMessage


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'message_type', 'content', 'timestamp']
    list_filter = ['message_type', 'timestamp']
    search_fields = ['user__username', 'content']
    readonly_fields = ['timestamp']
