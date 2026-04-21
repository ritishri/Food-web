import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaPlus, FaMinus, FaHome, FaCreditCard, FaPaypal, FaEdit, FaMapMarkerAlt, FaCheck, FaBriefcase, FaLock } from 'react-icons/fa';
import { removeFromCart, removeFromCartAPI, updateCartItemAPI, clearCartAPI } from '../store/slices/cartSlice';
import { addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../store/slices/addressSlice';
import { toast } from 'react-toastify';

const EMPTY_FORM = { label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false };

const validate = (form) => {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required';
  else if (form.fullName.trim().length < 3) errors.fullName = 'Min 3 characters';

  if (!form.phone.trim()) errors.phone = 'Phone is required';
  else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) errors.phone = 'Enter valid 10-digit mobile number';

  if (!form.line1.trim()) errors.line1 = 'Address line 1 is required';

  if (!form.city.trim()) errors.city = 'City is required';
  else if (!/^[a-zA-Z\s]+$/.test(form.city.trim())) errors.city = 'City must contain only letters';

  if (!form.state.trim()) errors.state = 'State is required';
  else if (!/^[a-zA-Z\s]+$/.test(form.state.trim())) errors.state = 'State must contain only letters';

  if (!form.pincode.trim()) errors.pincode = 'Pincode is required';
  else if (!/^\d{6}$/.test(form.pincode.trim())) errors.pincode = 'Enter valid 6-digit pincode';

  return errors;
};

const Field = ({ value, onChange, placeholder, error, className = '' }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input-field ${error ? 'border-red-500/60 focus:border-red-500' : ''}`}
    />
    {error && <span className="text-red-400 text-[9px] font-bold pl-1">{error}</span>}
  </div>
);

const AddressForm = ({ initial = EMPTY_FORM, onSave, onCancel }) => {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#111118] border border-white/10 rounded-[2rem] p-6 space-y-4 mt-4">
      {/* Label selector */}
      <div className="flex gap-3 mb-2">
        {['Home', 'Work', 'Other'].map(l => (
          <button type="button" key={l} onClick={() => set('label', l)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black border transition-all ${form.label === l ? 'bg-neon-purple border-neon-purple text-white' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
            {l === 'Home' ? <FaHome /> : l === 'Work' ? <FaBriefcase /> : <FaMapMarkerAlt />} {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Full Name *" error={errors.fullName} />
        <Field value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Phone Number *" error={errors.phone} />
        <Field value={form.line1} onChange={e => set('line1', e.target.value)} placeholder="Address Line 1 *" error={errors.line1} className="sm:col-span-2" />
        <div className="sm:col-span-2">
          <input value={form.line2} onChange={e => set('line2', e.target.value)} placeholder="Address Line 2 (optional)" className="input-field" />
        </div>
        <Field value={form.city} onChange={e => set('city', e.target.value)} placeholder="City *" error={errors.city} />
        <Field value={form.state} onChange={e => set('state', e.target.value)} placeholder="State *" error={errors.state} />
        <Field value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="Pincode *" error={errors.pincode} />
      </div>

      <label className="flex items-center gap-3 cursor-pointer mt-2">
        <div onClick={() => set('isDefault', !form.isDefault)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.isDefault ? 'bg-neon-purple border-neon-purple' : 'border-gray-700'}`}>
          {form.isDefault && <FaCheck className="text-white text-[8px]" />}
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Set as default address</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="bg-neon-purple hover:bg-purple-600 text-white font-black text-xs px-6 py-3 rounded-xl transition-all">SAVE ADDRESS</button>
        <button type="button" onClick={onCancel} className="bg-white/5 hover:bg-white/10 text-gray-400 font-black text-xs px-6 py-3 rounded-xl transition-all">CANCEL</button>
      </div>
    </form>
  );
};

