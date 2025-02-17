import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { isAuthenticated } from "../../auth";
import "./additem.scss";

export default function AddItem() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, []);

  const [availableTags, setAvailableTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photos: [],
    selectedTags: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await API.get("/tags");
        setAvailableTags(response.data.tags);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    }
    fetchTags();
  }, []);

  const handleTagSelection = (tag) => {
    setFormData((prev) => {
      const isAlreadySelected = prev.selectedTags.some((t) => t.id === tag.id);
      return isAlreadySelected
        ? { ...prev, selectedTags: prev.selectedTags.filter((t) => t.id !== tag.id) }
        : { ...prev, selectedTags: [...prev.selectedTags, tag] };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("selectedTags", formData.selectedTags.map(tag => tag.name).join(","));

    formData.photos.forEach((photo) => {
      formDataToSend.append("photos", photo);
    });

    try {
      const response = await API.post("/submit", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Item added successfully!");
        setFormData({ title: "", description: "", photos: [], selectedTags: [] });
      } else {
        alert("Failed to add item.");
      }
    } catch (err) {
      console.error("Failed to submit item:", err);
      alert("Error submitting item.");
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