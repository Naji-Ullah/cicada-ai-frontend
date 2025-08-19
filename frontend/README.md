# AI Chat Application with Django Backend and React Frontend

A full-stack chat application powered by Google Gemini AI, built with Django REST API backend and React TypeScript frontend.

## Features

- 🔐 User authentication (login/register)
- 💬 Real-time chat with Google Gemini AI
- 📱 Responsive design with Tailwind CSS
- 🎨 Modern UI with beautiful gradients
- 💾 Persistent chat history
- 🔄 Chat history management

## Tech Stack

### Backend
- **Django 5.2.4** - Web framework
- **Django REST Framework** - API framework
- **Google Generative AI** - AI integration
- **SQLite** - Database (can be changed to PostgreSQL/MySQL for production)
- **Django CORS Headers** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API key

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd project3
```

### 2. Backend Setup

#### Create and activate virtual environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install Python dependencies
```bash
pip install -r requirements.txt
```

#### Set up environment variables
Create a `.env` file in the root directory:
```env
SECRET_KEY=your-secret-key-here-change-this-in-production
DEBUG=True
GEMINI_API_KEY=your-gemini-api-key-here
```

#### Run Django migrations
```bash
python manage.py migrate
```

#### Create a superuser (optional)
```bash
python manage.py createsuperuser
```

#### Start the Django development server
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Install Node.js dependencies
```bash
npm install
```

#### Start the development server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Chat
- `GET /api/chat/` - Get chat history
- `POST /api/chat/` - Send message and get AI response
- `DELETE /api/chat/clear/` - Clear chat history

## Getting a Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

## Usage

1. Start both the backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Register a new account or login with existing credentials
4. Start chatting with the AI!

## Project Structure

```
project3/
├── backend/                 # Django project
│   ├── settings.py         # Django settings
│   ├── urls.py             # Main URL configuration
│   └── wsgi.py             # WSGI configuration
├── api/                    # Django app
│   ├── models.py           # Database models
│   ├── views.py            # API views
│   ├── serializers.py      # Data serializers
│   ├── services.py         # Gemini AI service
│   └── urls.py             # API URLs
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── services/           # API service
│   └── types/              # TypeScript types
├── requirements.txt        # Python dependencies
├── package.json            # Node.js dependencies
└── README.md              # This file
```

## Development

### Backend Development
- The Django admin interface is available at `http://localhost:8000/admin/`
- Use the superuser account to access the admin panel
- Check Django logs for debugging

### Frontend Development
- The app uses Vite for fast development
- Hot module replacement is enabled
- TypeScript provides type safety

## Production Deployment

### Backend
- Set `DEBUG=False` in production
- Use a production database (PostgreSQL/MySQL)
- Set up proper CORS settings
- Use environment variables for sensitive data
- Consider using Gunicorn or uWSGI

### Frontend
- Build the app: `npm run build`
- Serve static files with a web server (Nginx/Apache)
- Set up proper CORS headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your Google Gemini API key is correct
3. Ensure both servers are running
4. Check the Django logs for backend errors 