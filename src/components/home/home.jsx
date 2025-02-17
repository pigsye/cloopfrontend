import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API, { BASE_URL } from "../../api";  // Import API
import "./home.scss";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);  // Store tags from API
  const [selectedTags, setSelectedTags] = useState([]); // Store selected filters
  const [visibleCount, setVisibleCount] = useState(24);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDropdown, setSelectedDropdown] = useState(""); // Track dropdown selection

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

    async function fetchTags() {
      try {
        const response = await API.get("/tags");
        setTags(response.data.tags);
      } catch (err) {
        console.error("Failed to load tags:", err);
      }
    }

    fetchProducts();
    fetchTags();
  }, []);

  // Handle dropdown selection
  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !selectedTags.includes(selectedValue)) {
      setSelectedTags([...selectedTags, selectedValue]);
    }
    setSelectedDropdown(""); // Reset dropdown selection
  };

  // Remove selected filter when clicking a bubble
  const removeFilter = (filter) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== filter));
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([]);
  };

  // Filter products based on selected tags (logical OR filtering)
  const filteredProducts = products.filter(
    (product) => product.is_listed !== false &&  // ✅ Ensure it's listed
    (selectedTags.length === 0 || selectedTags.some((tag) => product.tags.includes(tag)))
  );

  // Handle "View More" button click
  const showMoreProducts = () => {
    setVisibleCount((prev) => prev + 24);
  };

  return (
    <main className="homepage">
      {/* Filter Selection */}
      <div className="filter-container">
        <div className="filter-group">
          <select value={selectedDropdown} onChange={handleDropdownChange}>
            <option value="">Select a Filter</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Filters (Filter Bubbles) */}
        <div className="selected-filters">
          {selectedTags.map((tag) => (
            <div key={tag} className="filter-bubble">
              {tag} <button onClick={() => removeFilter(tag)}>✖</button>
            </div>
          ))}
        </div>

        {/* Clear Filters Button */}
        <button className="filter-button" onClick={clearFilters}>Clear Filters</button>
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
                  src={product.image_url ? `${ BASE_URL }${product.image_url}` : "https://via.placeholder.com/150"}
                  alt={product.name}
                />
                <p>{product.name}</p>
              </Link>
            ))
          ) : (
            <p className="no-results">No products match the selected tags.</p>
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