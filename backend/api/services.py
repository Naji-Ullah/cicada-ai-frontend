import google.generativeai as genai
from django.conf import settings
import logging
import os

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY') or getattr(settings, 'GEMINI_API_KEY', None)
        
        if not self.api_key:
            logger.error("GEMINI_API_KEY is not set in environment variables or Django settings")
            raise ValueError("GEMINI_API_KEY is not set in environment variables or Django settings")
        
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            logger.info("Gemini service initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing Gemini service: {str(e)}")
            raise
    
    def generate_response(self, user_message, conversation_history=None):
        """
        Generate a response using Google Gemini API
        
        Args:
            user_message (str): The user's message
            conversation_history (list): List of previous messages for context
            
        Returns:
            str: Generated response from Gemini
        """
        try:
            if conversation_history and len(conversation_history) > 0:
                chat = self.model.start_chat(history=conversation_history)
                response = chat.send_message(user_message)
            else:
                response = self.model.generate_content(user_message)
            
            return response.text
            
        except Exception as e:
            logger.error(f"Error generating Gemini response: {str(e)}")
            return f"I apologize, but I'm having trouble processing your request right now. Error: {str(e)}"
    
    def format_conversation_history(self, messages):
        """
        Format conversation history for Gemini API
        
        Args:
            messages (list): List of ChatMessage objects
            
        Returns:
            list: Formatted conversation history for Gemini
        """
        history = []
        for message in messages:
            if message.message_type == 'user':
                history.append({
                    'role': 'user',
                    'parts': [message.content]
                })
            elif message.message_type == 'ai':
                history.append({
                    'role': 'model',
                    'parts': [message.content]
                })
        return history 