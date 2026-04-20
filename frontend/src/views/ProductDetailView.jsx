import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaStar, FaChevronLeft, FaMinus, FaPlus, FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion'; // ADDED: Framer Motion for advanced animations
import { addToCart } from '../store/slices/cartSlice';
import { fetchProductDetails, fetchProductsByCategory } from '../store/slices/productSlice';

const ProductDetailView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('REGULAR');
  const [extras, setExtras] = useState([]);

  const { singleProduct, items, isLoading } = useSelector(state => state.products);
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
      window.scrollTo(0, 0); // scroll to top when product changes
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (singleProduct?.category) {
      dispatch(fetchProductsByCategory({ category: singleProduct.category }));
    }
  }, [singleProduct?.category, dispatch]);

  // Wait for data
  if (isLoading || !singleProduct) {
    return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading product...</div>;
  }

  const productExtras = [
    { name: 'Extra Dip', price: 29 },
    { name: 'Toppings', price: 49 },
    { name: 'Add Beverage', price: 89 }
  ];

  const toggleExtra = (extra) => {
    if (extras.includes(extra.name)) {
      setExtras(extras.filter(e => e !== extra.name));
    } else {
      setExtras([...extras, extra.name]);
    }
  };

  const totalPrice = singleProduct.price * quantity + (extras.length * 50);

  const similarItems = items.filter(item => item._id !== singleProduct._id).slice(0, 4);

  /* ADVANCED ANIMATION: Defined framer motion variants for staggered entry and smooth sliding transitions */
  const parentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 } 
    }
  };

  const slideRightVariant = {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const slideLeftVariant = {
    hidden: { opacity: 0, x: 80 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const slideUpVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-10">
          <h1 className="text-xl font-black italic tracking-tighter cursor-pointer" onClick={() => navigate('/home')}>NOCTURNAL PULSE</h1>
          <div className="hidden md:flex gap-6 text-[10px] font-black tracking-widest text-gray-400">
            <a href="#" className="text-neon-purple border-b-2 border-neon-purple pb-1">MENU</a>
            <a href="#" className="hover:text-white">DISCOVER</a>
            <a href="#" className="hover:text-white">VENUES</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer" onClick={() => navigate('/checkout')}>
            <FaShoppingCart className="text-xl text-gray-400 hover:text-white" />
            {cartItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-neon-purple text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{cartItems.length}</span>
            )}
          </div>
        </div>
      </nav>

      <motion.main 
        variants={parentVariants} 
        initial="hidden" 
        animate="visible" 
        className="px-6 md:px-20 py-10"
      >
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* ADVANCED ANIMATION: Slide right for main image */}
          {/* Left: Product Image */}
          <motion.div variants={slideRightVariant} className="w-full lg:w-1/2 relative group">
            <div className="bg-gradient-to-br from-card-bg to-black rounded-[3rem] border border-white/5 relative overflow-hidden h-[500px] md:h-[650px] flex items-center justify-center">
              <div className="absolute top-8 left-8 z-10 bg-green-500/20 text-green-400 px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-bold border border-green-500/30">
                <FaFire /> TRENDING NOW
              </div>
              <img src={singleProduct.image || 'https://placehold.co/500x500'} alt={singleProduct.name} className="w-full h-full object-cover" />
              
              <div className="absolute bottom-8 right-8 z-10 bg-black/60 backdrop-blur-xl p-4 rounded-3xl border border-white/5 text-center">
                <p className="text-[8px] text-gray-500 font-bold mb-1 uppercase tracking-widest">Type</p>
                <p className={`text-sm font-black italic ${singleProduct.isVeg ? 'text-green-500' : 'text-red-500'}`}>
                  {singleProduct.isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
                </p>
              </div>
            </div>
            {/* Visual glow */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-neon-purple/20 blur-[150px] opacity-50"></div>
          </motion.div>

          {/* ADVANCED ANIMATION: Slide left for main content */}
          {/* Right: Product Details */}
          <motion.div variants={slideLeftVariant} className="w-full lg:w-1/2">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-tight tracking-tighter">
                {singleProduct.title || singleProduct.name}
              </h1>
              <div className="text-right ml-4">
                <p className="text-4xl font-black italic text-neon-purple leading-none">₹{singleProduct.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-yellow-500 text-xs">
                 {[...Array(5)].map((_, i) => <FaStar key={i} fill={i < Math.floor(singleProduct.rating || 4) ? 'currentColor' : 'none'} stroke="currentColor" />)}
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{singleProduct.rating || '4.5'} • {singleProduct.numReviews || '24'} Reviews</p>
            </div>

            <p className="text-gray-400 text-sm md:text-md leading-relaxed mb-10 font-semibold max-w-xl">
              {singleProduct.description}
            </p>

            {/* Features (Dynamic mapping for aesthetic design) */}
            <div className="grid grid-cols-4 gap-4 mb-10">
                 <div className="bg-[#1a1a24] p-4 rounded-2xl border border-white/5 text-center group hover:bg-[#232332] transition-colors cursor-default">
                    <p className="text-2xl mb-1">👨‍🍳</p>
                    <p className="text-[8px] text-gray-500 font-black tracking-widest uppercase">PREMIUM</p>
                 </div>
                 <div className="bg-[#1a1a24] p-4 rounded-2xl border border-white/5 text-center group hover:bg-[#232332] transition-colors cursor-default">
                    <p className="text-2xl mb-1">🔥</p>
                    <p className="text-[8px] text-gray-500 font-black tracking-widest uppercase">HOT</p>
                 </div>
                 <div className="bg-[#1a1a24] p-4 rounded-2xl border border-white/5 text-center group hover:bg-[#232332] transition-colors cursor-default">
                    <p className="text-2xl mb-1">✨</p>
                    <p className="text-[8px] text-gray-500 font-black tracking-widest uppercase">FRESH</p>
                 </div>
                 <div className="bg-[#1a1a24] p-4 rounded-2xl border border-white/5 text-center group hover:bg-[#232332] transition-colors cursor-default">
                    <p className="text-2xl mb-1">{singleProduct.isVeg ? '🟢' : '🔴'}</p>
                    <p className="text-[8px] text-gray-500 font-black tracking-widest uppercase">{singleProduct.isVeg ? 'VEG' : 'NON-VEG'}</p>
                 </div>
            </div>

            {/* Customization */}
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black tracking-widest text-gray-500 mb-4 uppercase">Choose Your Spice Level</p>
                <div className="flex gap-3">
                  {['MILD', 'MEDIUM', 'HOT', 'EXTRA HOT'].map(level => (
                    <button 
                      key={level}
                      onClick={() => setSelectedSize(level)}
                      className={`px-6 py-2 rounded-full text-[8px] font-black transition-all border ${selectedSize === level ? 'bg-neon-purple border-neon-purple shadow-[0_0_15px_rgba(193,62,255,0.4)]' : 'border-gray-800 text-gray-500'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black tracking-widest text-gray-500 mb-4 uppercase">Midnight Extras</p>
                <div className="space-y-3">
                  {productExtras.map(extra => (
                    <div 
                      key={extra.name}
                      onClick={() => toggleExtra(extra)}
                      className="flex items-center justify-between bg-black/40 border border-white/5 p-4 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${extras.includes(extra.name) ? 'bg-neon-purple border-neon-purple' : 'border-gray-800'}`}>
                          {extras.includes(extra.name) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <span className="text-xs font-bold text-gray-300">{extra.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-neon-purple">+₹{extra.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 mt-12 bg-[#1a1a24] p-2 rounded-[2rem] w-fit sm:w-full border border-white/5">
              <div className="flex items-center bg-black/40 rounded-2xl p-2 gap-4 ml-2">
                <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="p-3 text-gray-500 hover:text-white transition-colors"><FaMinus /></button>
                <span className="text-xl font-black w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity+1)} className="p-3 text-gray-500 hover:text-white transition-colors"><FaPlus /></button>
              </div>
              <button 
                onClick={() => dispatch(addToCart({ ...singleProduct, quantity, id: singleProduct._id }))}
                className="flex-1 bg-lime-500 hover:bg-lime-400 text-black font-black italic text-sm py-5 px-10 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(132,204,22,0.3)]"
              >
                ADD TO CART <FaShoppingCart />
              </button>
            </div>

          </motion.div>
        </div>

        {/* ADVANCED ANIMATION: Slide up for the similar items section */}
        {/* Similar Items Section */}
        <motion.section variants={slideUpVariant} className="mt-32">
          <div className="flex justify-between items-end mb-12">
             <div>
               <h2 className="text-3xl font-black italic uppercase">Similar Foods</h2>
               <p className="text-gray-500 text-sm">You might also enjoy these selections.</p>
             </div>
             <button onClick={() => navigate(`/category/${singleProduct.category.toLowerCase().replace(' ', '-')}`)} className="text-[10px] font-black text-gray-400 hover:text-white transition-colors py-2 border-b border-gray-800">VIEW ALL {singleProduct.category}</button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {similarItems.length > 0 ? (
              similarItems.map(item => (
                <div key={item._id} onClick={() => navigate(`/product/${item._id}`)} className="relative group rounded-3xl overflow-hidden cursor-pointer h-64 border border-white/5 bg-[#121212]">
                  <img src={item.image || 'https://placehold.co/500x500'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <h4 className="text-sm font-black italic tracking-tighter mb-1">{item.title || item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${item.isVeg ? 'border-green-500/50 text-green-500' : 'border-red-500/50 text-red-500'}`}>
                          {item.isVeg ? 'VEG' : 'NON-VEG'}
                       </span>
                      <p className="text-xs font-black text-neon-purple">₹{item.price}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 italic">No similar products available yet...</p>
            )}
          </div>
        </motion.section>
      </motion.main>

      <footer className="px-10 py-20 border-t border-gray-900 mt-20">
         <div className="flex justify-between items-center mb-10">
            <h1 className="text-xl font-black italic">NOCTURNAL PULSE</h1>
            <div className="flex gap-8 text-[10px] font-black text-gray-500 tracking-widest uppercase">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            </div>
         </div>
         <p className="text-[8px] text-gray-800 font-bold tracking-[0.3em]">© 2026 NOCTURNAL PULSE • FEED YOUR HUNGER • THE NIGHT IS YOUNG AND SO IS THE FLAVOR</p>
      </footer>
    </div>
  );
};

export default ProductDetailView;
