import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext.jsx';
import { toast } from 'react-toastify';
 
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState('');
  const { setToken, email, setEmail } = useContext(AppContext);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const endpoint = isLogin ? 'login' : 'signup';
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/${endpoint}`, {
        email,
        password,
      });

      const receivedToken = res.data.token;
      setLoading(false);
      setToken(receivedToken);
      localStorage.setItem('token', receivedToken);
      navigate('/');
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error:", error);
      toast.error('Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 bg-[url('/types-of-scholarship-for-students.webp')] bg-cover bg-center">
      <div className="bg-white/90 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-purple-600 text-center mb-2">QuickScholar</h1>
        <h2 className="text-lg text-center text-gray-700 mb-6">
          {isLogin ? 'Welcome Back!' : 'Create an Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className={`w-full cursor-pointer bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 transition ${loading?'opacity-90 pointer-events-none':''}`}
          >
            {loading ? (isLogin ? 'Login...' : 'Sign Up...') : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            className="text-purple-600 font-medium cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
