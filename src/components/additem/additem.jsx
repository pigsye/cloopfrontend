import React, { useState, useEffect } from "react";
import "./additem.scss";

export default function AddItem() {
  // Simulated API fetch for tag options
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    // Simulate API response
    setTimeout(() => {
      setAvailableTags([
        { id: 1, name: "Clothing", group: "Category" },
        { id: 2, name: "Accessories", group: "Category" },
        { id: 3, name: "Brand New", group: "Condition" },
        { id: 4, name: "Like New", group: "Condition" },
        { id: 5, name: "Used", group: "Condition" },
        { id: 6, name: "Small", group: "Size" },
        { id: 7, name: "Medium", group: "Size" },
        { id: 8, name: "Large", group: "Size" },
        { id: 9, name: "Extra Large", group: "Size" },
      ]);
    }, 1000);
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photos: [],
    selectedTags: [],
  });

  const [errors, setErrors] = useState({});

  const handleTagSelection = (tag) => {
    setFormData((prev) => {
      const newTags = prev.selectedTags.filter((t) => t.group !== tag.group);
      return { ...prev, selectedTags: [...newTags, tag] };
    });
  };

  const handleRemoveTag = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      selectedTags: prev.selectedTags.filter((tag) => tag.id !== tagId),
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: [...formData.photos, ...files] });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title || formData.title.length < 3) newErrors.title = "Title must be at least 3 characters.";
    if (formData.selectedTags.length === 0) newErrors.tags = "At least one tag is required.";
    if (formData.photos.length === 0) newErrors.photos = "At least one photo is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      alert("Item added successfully!");
    }
  };

  return (
    <main className="additempage">
      <form onSubmit={handleSubmit}>
        <section className="add-item">
          <div className="photo-upload">
            <div className="photo-box">
              <input type="file" multiple onChange={handlePhotoUpload} className="file-input" />
              <button type="button" className="select-photos" onClick={() => document.querySelector(".file-input").click()}>
                Select Photos
              </button>
            </div>
            {errors.photos && <p className="error">{errors.photos}</p>}
            {formData.photos.length > 0 && (
              <div className="uploaded-photos">
                {formData.photos.map((photo, index) => (
                  <img key={index} src={URL.createObjectURL(photo)} alt={`uploaded ${index}`} />
                ))}
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Select Tags</h3>
            <div className="tag-options">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className={`tag-btn ${formData.selectedTags.some((t) => t.id === tag.id) ? "selected" : ""}`}
                  onClick={() => handleTagSelection(tag)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
            {errors.tags && <p className="error">{errors.tags}</p>}

            <div className="selected-tags">
              {formData.selectedTags.map((tag) => (
                <div key={tag.id} className="selected-tag">
                  {tag.name}
                  <button type="button" className="remove-tag" onClick={() => handleRemoveTag(tag.id)}>✖</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="item-details">
          <h2>Item details</h2>
          <input
            type="text"
            name="title"
            placeholder="Listing Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          {errors.title && <p className="error">{errors.title}</p>}
          
          <textarea
            name="description"
            placeholder="Description (Optional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <button type="submit" className="add-btn">Add</button>
        </section>
      </form>
    </main>
  );
}