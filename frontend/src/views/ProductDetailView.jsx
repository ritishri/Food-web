import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaShoppingCart, FaStar, FaMinus, FaPlus, FaFire } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { addToCart, addToCartAPI } from '../store/slices/cartSlice';
import { fetchProductDetails, fetchProductsByCategory } from '../store/slices/productSlice';

const ProductDetailView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('MILD');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const { singleProduct, items, isLoading } = useSelector(state => state.products);
  const cartItems = useSelector(state => state.cart.items);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
      window.scrollTo(0, 0);
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (singleProduct?.category) {
      dispatch(fetchProductsByCategory({ category: singleProduct.category }));
    }
  }, [singleProduct?.category, dispatch]);

  if (isLoading || !singleProduct) {
    return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading product...</div>;
  }

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCartAPI({ productId: singleProduct._id, quantity, spiceLevel: selectedSize, extras: [] }));
    } else {
      dispatch(addToCart({ ...singleProduct, quantity, id: singleProduct._id }));
    }
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const similarItems = items.filter(item => item._id !== singleProduct._id).slice(0, 4);

  const parentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const slideRightVariant = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };
  const slideLeftVariant = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };
  const slideUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-black italic tracking-tighter cursor-pointer" onClick={() => navigate('/home')}>NOCTURNAL PULSE</h1>
          <div className="hidden md:flex gap-6 text-[10px] font-black tracking-widest text-gray-400">
            <a href="#" className="text-neon-purple border-b-2 border-neon-purple pb-1">MENU</a>
            <a href="#" className="hover:text-white">DISCOVER</a>
            <a href="#" className="hover:text-white">VENUES</a>
          </div>
        </div>
        <div className="relative cursor-pointer" onClick={() => navigate('/checkout')}>
          <FaShoppingCart className="text-xl text-gray-400 hover:text-white" />
          {cartItems?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-neon-purple text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{cartItems.length}</span>
          )}
        </div>
      </nav>

      <motion.main
        variants={parentVariants}
        initial="hidden"
        animate="visible"
        className="px-6 md:px-16 py-6"
      >
        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Left: Product Image */}
          <motion.div variants={slideRightVariant} className="w-full lg:w-[42%] relative">
            <div className="bg-gradient-to-br from-card-bg to-black rounded-3xl border border-white/5 relative overflow-hidden h-[320px] md:h-[400px] flex items-center justify-center">
              <div className="absolute top-4 left-4 z-10 bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-1 text-[9px] font-bold border border-green-500/30">
                <FaFire /> TRENDING NOW
              </div>
              <img
                src={singleProduct.image || 'https://placehold.co/400x400'}
                alt={singleProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-xl px-3 py-2 rounded-2xl border border-white/5 text-center">
                <p className="text-[7px] text-gray-500 font-bold mb-0.5 uppercase tracking-widest">Type</p>
                <p className={`text-xs font-black italic ${singleProduct.isVeg ? 'text-green-500' : 'text-red-500'}`}>
                  {singleProduct.isVeg ? 'VEGETARIAN' : 'NON-VEGETARIAN'}
                </p>
              </div>
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-neon-purple/20 blur-[120px] opacity-40"></div>
          </motion.div>

          {/* Right: Product Details */}
          <motion.div variants={slideLeftVariant} className="w-full lg:w-[58%]">
            <div className="flex justify-between items-start mb-3">
              <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-tight tracking-tighter">
                {singleProduct.title || singleProduct.name}
              </h1>
              <p className="text-2xl font-black italic text-neon-purple ml-4 shrink-0">₹{singleProduct.price}</p>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-yellow-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} fill={i < Math.floor(singleProduct.rating || 4) ? 'currentColor' : 'none'} stroke="currentColor" />
                ))}
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {singleProduct.rating || '4.5'} • {singleProduct.numReviews || '24'} Reviews
              </p>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-lg">
              {singleProduct.description}
            </p>

            {/* Feature badges */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { icon: '👨‍🍳', label: 'PREMIUM' },
                { icon: '🔥', label: 'HOT' },
                { icon: '✨', label: 'FRESH' },
                { icon: singleProduct.isVeg ? '🟢' : '🔴', label: singleProduct.isVeg ? 'VEG' : 'NON-VEG' },
              ].map(({ icon, label }) => (
                <div key={label} className="bg-[#1a1a24] p-3 rounded-2xl border border-white/5 text-center hover:bg-[#232332] transition-colors">
                  <p className="text-xl mb-1">{icon}</p>
                  <p className="text-[8px] text-gray-500 font-black tracking-widest uppercase">{label}</p>
                </div>
              ))}
            </div>

            {/* Spice Level */}
            <div className="mb-6">
              <p className="text-[10px] font-black tracking-widest text-gray-500 mb-3 uppercase">Choose Your Spice Level</p>
              <div className="flex gap-2 flex-wrap">
                {['MILD', 'MEDIUM', 'HOT', 'EXTRA HOT'].map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedSize(level)}
                    className={`px-4 py-1.5 rounded-full text-[8px] font-black transition-all border ${selectedSize === level ? 'bg-neon-purple border-neon-purple shadow-[0_0_12px_rgba(193,62,255,0.4)]' : 'border-gray-800 text-gray-500'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex items-center gap-3 bg-[#1a1a24] p-2 rounded-[2rem] border border-white/5 w-fit">
              <div className="flex items-center bg-black/40 rounded-2xl p-1.5 gap-3 ml-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-500 hover:text-white transition-colors"><FaMinus /></button>
                <span className="text-lg font-black w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-gray-500 hover:text-white transition-colors"><FaPlus /></button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`font-black italic text-sm py-4 px-6 rounded-[1.5rem] transition-all flex items-center gap-2 whitespace-nowrap ${addedFeedback ? 'bg-green-400 text-black' : 'bg-lime-500 hover:bg-lime-400 text-black shadow-[0_0_25px_rgba(132,204,22,0.3)]'}`}
              >
                {addedFeedback ? 'ADDED ✓' : <><span>ADD TO CART</span> <FaShoppingCart /></>}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Similar Items */}
        <motion.section variants={slideUpVariant} className="mt-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black italic uppercase">Similar Foods</h2>
              <p className="text-gray-500 text-xs">You might also enjoy these.</p>
            </div>
            <button
              onClick={() => navigate(`/category/${singleProduct.category.toLowerCase().replace(' ', '-')}`)}
              className="text-[10px] font-black text-gray-400 hover:text-white transition-colors py-1 border-b border-gray-800"
            >
              VIEW ALL {singleProduct.category}
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {similarItems.length > 0 ? similarItems.map(item => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="relative group rounded-2xl overflow-hidden cursor-pointer h-52 border border-white/5 bg-[#121212]"
              >
                <img src={item.image || 'https://placehold.co/400x400'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <h4 className="text-sm font-black italic tracking-tighter mb-1">{item.title || item.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${item.isVeg ? 'border-green-500/50 text-green-500' : 'border-red-500/50 text-red-500'}`}>
                      {item.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                    <p className="text-xs font-black text-neon-purple">₹{item.price}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-600 italic col-span-4">No similar products available yet...</p>
            )}
          </div>
        </motion.section>
      </motion.main>

      <footer className="px-8 py-12 border-t border-gray-900 mt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-black italic">NOCTURNAL PULSE</h1>
          <div className="flex gap-6 text-[10px] font-black text-gray-500 tracking-widest uppercase">
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
