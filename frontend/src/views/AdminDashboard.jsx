import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaTrash, FaEdit, FaBox, FaDollarSign, FaTag, FaImage, FaStar, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../store/slices/authSlice';
import { fetchProducts, createProduct, updateProduct, deleteProduct, reset } from '../store/slices/productSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    price: '',
    category: 'PIZZA',
    image: '',
    isTrending: false,
    isVeg: true
  });

  const { user } = useSelector((state) => state.auth);
  const { items: products, isLoading, isError, message } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;
    if (name === 'isVeg') {
      finalValue = value === 'true';
    }
    setFormData({
      ...formData,
      [name]: finalValue
    });
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      title: product.title || '',
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      isTrending: product.isTrending,
      isVeg: product.isVeg !== undefined ? product.isVeg : true
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      title: '',
      description: '',
      price: '',
      category: 'PIZZA',
      image: '',
      isTrending: false,
      isVeg: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await dispatch(updateProduct({ id: editingId, productData: formData })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await dispatch(createProduct(formData)).unwrap();
        toast.success('Product added successfully!');
      }
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast.error(error || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete product');
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.info('Logged out from Admin Panel');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              Admin <span className="text-red-800">Dashboard</span>
            </h1>
            <p className="text-gray-400 mt-2">Manage your midnight menu and inventory.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
              title="Go to Website"
            >
              <FaHome /> WEB
            </button>
            <button
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="bg-red-800 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(153,27,27,0.4)]"
            >
              <FaPlus /> ADD PRODUCT
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border border-gray-800"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Total Products</span>
              <FaBox className="text-red-800" />
            </div>
            <div className="text-3xl font-black">{products.length}</div>
          </div>
          <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Live Categories</span>
              <FaTag className="text-neon-purple" />
            </div>
            <div className="text-3xl font-black">{new Set(products.map(p => p.category)).size}</div>
          </div>
          <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Premium Hits</span>
              <FaStar className="text-yellow-500" />
            </div>
            <div className="text-3xl font-black">{products.filter(p => p.isTrending).length}</div>
          </div>
        </div>

        {/* Product Listing */}
        <div className="bg-[#121212] rounded-3xl overflow-hidden border border-gray-800">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold">Product Listing</h2>
            <span className="text-xs text-gray-500">{products.length} Items Found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/50 text-[10px] uppercase font-bold text-gray-500 tracking-widest">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading products...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">No products found. Start by adding one.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-900 border border-gray-800"
                            onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image' }}
                          />
                          <div>
                            <div className="font-bold text-sm">{product.name}</div>
                            <div className="text-[10px] text-gray-500 truncate max-w-[200px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-1 bg-gray-900 text-gray-400 rounded-md text-[9px] font-bold border border-gray-800 w-max">
                            {product.category}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-[9px] font-bold border w-max ${product.isVeg ? 'bg-green-900/20 text-green-500 border-green-800' : 'bg-red-900/20 text-red-500 border-red-800'}`}>
                            {product.isVeg ? 'VEG' : 'NON-VEG'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-green-500">
                        ₹{product.price}
                      </td>
                      <td className="px-6 py-4">
                        {product.isTrending ? (
                          <span className="text-[9px] bg-red-800/20 text-red-500 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Trending</span>
                        ) : (
                          <span className="text-[9px] bg-gray-800 text-gray-500 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Standard</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => openEditModal(product)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card-bg w-full max-w-2xl rounded-3xl p-8 border border-gray-800 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase italic">{editingId ? 'Edit' : 'Add'} <span className="text-red-800">Product</span></h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Product Name</label>
                  <div className="relative">
                    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Midnight Pepperoni"
                      className="w-full bg-[#121212] border-none rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-800 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Product Title</label>
                  <div className="relative">
                    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Special Title"
                      className="w-full bg-[#121212] border-none rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-800 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Price (₹)</label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="499"
                      className="w-full bg-[#121212] border-none rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-800 transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#121212] border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-red-800 transition-all outline-none appearance-none"
                  >
                    <option value="NORTH INDIAN">NORTH INDIAN</option>
                    <option value="SOUTH INDIAN">SOUTH INDIAN</option>
                    <option value="BIRYANI">BIRYANI</option>
                    <option value="PIZZA">PIZZA</option>
                    <option value="BURGERS">BURGERS</option>
                    <option value="DRINKS">DRINKS</option>
                    <option value="SWEETS">SWEETS</option>

                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Dietary Type</label>
                  <select
                    name="isVeg"
                    value={formData.isVeg}
                    onChange={handleChange}
                    className="w-full bg-[#121212] border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-red-800 transition-all outline-none appearance-none"
                  >
                    <option value={true}>VEG</option>
                    <option value={false}>NON-VEG</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Image URL</label>
                  <div className="relative">
                    <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full bg-[#121212] border-none rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-800 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Short description..."
                    rows="3"
                    className="w-full bg-[#121212] border-none rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-red-800 transition-all outline-none resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    id="isTrending"
                    name="isTrending"
                    checked={formData.isTrending}
                    onChange={handleChange}
                    className="w-5 h-5 accent-red-800 rounded"
                  />
                  <label htmlFor="isTrending" className="text-sm font-bold text-gray-400">Mark as Trending Product</label>
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(153,27,27,0.3)]"
                >
                  {editingId ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
