import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../../api";
import "./cart.scss";

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length > 0) {
      fetchCartItems(storedCart);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchCartItems(productIds) {
    try {
      const responses = await Promise.all(
        productIds.map((id) => API.get(`/products/${id}`))
      );

      const products = responses.map((res) => res.data.product);
      setCartItems(products);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
    } finally {
      setLoading(false);
    }
  }

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart.map((item) => item.id)));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <main className="cart-page">
      <section className="cart-container">
        <h1>Your Cart</h1>
        {cartItems.length > 0 ? (
          <ul className="cart-list">
            {cartItems.map((product) => (
              <li key={product.id} className="cart-item">
                <img
                  src={product.image_url ? `${BASE_URL}${product.image_url}` : "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <h2>{product.name}</h2>
                  <button className="remove-btn" onClick={() => removeFromCart(product.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-cart">Your cart is empty.</p>
        )}

        {cartItems.length > 0 && (
          <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
        )}

        {checkoutMessage && <p className="checkout-message">{checkoutMessage}</p>}

        <Link to="/" className="continue-shopping">Continue Shopping</Link>
      </section>
    </main>
  );
}