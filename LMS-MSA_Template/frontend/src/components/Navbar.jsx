import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  PlayCircle, 
  PlusCircle, 
  LogIn, 
  LogOut, 
  Menu,
  ShoppingCart
} from 'lucide-react';

const Navbar = ({ isAuthenticated, login, logout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link 
                to="/" 
                className="text-2xl font-bold text-blue-600 flex items-center space-x-2"
              >
                <BookOpen size={24} />
                <span>LMS</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/courses" 
                className="text-gray-600 hover:text-blue-600 px-3 py-2 flex items-center space-x-1"
              >
                <PlayCircle size={16} />
                <span>강의 목록</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/carts" 
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 flex items-center space-x-1"
                  >
                    <Home size={16} />
                    <span>장바구니</span>
                  </Link>
                  
                  <Link 
                    to="/create-course" 
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 flex items-center space-x-1"
                  >
                    <PlusCircle size={16} />
                    <span>강의 등록</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Authentication Actions */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!isAuthenticated ? (
              <button 
                onClick={handleLogin} 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
              >
                <LogIn size={16} />
                <span>로그인</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  logout();
                  window.location.reload();
                }} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Link 
                to="/courses" 
                className="text-gray-600 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md flex items-center space-x-2"
              >
                <PlayCircle size={16} />
                <span>강의 목록</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/carts" 
                    className="text-gray-600 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md flex items-center space-x-2"
                  >
                    <Home size={16} />
                    <span>장바구니</span>
                  </Link>
                  
                  <Link 
                    to="/create-course" 
                    className="text-gray-600 hover:bg-gray-50 hover:text-blue-600 block px-3 py-2 rounded-md flex items-center space-x-2"
                  >
                    <PlusCircle size={16} />
                    <span>강의 등록</span>
                  </Link>
                </>
              )}

              {!isAuthenticated ? (
                <button 
                  onClick={login} 
                  className="text-gray-600 hover:bg-gray-50 hover:text-blue-600 block w-full text-left px-3 py-2 rounded-md flex items-center space-x-2"
                >
                  <LogIn size={16} />
                  <span>로그인</span>
                </button>
              ) : (
                <button 
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }} 
                  className="text-gray-600 hover:bg-gray-50 hover:text-red-600 block w-full text-left px-3 py-2 rounded-md flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>로그아웃</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;