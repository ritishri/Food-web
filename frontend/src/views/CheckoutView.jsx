import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaHome, FaCreditCard, FaPaypal, FaBitcoin } from 'react-icons/fa';
import { removeFromCart } from '../store/slices/cartSlice';

const CheckoutView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const tax = subtotal * 0.05;
  const deliveryFee = 0; // Free for now
  const total = subtotal + tax + deliveryFee;

  return (
    <div className="bg-black min-h-screen text-white font-sans py-10 px-6 md:px-20">
      {/* Navbar Minimal */}
      <nav className="flex items-center justify-between mb-20 px-4">
        <h1 className="text-xl font-black italic tracking-tighter cursor-pointer" onClick={() => navigate('/home')}>NOCTURNAL PULSE</h1>
        <div className="flex gap-8 text-[10px] font-black tracking-widest text-gray-500">
           <span className="cursor-pointer hover:text-white" onClick={() => navigate('/home')}>HOME</span>
           <span className="cursor-pointer hover:text-white">CATEGORIES</span>
           <span className="cursor-pointer hover:text-white">ORDERS</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-gray-800 border border-gray-700"></div>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Midnight Cravings</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Review your late-night indulgence</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left: Your Selection, Address, Payment */}
          <div className="flex-1 space-y-16">
            
            {/* Items */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-2 bg-neon-purple/20 rounded-lg"><FaPlus className="text-neon-purple text-xs" /></div>
                 <h2 className="text-lg font-black uppercase tracking-widest italic">Your Selection</h2>
              </div>
              
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="bg-card-bg p-12 rounded-3xl border border-dashed border-gray-800 text-center">
                    <p className="text-gray-500 italic">Your cart is currently empty. Better find some snacks.</p>
                    <button onClick={() => navigate('/home')} className="mt-4 text-neon-purple font-black text-xs hover:underline uppercase">Back to Menu</button>
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={idx} className="bg-card-bg p-6 rounded-[2rem] border border-white/5 flex items-center gap-6 group">
                      <div className="h-24 w-24 rounded-2xl overflow-hidden border border-gray-800">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                           <h3 className="text-lg font-bold">{item.name}</h3>
                           <span className="text-lg font-black italic">₹{item.price}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-4">Extra Truffle Maya, No Onions</p>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center bg-black/40 rounded-xl p-1 gap-4">
                             <button className="p-2 text-gray-500 hover:text-white"><FaMinus className="text-[10px]" /></button>
                             <span className="text-sm font-bold w-4 text-center">01</span>
                             <button className="p-2 text-gray-500 hover:text-white"><FaPlus className="text-[10px]" /></button>
                           </div>
                           <button onClick={() => dispatch(removeFromCart(item.id))} className="text-red-500/50 hover:text-red-500 transition-colors p-2"><FaTrash /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Address */}
            <section>
              <div className="flex items-center gap-3 mb-8 text-lime-400">
                 <FaHome />
                 <h2 className="text-lg font-black uppercase tracking-widest italic text-white">Delivery Address</h2>
              </div>
              <div className="bg-card-bg p-8 rounded-[2rem] border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-[#1a1a2b] transition-colors">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-lime-500/10 rounded-2xl"><FaHome className="text-lime-500 text-xl" /></div>
                   <div>
                      <h4 className="font-bold flex items-center gap-2">Home (Primary)</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">742 Evergreen Terrace, Cyber City, 50710</p>
                   </div>
                </div>
                <button className="text-[8px] font-black tracking-widest text-gray-500 hover:text-white border-b border-gray-800">CHANGE</button>
              </div>
            </section>

            {/* Payment */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                 <div className="p-2 bg-orange-500/10 rounded-lg"><FaCreditCard className="text-orange-500 text-xs" /></div>
                 <h2 className="text-lg font-black uppercase tracking-widest italic">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {[
                   { id: 'card', name: 'Credit Card', icon: <FaCreditCard /> },
                   { id: 'paypal', name: 'PayPal', icon: <FaPaypal /> },
                   { id: 'crypto', name: 'Crypto', icon: <FaBitcoin /> }
                 ].map((p, idx) => (
                   <button key={p.id} className={`flex flex-col items-center justify-center p-8 rounded-[2rem] border transition-all ${idx === 0 ? 'bg-[#1a1a2b] border-neon-purple shadow-[0_0_20px_rgba(193,62,255,0.15)]' : 'bg-card-bg border-white/5 hover:border-gray-700'}`}>
                      <div className="text-2xl mb-3 text-gray-300">{p.icon}</div>
                      <span className="text-[10px] font-black tracking-widest uppercase">{p.name}</span>
                   </button>
                 ))}
              </div>
            </section>

          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1a1a24] p-10 rounded-[3rem] border border-white/5 sticky top-32">
               <h2 className="text-2xl font-black italic uppercase mb-8">Order Summary</h2>
               
               <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-gray-400 text-sm font-semibold">
                     <span>Subtotal</span>
                     <span className="text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm font-semibold">
                     <span>Delivery Fee</span>
                     <span className="text-lime-400 font-black italic tracking-widest text-[10px]">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm font-semibold">
                     <span>Tax (GST)</span>
                     <span className="text-white">₹{tax.toFixed(2)}</span>
                  </div>
               </div>

               <div className="flex justify-between items-end mb-10 pt-10 border-t border-gray-800/50">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500">Total</span>
                  <span className="text-5xl font-black italic tracking-tighter text-neon-purple">₹{total.toFixed(2)}</span>
               </div>

               <div className="flex gap-2 p-2 bg-black/40 rounded-2xl mb-8 border border-white/5">
                  <input type="text" placeholder="PROMO CODE" className="bg-transparent border-none flex-1 text-[10px] font-black px-4 outline-none uppercase" />
                  <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all">Apply</button>
               </div>

               <button className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-black font-black italic py-5 rounded-2xl transition-all transform active:scale-[0.98] shadow-[0_20px_40px_rgba(249,115,22,0.2)]">
                 PLACE ORDER
               </button>
               
               <p className="text-center text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-2">
                 🔒 SECURE ENCRYPTED CHECKOUT
               </p>
            </div>

            {/* Upsell */}
            <div className="mt-8 bg-black border border-gray-800 rounded-[2.5rem] p-8">
               <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black italic uppercase tracking-widest text-lime-400">Don't forget the sides</h4>
                  <div className="h-4 w-4 bg-lime-500/20 rounded-full flex items-center justify-center"><FaPlus className="text-lime-500 text-[8px]" /></div>
               </div>
               <div className="flex items-center gap-6">
                  <img src="https://images.unsplash.com/photo-1573016608964-f4b005fe6918?w=500" className="h-16 w-16 rounded-2xl object-cover grayscale" />
                  <div className="flex-1">
                     <p className="text-xs font-bold mb-1 uppercase tracking-tighter">Cyber-Fries</p>
                     <p className="text-sm font-black italic text-gray-400">₹149</p>
                  </div>
                  <button className="bg-lime-500 h-8 w-8 rounded-full flex items-center justify-center hover:bg-lime-400"><FaPlus className="text-black text-xs" /></button>
               </div>
            </div>
          </div>

        </div>
      </div>
      
      <footer className="mt-40 pt-10 border-t border-gray-900 flex flex-col md:flex-row justify-between gap-6 opacity-30">
          <h1 className="text-sm font-black italic tracking-tighter">NOCTURNAL PULSE</h1>
          <div className="flex gap-6 text-[8px] font-black tracking-widest uppercase">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
      </footer>
    </div>
  );
};

export default CheckoutView;
