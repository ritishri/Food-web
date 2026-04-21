import React, { useEffect,useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaStar, FaFilter, FaSortAmountDown, FaChevronLeft } from 'react-icons/fa';
import { addToCart, addToCartAPI } from '../store/slices/cartSlice';
import { fetchProductsByCategory, reset } from '../store/slices/productSlice';
import { toast } from 'react-toastify';

const CategoryView = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const { items, isLoading, isError, message } = useSelector(state => state.products);
  const { user } = useSelector(state => state.auth);
  const [activeFilter, setActiveFilter] = useState('ALL ITEMS');

  const handleAddToCart = (item) => {
    if (user) {
      dispatch(addToCartAPI({ productId: item._id, quantity: 1 }));
    } else {
      dispatch(addToCart({ ...item, id: item._id }));
    }
    toast.success(`${item.name} added to cart!`);
  };


  console.log("items",items);
  

  useEffect(() => {
    if (categoryId) {
      const isVegParam = activeFilter === 'VEG ONLY' ? true : activeFilter === 'NON-VEG' ? false : undefined;
      dispatch(fetchProductsByCategory({ category: categoryId, isVeg: isVegParam }));
    }

    return () => {
      dispatch(reset());
    };
  }, [categoryId, dispatch, activeFilter]);

  const categoryTitles = {
    'biryani': 'AROMATIC BIRYANI',
    'north-indian': 'NORTH INDIAN DELIGHTS',
    'south-indian': 'SOUTH INDIAN',
    'burgers': 'GOURMET BURGERS',
    'pizza': 'AUTHENTIC PIZZAS',
    'sweets': 'SWEETS & DESSERTS',
    'drinks': 'REFRESHING DRINKS',
    'cakes': 'DELICIOUS CAKES'
  };

  const displayTitle = categoryTitles[categoryId] || categoryId?.replace('-', ' ').toUpperCase() || 'CATEGORY';

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-gray-900 sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <h1 className="text-xl font-black italic tracking-tighter cursor-pointer" onClick={() => navigate('/home')}>NOCTURNAL PULSE</h1>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input type="text" placeholder="Search cravings..." className="bg-[#1a1a24] rounded-full py-2 px-10 text-xs w-64 border-none" />
          </div>
          <div className="relative cursor-pointer" onClick={() => navigate('/checkout')}>
            <FaShoppingCart className="text-xl" />
            {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-neon-purple text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{cartItems.length}</span>}
          </div>
        </div>
      </nav>

      <main className="px-10 py-12">
        <div className="mb-10">
          <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold mb-6">
            <FaChevronLeft /> BACK TO EXPLORE
          </button>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-neon-purple text-[10px] font-black tracking-widest mb-2">PREMIUM SELECTION</p>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase">{displayTitle}</h1>
            </div>
            <div className="flex gap-4">
              <button className="bg-[#1a1a24] p-3 rounded-xl border border-gray-800 hover:border-gray-600"><FaFilter className="text-gray-400" /></button>
              <button className="bg-[#1a1a24] p-3 rounded-xl border border-gray-800 hover:border-gray-600"><FaSortAmountDown className="text-gray-400" /></button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {categoryId?.toLowerCase() !== 'sweets' && (
          <div className="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
            {['ALL ITEMS', 'VEG ONLY', 'NON-VEG'].map((filter, i) => (
              <button key={i} 
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-[10px] font-black transition-all whitespace-nowrap border ${activeFilter === filter ? 'bg-neon-purple border-neon-purple text-white' : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white'}`}>
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : isError ? (
            <p className="text-red-500">{message || 'Error occurred.'}</p>
          ) : items.length === 0 ? (
            <p className="text-gray-500">No products found in this category.</p>
          ) : (
            items.map((item) => (
              <div key={item._id} className="bg-card-bg rounded-[2.5rem] overflow-hidden border border-gray-900 group hover:border-neon-purple/50 transition-all duration-500">
                <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${item._id}`)}>
                  <img src={item.image || 'https://placehold.co/500x500?text=Food'} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                     <div className="flex items-center gap-1 text-[10px] font-bold">
                      <FaStar className="text-neon-purple" /> {item.rating || 'New'}
                     </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-3 h-3 border rounded-sm flex items-center justify-center ${item.isVeg ? 'border-green-500' : 'border-red-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                        <h3 className="text-xl font-bold group-hover:text-neon-purple transition-colors">{item.name}</h3>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="bg-neon-purple p-4 rounded-2xl hover:bg-purple-600 transition-all transform active:scale-90"
                    >
                      <FaShoppingCart className="text-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800/50">
                     <span className="text-2xl font-black italic">₹{item.price || 299}</span>
                     <button onClick={() => navigate(`/product/${item._id}`)} className="text-[10px] font-black tracking-widest text-gray-500 hover:text-white transition-colors">VIEW DETAILS</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-20 flex justify-center">
           <button className="bg-white/5 hover:bg-white/10 px-10 py-4 rounded-2xl font-black text-xs border border-white/5 transition-all">INDULGE FURTHER</button>
        </div>
      </main>
    </div>
  );
};

export default CategoryView;
