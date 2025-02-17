import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API, { BASE_URL } from "../../api";
import { jwtDecode } from "jwt-decode";
import "./listing.scss";

export default function Listing() {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [listed, setListed] = useState(true);
  const [swapRequested, setSwapRequested] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [userId, setUserId] = useState(null);

  // Step 1: Fetch logged-in user ID from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const loggedInUserId = decoded.sub?.id || decoded.id;
        setUserId(loggedInUserId);
      } catch (err) {
        console.error("JWT decoding failed:", err);
      }
    }
  }, []);

  // Step 2: Fetch product details after userId is set
  useEffect(() => {
    if (!userId) return; // ✅ Wait until userId is set

    async function fetchProduct() {
      try {
        const response = await API.get(`/products/${id}`);
        const productData = response.data.product;

        setProduct(productData);
        setListed(productData.is_listed);

        // ✅ Fix: Convert to Number to ensure proper comparison
        const numericUserId = Number(userId);
        const numericOwnerId = Number(productData.customer_id);

        if (numericUserId === numericOwnerId) {
          setIsOwner(true);
        }

        if (Array.isArray(productData.wishlisted_users) && productData.wishlisted_users.includes(userId)) {
          setWishlistStatus(true);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, userId]); // ✅ Now userId must be set before fetching

  // Toggle wishlist status
  const toggleWishlist = async () => {
    try {
      const response = await API.post(`/wishlist/${id}`);
      setWishlistStatus(response.data.wishlist_status);

      setConfirmationMessage(
        response.data.wishlist_status
          ? "Added to wishlist! 💖"
          : "Removed from wishlist ❌"
      );

      setTimeout(() => setConfirmationMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update wishlist:", err);
      setConfirmationMessage("Error updating wishlist ❌");
    }
  };

  // Toggle listing status
  const toggleListing = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found, user must log in.");
      return;
    }

    try {
      const response = await API.post(
        `/products/${id}/toggle-listing`,
        {},
        {
          headers: { 
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        }
      );

      setListed(response.data.is_listed);
      setConfirmationMessage(
        response.data.is_listed
          ? "Product relisted successfully! ✅"
          : "Product delisted successfully ❌"
      );

      setTimeout(() => setConfirmationMessage(""), 3000);
    } catch (err) {
      console.error("❌ Failed to update listing status:", err.response || err);
      setConfirmationMessage("Error updating listing status ❌");
    }
  };

  // Send Swap Request
  const requestSwap = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found, user must log in.");
      return;
    }

    try {
      const response = await API.post(
        `/request-swap/${id}/${product.customer_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.chat_id) {
        setSwapRequested(true);
        setChatId(response.data.chat_id);
        setConfirmationMessage("Swap request sent! 🔄");
      }
    } catch (err) {
      console.error("❌ Error requesting swap:", err);
      setConfirmationMessage("Error sending swap request ❌");
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
            src={`${BASE_URL}${product.image_url}`}
            alt={product.name}
          />
        </div>

        <div className="info-container">
          <h1>{product.name}</h1>

          <p className="listing-by">
            Listing by <Link to={`/userprofile/${product.customer_id}`}>@{product.seller_username}</Link>
          </p>

          <div className="product-tags">
            {product.tags.length > 0 ? (
              product.tags.map((tag, index) => <span key={index} className="tag">{tag}</span>)
            ) : (
              <p>No tags available</p>
            )}
          </div>

          {/* Owner sees "De-list" instead of Wishlist */}
          {isOwner ? (
            <button className={`listing-btn ${listed ? "delist" : "relist"}`} onClick={toggleListing}>
              {listed ? "De-list Product" : "Re-list Product"}
            </button>
          ) : (
            <>
              <button className={`wishlist-btn ${wishlistStatus ? "active" : ""}`} onClick={toggleWishlist}>
                {wishlistStatus ? "Remove from Wishlist" : "Save"}
              </button>
              <button className="swap-btn" onClick={requestSwap} disabled={swapRequested}>
                {swapRequested ? "Swap Requested! ✅" : "🔄 Request Swap"}
              </button>
            </>
          )}

          {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
        </div>
      </section>
    </main>
  );
}