import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, reset } from '../store/slices/authSlice';
import { FaEye, FaEyeSlash, FaGoogle, FaApple, FaEnvelope, FaLock, FaUser, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LoginView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated || user) {
      if (user?.role === 'admin') {
        navigate('/admin');
        toast.success(`Welcome back, Admin ${user.name}!`);
      } else {
        navigate('/home');
        toast.success(`Welcome back, ${user?.name}!`);
      }
    }

    if (isError) {
      toast.error(message);
    }

    dispatch(reset());
  }, [user, isAuthenticated, isError, message, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ name, email, password, role }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-card-bg rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side - Hero Section */}
        <div className="md:w-1/2 bg-black p-10 flex flex-col justify-between relative overflow-hidden h-[400px] md:h-auto">
          <div className="z-10">
            <h2 className="text-neon-purple font-black italic text-2xl mb-1">MIDNIGHT CRAVINGS</h2>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Editorial Culinary Experience</p>
          </div>
          
          <div className="z-10">
            <h1 className="text-white text-5xl md:text-6xl font-black uppercase leading-none mb-6">
              Midnight<br />
              <span className="text-red-800 drop-shadow-[0_0_10px_rgba(153,27,27,0.8)]">Craving</span>
            </h1>
            <p className="text-white text-2xl font-bold max-w-[250px] leading-tight">
              Feed your <span className="italic font-serif">hunger</span> when the city sleeps.
            </p>
          </div>

          <div className="absolute inset-0 opacity-20 bg-[url('/hero-pizza.png')] bg-cover bg-center"></div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Join the Club'}</h2>
            <p className="text-gray-400 mb-10 text-sm">
              {isLogin ? 'Sign in to access your late-night favorites.' : 'Register to start your culinary journey.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[#23232f] border-none rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-neon-purple transition-all outline-none"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Role</label>
                  <div className="relative">
                    <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#23232f] border-none rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-neon-purple transition-all outline-none appearance-none"
                    >
                      <option value="user">USER</option>
                      <option value="admin">ADMIN</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@pulse.com"
                    className="w-full bg-[#23232f] border-none rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-neon-purple transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase">Password</label>
                  {isLogin && <a href="#" className="text-[10px] text-orange-400 font-bold tracking-tight hover:underline">Forgot Password?</a>}
                </div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#23232f] border-none rounded-xl py-4 pl-12 pr-12 text-white focus:ring-2 focus:ring-neon-purple transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-neon-purple hover:bg-purple-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(193,62,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'PROCESSING...' : isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full border border-gray-700 hover:border-gray-500 text-white font-bold py-4 rounded-xl transition-all cursor-pointer"
                >
                  {isLogin ? 'NEED AN ACCOUNT?' : 'ALREADY HAVE AN ACCOUNT?'}
                </button>
              </div>
            </form>

            {isLogin && (
              <>
                <div className="flex items-center my-8">
                  <div className="flex-1 h-px bg-gray-800"></div>
                  <span className="mx-4 text-[10px] text-gray-600 font-bold tracking-widest">OR CONTINUE WITH</span>
                  <div className="flex-1 h-px bg-gray-800"></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 bg-[#23232f] hover:bg-gray-800 text-white py-3 rounded-xl transition-all font-semibold">
                    <FaGoogle className="text-red-500 text-xl" /> Google
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-[#23232f] hover:bg-gray-800 text-white py-3 rounded-xl transition-all font-semibold">
                    <FaApple className="text-white text-xl" /> Apple
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
