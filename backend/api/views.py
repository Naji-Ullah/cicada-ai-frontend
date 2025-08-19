from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from .serializers import UserSerializer, ChatMessageSerializer, ChatRequestSerializer
from .models import ChatMessage
from .services import GeminiService
import logging

logger = logging.getLogger(__name__)


@method_decorator(csrf_exempt, name='dispatch')
class AuthView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Handle user login"""
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            serializer = UserSerializer(user)
            return Response({
                'user': serializer.data,
                'message': 'Login successful'
            })
        else:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        """Handle user registration"""
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        if not username or not email or not password:
            return Response(
                {'error': 'Username, email, and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            login(request, user)
            serializer = UserSerializer(user)
            return Response({
                'user': serializer.data,
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return Response(
                {'error': 'Error creating user'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [AllowAny]  # Allow logout even if not authenticated
    
    def post(self, request):
        """Handle user logout"""
        logout(request)
        return Response({'message': 'Logout successful'})


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user profile"""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class ChatView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get chat history for the current user"""
        messages = ChatMessage.objects.filter(user=request.user)
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Send a message and get AI response"""
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user_message = serializer.validated_data['message']
        
        try:
            user_chat_message = ChatMessage.objects.create(
                user=request.user,
                message_type='user',
                content=user_message
            )
            
            recent_messages = ChatMessage.objects.filter(
                user=request.user
            ).order_by('-timestamp')[:10]  # Last 10 messages for context
            
            gemini_service = GeminiService()
            
            conversation_history = gemini_service.format_conversation_history(recent_messages)
            
            ai_response = gemini_service.generate_response(user_message, conversation_history)
            
            ai_chat_message = ChatMessage.objects.create(
                user=request.user,
                message_type='ai',
                content=ai_response
            )
            
            return Response({
                'user_message': ChatMessageSerializer(user_chat_message).data,
                'ai_response': ChatMessageSerializer(ai_chat_message).data
            })
            
        except Exception as e:
            logger.error(f"Error in chat view: {str(e)}")
            return Response(
                {'error': 'Error processing your message'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ClearChatView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request):
        """Clear chat history for the current user"""
        ChatMessage.objects.filter(user=request.user).delete()
        return Response({'message': 'Chat history cleared'})
