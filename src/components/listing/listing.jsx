import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API, { BASE_URL } from "../../api";
import "./listing.scss";

export default function Listing() {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(""); // New state for confirmation message

  // Fetch product details from API
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data.product);

        // Check if user 1 has this in wishlist
        if (response.data.product.wishlisted_users?.includes("1")) {
          setWishlistStatus(true);
        }
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Toggle wishlist status
  const toggleWishlist = async () => {
    try {
      const response = await API.post(`/wishlist/${id}`);
      setWishlistStatus(response.data.wishlist_status); // Update state based on API response

      // Show confirmation message
      setConfirmationMessage(response.data.wishlist_status 
        ? "Added to wishlist! 💖"
        : "Removed from wishlist ❌");

      // Hide confirmation message after 3 seconds
      setTimeout(() => setConfirmationMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update wishlist:", err);
      setConfirmationMessage("Error updating wishlist ❌");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="error">Product not found.</p>;

  return (
    <main className="listing-page">
      <section className="product-details">
        <div className="image-container">
          <img
            src={product.image_url ? `${ BASE_URL }${product.image_url}` : "https://via.placeholder.com/150"}
            alt={product.name}
          />
        </div>

        <div className="info-container">
          <h1>{product.name}</h1>

          {/* Link to the seller's profile with username */}
          <p className="listing-by">
            Listing by <Link to={`/userprofile/${product.customer_id}`}>@{product.seller_username}</Link>
          </p>

          {/* Display tags instead of category, condition, size */}
          <div className="product-tags">
            {product.tags.length > 0 ? (
              product.tags.map((tag, index) => <span key={index} className="tag">{tag}</span>)
            ) : (
              <p>No tags available</p>
            )}
          </div>

          {/* Wishlist Button */}
          <button className={`wishlist-btn ${wishlistStatus ? "active" : ""}`} onClick={toggleWishlist}>
            {wishlistStatus ? "Remove from Wishlist" : "Save"}
          </button>

          {/* Confirmation Message */}
          {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
        </div>
      </section>
    </main>
  );
}