const CheckoutView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const { user } = useSelector(state => state.auth);
  const { list: addresses, isLoading: addrLoading } = useSelector(state => state.addresses);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Resolve selected address: explicit selection > default > first
  const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
  const selectedAddr = addresses.find(a => a._id === selectedAddressId) || defaultAddr;

  const handleRemove = (item) => {
    const productId = item._id || item.id;
    if (user) dispatch(removeFromCartAPI(productId));
    else dispatch(removeFromCart(productId));
    toast.info('Item removed');
  };

  const handleQtyChange = (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty <= 0) { handleRemove(item); return; }
    if (user) dispatch(updateCartItemAPI({ productId: item._id || item.id, quantity: newQty }));
  };

  const handleSaveNew = (form) => {
    dispatch(addAddress(form)).then(() => { toast.success('Address saved!'); setShowAddForm(false); });
  };

  const handleSaveEdit = (form) => {
    dispatch(updateAddress({ id: editingId, data: form })).then(() => { toast.success('Address updated!'); setEditingId(null); });
  };

  const handleDelete = (id) => {
    dispatch(deleteAddress(id)).then(() => toast.info('Address removed'));
    if (selectedAddressId === id) setSelectedAddressId(null);
  };

  const handleSetDefault = (id) => {
    dispatch(setDefaultAddress(id)).then(() => toast.success('Default address updated'));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (!selectedAddr) { toast.error('Please select a delivery address'); return; }
    if (cartItems.length === 0) { toast.error('Your cart is empty'); return; }

    if (paymentMethod === 'cod') {
      toast.success('Order placed! Pay on delivery.');
      dispatch(clearCartAPI());
      navigate('/home');
      return;
    }

    setIsProcessing(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      // 1. Create order on backend
      const { data } = await axios.post(
        'http://localhost:5001/api/v1/payment/create-order',
        { amount: total },
        config
      );

      // 2. Open Razorpay popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Nocturnal Pulse',
        description: 'Midnight Cravings Order',
        image: '/favicon.svg',
        handler: async (response) => {
          try {
            // 3. Verify on backend
            const verify = await axios.post(
              'http://localhost:5001/api/v1/payment/verify',
              response,
              config
            );
            if (verify.data.success) {
              toast.success('Payment successful! Order placed.');
              dispatch(clearCartAPI());
              navigate('/home');
            }
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: selectedAddr.phone,
        },
        notes: {
          address: `${selectedAddr.line1}, ${selectedAddr.city}`,
        },
        theme: { color: '#c13eff' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      setIsProcessing(false);
    }
  };

  const labelIcon = (label) => label === 'Work' ? <FaBriefcase /> : label === 'Other' ? <FaMapMarkerAlt /> : <FaHome />;

  return (
    <div className="bg-black min-h-screen text-white font-sans py-10 px-6 md:px-20">
      <style>{`.input-field { background: #0d0d14; border: 1px solid rgba(255,255,255,0.08); border-radius: 0.75rem; padding: 0.75rem 1rem; font-size: 0.75rem; color: white; width: 100%; outline: none; transition: border-color 0.2s; } .input-field:focus { border-color: rgba(193,62,255,0.5); } .input-field::placeholder { color: #4b5563; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.65rem; }`}</style>

      <nav className="flex items-center justify-between mb-16 px-4">
        <h1 className="text-xl font-black italic tracking-tighter cursor-pointer" onClick={() => navigate('/home')}>NOCTURNAL PULSE</h1>
        <span className="cursor-pointer hover:text-white text-[10px] font-black tracking-widest text-gray-500" onClick={() => navigate('/home')}>HOME</span>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-2">Midnight Cravings</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Review your late-night indulgence</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-14">

            {/* Cart Items */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-neon-purple/20 rounded-lg"><FaPlus className="text-neon-purple text-xs" /></div>
                <h2 className="text-lg font-black uppercase tracking-widest italic">Your Selection</h2>
              </div>
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="bg-card-bg p-12 rounded-3xl border border-dashed border-gray-800 text-center">
                    <p className="text-gray-500 italic">Your cart is empty.</p>
                    <button onClick={() => navigate('/home')} className="mt-4 text-neon-purple font-black text-xs hover:underline uppercase">Back to Menu</button>
                  </div>
                ) : cartItems.map((item, idx) => (
                  <div key={item._id || item.id || idx} className="bg-card-bg p-6 rounded-[2rem] border border-white/5 flex items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl overflow-hidden border border-gray-800 shrink-0">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-base font-bold">{item.title || item.name}</h3>
                        <span className="font-black italic">₹{(item.price * (item.quantity || 1)).toFixed(0)}</span>
                      </div>
                      {item.spiceLevel && <p className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-2">Spice: {item.spiceLevel}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-black/40 rounded-xl p-1 gap-3">
                          <button onClick={() => handleQtyChange(item, -1)} className="p-1.5 text-gray-500 hover:text-white"><FaMinus className="text-[9px]" /></button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity || 1}</span>
                          <button onClick={() => handleQtyChange(item, 1)} className="p-1.5 text-gray-500 hover:text-white"><FaPlus className="text-[9px]" /></button>
                        </div>
                        <button onClick={() => handleRemove(item)} className="text-red-500/40 hover:text-red-500 transition-colors p-2"><FaTrash /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Address */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-lime-500/10 rounded-lg"><FaMapMarkerAlt className="text-lime-500 text-xs" /></div>
                  <h2 className="text-lg font-black uppercase tracking-widest italic">Delivery Address</h2>
                </div>
                {!showAddForm && (
                  <button onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 text-[10px] font-black text-neon-purple border border-neon-purple/40 hover:bg-neon-purple/10 px-4 py-2 rounded-full transition-all">
                    <FaPlus /> ADD NEW
                  </button>
                )}
              </div>

              {/* Saved addresses list */}
              {addrLoading ? (
                <p className="text-gray-500 text-xs">Loading addresses...</p>
              ) : addresses.length === 0 && !showAddForm ? (
                <div className="bg-card-bg p-10 rounded-3xl border border-dashed border-gray-800 text-center">
                  <FaMapMarkerAlt className="text-gray-700 text-3xl mx-auto mb-3" />
                  <p className="text-gray-500 text-sm italic mb-4">No saved addresses yet.</p>
                  <button onClick={() => setShowAddForm(true)}
                    className="bg-neon-purple hover:bg-purple-600 text-white font-black text-xs px-6 py-3 rounded-xl transition-all">
                    + ADD ADDRESS
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <div key={addr._id}>
                      {editingId === addr._id ? (
                        <AddressForm
                          initial={{ label: addr.label, fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2 || '', city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault }}
                          onSave={handleSaveEdit}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <div
                          onClick={() => setSelectedAddressId(addr._id)}
                          className={`relative p-5 rounded-[1.5rem] border cursor-pointer transition-all ${selectedAddr?._id === addr._id ? 'border-neon-purple bg-neon-purple/5 shadow-[0_0_20px_rgba(193,62,255,0.1)]' : 'border-white/5 bg-card-bg hover:border-gray-700'}`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Radio */}
                            <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedAddr?._id === addr._id ? 'border-neon-purple' : 'border-gray-600'}`}>
                              {selectedAddr?._id === addr._id && <div className="w-2 h-2 rounded-full bg-neon-purple" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lime-400 text-xs">{labelIcon(addr.label)}</span>
                                <span className="text-xs font-black uppercase tracking-widest">{addr.label}</span>
                                {addr.isDefault && (
                                  <span className="bg-lime-500/20 text-lime-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-lime-500/30">DEFAULT</span>
                                )}
                              </div>
                              <p className="text-sm font-bold text-white">{addr.fullName} · {addr.phone}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                              {!addr.isDefault && (
                                <button onClick={() => handleSetDefault(addr._id)}
                                  className="text-[8px] font-black text-gray-500 hover:text-lime-400 border border-gray-700 hover:border-lime-500/50 px-2 py-1 rounded-lg transition-all uppercase tracking-wider">
                                  Set Default
                                </button>
                              )}
                              <button onClick={() => { setEditingId(addr._id); setShowAddForm(false); }}
                                className="p-2 text-gray-500 hover:text-white transition-colors"><FaEdit className="text-xs" /></button>
                              <button onClick={() => handleDelete(addr._id)}
                                className="p-2 text-red-500/40 hover:text-red-500 transition-colors"><FaTrash className="text-xs" /></button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add new form */}
              {showAddForm && (
                <AddressForm onSave={handleSaveNew} onCancel={() => setShowAddForm(false)} />
              )}
            </section>

            {/* Payment */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/10 rounded-lg"><FaCreditCard className="text-orange-500 text-xs" /></div>
                <h2 className="text-lg font-black uppercase tracking-widest italic">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'razorpay', name: 'Razorpay', sub: 'Card / UPI / NetBanking', icon: <FaCreditCard /> },
                  { id: 'upi', name: 'UPI', sub: 'GPay / PhonePe / Paytm', icon: <FaPaypal /> },
                  { id: 'cod', name: 'Cash on Delivery', sub: 'Pay when delivered', icon: <FaHome /> },
                ].map((p) => (
                  <button key={p.id} onClick={() => setPaymentMethod(p.id)}
                    className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all ${paymentMethod === p.id ? 'bg-[#1a1a2b] border-neon-purple shadow-[0_0_20px_rgba(193,62,255,0.15)]' : 'bg-card-bg border-white/5 hover:border-gray-700'}`}>
                    <div className={`text-2xl mb-2 ${paymentMethod === p.id ? 'text-neon-purple' : 'text-gray-400'}`}>{p.icon}</div>
                    <span className="text-[10px] font-black tracking-widest uppercase">{p.name}</span>
                    <span className="text-[8px] text-gray-500 mt-1">{p.sub}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1a1a24] p-10 rounded-[3rem] border border-white/5 sticky top-28">
              <h2 className="text-2xl font-black italic uppercase mb-8">Order Summary</h2>

              {/* Selected address preview */}
              {selectedAddr && (
                <div className="bg-black/30 rounded-2xl p-4 mb-8 border border-white/5">
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1"><FaMapMarkerAlt className="text-lime-500" /> Delivering to</p>
                  <p className="text-xs font-bold">{selectedAddr.fullName}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{selectedAddr.line1}, {selectedAddr.city}, {selectedAddr.state} – {selectedAddr.pincode}</p>
                </div>
              )}

              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-gray-400 text-sm font-semibold">
                  <span>Subtotal</span><span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm font-semibold">
                  <span>Delivery Fee</span><span className="text-lime-400 font-black italic text-[10px]">FREE</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm font-semibold">
                  <span>Tax (GST 5%)</span><span className="text-white">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-8 pt-8 border-t border-gray-800/50">
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Total</span>
                <span className="text-4xl font-black italic tracking-tighter text-neon-purple">₹{total.toFixed(2)}</span>
              </div>

              <div className="flex gap-2 p-2 bg-black/40 rounded-2xl mb-6 border border-white/5">
                <input type="text" placeholder="PROMO CODE" className="bg-transparent border-none flex-1 text-[10px] font-black px-4 outline-none uppercase text-white placeholder-gray-600" />
                <button className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all">Apply</button>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || !selectedAddr || isProcessing}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black italic py-5 rounded-2xl transition-all active:scale-[0.98] shadow-[0_20px_40px_rgba(249,115,22,0.2)] flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" /> PROCESSING...</span>
                ) : !selectedAddr ? 'ADD ADDRESS TO CONTINUE' : paymentMethod === 'cod' ? 'PLACE ORDER' : 'PAY NOW'}
              </button>

              <p className="text-center text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em] mt-5 flex items-center justify-center gap-1"><FaLock className="text-[8px]" /> SECURE ENCRYPTED CHECKOUT</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-32 pt-10 border-t border-gray-900 flex flex-col md:flex-row justify-between gap-6 opacity-30">
        <h1 className="text-sm font-black italic tracking-tighter">NOCTURNAL PULSE</h1>
        <div className="flex gap-6 text-[8px] font-black tracking-widest uppercase">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default CheckoutView;
