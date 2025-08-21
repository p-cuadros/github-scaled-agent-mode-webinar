import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { darkMode } = useTheme();

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-8 transition-colors duration-300`}>Shopping Cart</h1>
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 text-center transition-colors duration-300`}>
            <div className="mb-6">
              <svg className={`mx-auto h-24 w-24 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8v6a1 1 0 001 1h8a1 1 0 001-1v-6M9 17h6" />
              </svg>
            </div>
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>Your cart is empty</h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Start shopping to add items to your cart.</p>
            <Link 
              to="/products" 
              className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark' : 'bg-gray-100'} pt-20 pb-16 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>Shopping Cart</h1>
          <button
            onClick={clearCart}
            className={`text-sm ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors`}
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {items.map(item => {
            const itemPrice = item.discount ? item.price * (1 - item.discount) : item.price;
            return (
              <div key={item.productId} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 flex items-center space-x-4 transition-colors duration-300`}>
                <div className={`w-20 h-20 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-2 transition-colors duration-300`}>
                  <img 
                    src={`/${item.imgName}`} 
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex-grow">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {item.discount ? (
                      <>
                        <span className="text-gray-500 line-through text-sm">${item.price.toFixed(2)}</span>
                        <span className="text-primary font-semibold">${itemPrice.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-primary font-semibold">${itemPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className={`flex items-center space-x-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-2 transition-colors duration-300`}>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <span aria-hidden="true">-</span>
                  </button>
                  <span className={`${darkMode ? 'text-light' : 'text-gray-800'} min-w-[2rem] text-center transition-colors duration-300`}>
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className={`w-8 h-8 flex items-center justify-center ${darkMode ? 'text-light' : 'text-gray-700'} hover:text-primary transition-colors`}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
                    ${(itemPrice * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'} transition-colors mt-1`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 transition-colors duration-300`}>
          <div className="flex justify-between items-center mb-6">
            <span className={`text-xl font-semibold ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}>
              Total: ${getTotalPrice().toFixed(2)}
            </span>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              to="/products" 
              className={`flex-1 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-light' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} px-6 py-3 rounded-lg font-medium transition-colors text-center`}
            >
              Continue Shopping
            </Link>
            <button className="flex-1 bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}