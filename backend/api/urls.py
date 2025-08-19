from django.urls import path
from .views import (
    AuthView, 
    RegisterView, 
    LogoutView, 
    UserProfileView, 
    ChatView, 
    ClearChatView
)

urlpatterns = [
    path('auth/login/', AuthView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    path('chat/', ChatView.as_view(), name='chat'),
    path('chat/clear/', ClearChatView.as_view(), name='clear_chat'),
] 