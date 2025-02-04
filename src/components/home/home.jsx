import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../api";  // Import API
import "./home.scss";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ color: "", size: "", style: "" });
  const [visibleCount, setVisibleCount] = useState(24); // Show 24 initially
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await API.get("/products");
        setProducts(response.data.products);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setVisibleCount(24); // Reset visible products when filtering
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ color: "", size: "", style: "" });
    setVisibleCount(24);
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    return (
      (filters.color === "" || product.tags.includes(filters.color)) &&
      (filters.size === "" || product.tags.includes(filters.size)) &&
      (filters.style === "" || product.tags.includes(filters.style))
    );
  });

  // Handle "View More" button click
  const showMoreProducts = () => {
    setVisibleCount((prev) => prev + 24);
  };

  return (
    <main className="homepage">
      {/* Filter Container */}
      <div className="filter-container">
        <div className="filter-group">
          <select name="color" value={filters.color} onChange={handleFilterChange}>
            <option value="">Colour</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Gray">Gray</option>
          </select>

          <select name="size" value={filters.size} onChange={handleFilterChange}>
            <option value="">Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>

          <select name="style" value={filters.style} onChange={handleFilterChange}>
            <option value="">Style</option>
            <option value="Casual">Casual</option>
            <option value="Formal">Formal</option>
            <option value="Sporty">Sporty</option>
          </select>

          <button className="filter-button" onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      {/* Loading & Error Handling */}
      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

      {/* Product Grid */}
      {!loading && !error && (
        <div className="grid-container">
          {filteredProducts.slice(0, visibleCount).length > 0 ? (
            filteredProducts.slice(0, visibleCount).map((product) => (
              <Link to={`/products/${product.id}`} key={product.id} className="grid-item">
                <img
                  src={product.image_url ? `${API.defaults.baseURL}/uploads/${product.image_url}` : "https://via.placeholder.com/150"}
                  alt={product.name}
                />
                <p>{product.name}</p>
              </Link>
            ))
          ) : (
            <p className="no-results">No products match the selected filters.</p>
          )}
        </div>
      )}

      {/* View More Button */}
      {visibleCount < filteredProducts.length && (
        <div className="view-more-container">
          <button className="view-more-btn" onClick={showMoreProducts}>View More</button>
        </div>
      )}
    </main>
  );
}