import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-200 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? <LoginForm /> : <SignupForm />}
        
        <div className="mt-6 text-center">
          <p className="text-white/90">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-200 hover:text-blue-100 font-medium transition-colors underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;