import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginView from './views/LoginView';
import LandingView from './views/LandingView';
import CategoryView from './views/CategoryView';
import ProductDetailView from './views/ProductDetailView';
import CheckoutView from './views/CheckoutView';
import AdminDashboard from './views/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { fetchCart, clearCart } from './store/slices/cartSlice';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    } else {
      dispatch(clearCart());
    }
  }, [user, dispatch]);

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/home" element={<LandingView />} />
        <Route path="/category/:categoryId" element={<CategoryView />} />
        <Route path="/product/:productId" element={<ProductDetailView />} />
        
        {/* Protected Routes */}
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
