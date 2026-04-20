import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUserCircle, FaStar, FaChevronRight } from 'react-icons/fa';
import { addToCart } from '../store/slices/cartSlice';
import { logout } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const LandingView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const cartItems = useSelector(state => state.cart.items);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'biryani', name: 'BIRYANI', image: '/biryani.png' },
    { id: 'north-indian', name: 'NORTH INDIAN', image: '/paneer.png' },
    { id: 'south-indian', name: 'SOUTH INDIAN', image: '/dosa.png' },
    { id: 'burgers', name: 'BURGERS', image: '/burger.png' },
    { id: 'pizza', name: 'PIZZA', image: '/hero-pizza.png' },
    { id: 'sweets', name: 'SWEETS', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80' },
  ];

  const popularItems = [
    {
      id: 101,
      name: 'Signature Dum Biryani',
      price: 349,
      rating: 4.9,
      reviews: 1250,
      badge: 'Bestseller',
      image: '/biryani.png',
      desc: 'Authentic Hyderabadi dum biryani cooked with premium long-grain basmati rice and secret spices.'
    },
    {
      id: 102,
      name: 'Paneer Makhani Platter',
      price: 280,
      rating: 4.7,
      reviews: 890,
      badge: 'Trending',
      image: '/paneer.png',
      desc: 'Soft paneer cubes in a rich, buttery tomato gravy served with garlic naan.'
    },
    {
      id: 103,
      name: 'The Maharaja Burger',
      price: 199,
      rating: 4.8,
      reviews: 2100,
      image: '/burger.png',
      desc: 'Double patty veg supreme burger with masala fries and mint mayo.'
    }
  ];

  const handleCategoryClick = (id) => {
    navigate(`/category/${id}`);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-black italic tracking-tighter cursor-pointer" onClick={() => navigate('/home')}>NOCTURNAL PULSE</h1>
          {/* <div className="hidden md:flex gap-6 text-sm font-semibold text-gray-400">
            <a href="#" className="text-white">Home</a>
            <a href="#" className="hover:text-white transition-colors">Menu</a>
            <a href="#" className="hover:text-white transition-colors">Offers</a>
          </div> */}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Search cravings..."
              className="bg-[#1a1a24] border-none rounded-full py-2 pl-10 pr-4 text-xs w-64 focus:ring-1 focus:ring-neon-purple transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer" onClick={() => navigate('/checkout')}>
              <FaShoppingCart className="text-xl text-gray-300 hover:text-white" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-neon-purple text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 group relative">
              <FaUserCircle className="text-2xl text-gray-300 cursor-pointer hover:text-white" />
              {isAuthenticated && (
                <div className="hidden md:block">
                  <p className="text-[10px] font-bold text-gray-400">WELCOME</p>
                  <p className="text-xs font-black text-white">{user?.name?.toUpperCase()}</p>
                </div>
              )}
              {/* Simple logout tooltip/dropdown */}
              <div className="absolute top-full right-0 mt-2 w-40 bg-card-bg border border-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[100]">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'admin' && (
                      <button 
                        onClick={() => navigate('/admin')}
                        className="w-full text-left px-4 py-3 text-[10px] font-bold hover:bg-red-800 transition-all border-b border-gray-800 flex items-center gap-2"
                      >
                         ADMIN DASHBOARD
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        dispatch(logout());
                        navigate('/login');
                      }}
                      className="w-full text-left px-4 py-3 text-[10px] font-bold hover:bg-neon-purple transition-all"
                    >
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full text-left px-4 py-3 text-[10px] font-bold hover:bg-neon-purple transition-all"
                  >
                    LOGIN
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center px-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/biryani.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60 scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="bg-orange-600/20 text-orange-400 text-[10px] font-bold px-3 py-1 rounded-full mb-4 inline-block border border-orange-500/30">
            MIDNIGHT FEASTS • ALL OVER INDIA
          </span>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-tight mb-4 drop-shadow-2xl">
            INDIAN<br />CRAVINGS
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-md leading-relaxed">
            Spiced to perfection, delivered in silence. Experience the best of Indian cuisine when the moon is high.
          </p>
          <div className="flex gap-4">
            <button className="bg-neon-purple hover:bg-purple-600 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105">
              ORDER NOW
            </button>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold transition-all">
              VIEW MENU
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black italic mb-2 uppercase text-neon-purple">Explore Categories</h2>
            <p className="text-gray-500 text-sm">Masaledaar, Crispy, or Cheesy? Pick your mood.</p>
          </div>
          <button className="text-[10px] font-bold text-gray-500 flex items-center gap-1 hover:text-white transition-colors">
            VIEW ALL <FaChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer border border-gray-900 hover:border-neon-purple transition-colors"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:from-neon-purple/40 transition-all flex items-end p-4">
                <span className="text-xs font-black tracking-widest">{cat.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Near You */}
      <section className="py-20 px-10 bg-[#111115]/50">
        <div className="mb-12">
          <h2 className="text-3xl font-black italic mb-2 uppercase flex items-center gap-4">
            <span className="w-1 h-8 bg-neon-purple inline-block"></span>
            Popular Near You
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {popularItems.map((item) => (
            <div key={item.id} className="bg-card-bg rounded-[2.5rem] overflow-hidden border border-gray-900 group transition-all hover:bg-[#1a1a28]">
              <div className="relative h-64 cursor-pointer" onClick={() => handleProductClick(item.id)}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                {item.badge && (
                  <span className={`absolute top-6 left-6 text-[10px] font-bold px-3 py-1 rounded-full ${item.badge === 'Trending' ? 'bg-orange-600' : 'bg-neon-purple'} text-white`}>
                    {item.badge.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold cursor-pointer hover:text-neon-purple transition-colors" onClick={() => handleProductClick(item.id)}>{item.name}</h3>
                  <span className="text-xl font-black text-white">₹{item.price}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-neon-purple text-[10px]">
                    {[...Array(5)].map((_, i) => <FaStar key={i} fill={i < Math.floor(item.rating) ? 'currentColor' : 'none'} stroke="currentColor" />)}
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold">{item.rating} ({item.reviews} reviews)</span>
                </div>
                <p className="text-gray-500 text-xs mb-8 leading-relaxed h-12 overflow-hidden line-clamp-2">
                  {item.desc}
                </p>
                <button 
                  onClick={() => {
                    dispatch(addToCart(item));
                    toast.success(`${item.name} added to cart!`);
                  }}
                  className="w-full bg-[#111111] hover:bg-neon-purple text-[10px] font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join the Night Watch */}
      <section className="px-10 py-20">
        <div className="bg-[#1a1a24] rounded-[3rem] p-12 md:p-20 relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/20 blur-[120px] rounded-full"></div>
          <div className="relative z-10 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase mb-4 leading-tight">Join The Night Watch</h2>
            <p className="text-gray-400 mb-10 leading-relaxed font-semibold">
              Get exclusive 3 AM deals and secret menu access delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your Nocturnal Email" 
                className="flex-1 bg-black/40 border-none rounded-2xl py-4 px-6 focus:ring-1 focus:ring-neon-purple outline-none"
              />
              <button className="bg-neon-purple hover:bg-purple-600 px-8 py-4 rounded-2xl font-black italic transition-all whitespace-nowrap">
                SIGN UP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-10 pt-20 border-t border-gray-900">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
          <div className="max-w-xs">
            <h1 className="text-xl font-black italic mb-4">NOCTURNAL PULSE</h1>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold uppercase tracking-wider">
              Elevating the after-hours dining experience with premium curation and lightning fast nocturnal logistics.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[10px] font-black text-gray-500 tracking-widest uppercase">
            <div className="space-y-4">
              <a href="#" className="block hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block hover:text-white transition-colors">Terms of Service</a>
            </div>
            <div className="space-y-4">
              <a href="#" className="block hover:text-white transition-colors">Contact Support</a>
              <a href="#" className="block hover:text-white transition-colors">Restaurant Portal</a>
            </div>
          </div>
        </div>
        <div className="text-[8px] text-gray-700 font-bold uppercase tracking-[0.2em]">
          © 2026 NOCTURNAL PULSE • FEED YOUR HUNGER
        </div>
      </footer>
    </div>
  );
};

export default LandingView;
