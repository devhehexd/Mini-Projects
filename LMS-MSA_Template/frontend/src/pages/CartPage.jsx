import React, { useEffect, useState } from 'react';
import { Trash2, CreditCard } from 'lucide-react';
import api from '../api/api';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get('/api/carts');
        setCartItems(response.data);
      } catch (err) {
        setError('장바구니 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching cart items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (id) => {
    try {
      await api.delete(`/api/carts/${id}`);
      setCartItems(cartItems.filter(cart => cart.id !== id));
    } catch (err) {
      alert('장바구니에서 제거하는데 실패했습니다.');
      console.error('Error removing course from cart:', err);
    }
  };

  const handlePayment = async (course) => {
    try {
      const response = await api.post(`/api/enrollments`, {
        courseId: course.id
      });
      
      if (response.data) {
        alert('결제가 완료되었습니다.');
        await handleRemoveFromCart(course.id);
      }
    } catch (err) {
      alert('결제 처리 중 오류가 발생했습니다.');
      console.error('Error processing payment:', err);
    }
  };

  // ... loading and error states remain the same ...

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">장바구니</h1>
      
      <div className="space-y-6">
        {cartItems.map((cart) => (
          <div 
            key={cart.id} 
            className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <img 
                src={cart.thumbnailUrl || "https://placehold.co/600x400"} 
                alt={cart.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{cart.courseName}</h3>
                <p className="text-gray-600">{cart.instructor}</p>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {cart.price ? `${cart.price.toLocaleString()}원` : '무료'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleRemoveFromCart(cart.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="장바구니에서 제거"
              >
                <Trash2 size={20} />
              </button>
              
              <button
                onClick={() => handlePayment(cart)}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <CreditCard size={20} />
                <span>결제하기</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">총 결제 금액</span>
          <span className="text-2xl font-bold text-blue-600">
            {cartItems.reduce((sum, cart) => sum + (cart.price || 0), 0).toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartPage;