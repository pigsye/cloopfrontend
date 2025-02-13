import React, { useState, useEffect } from "react";
import API, { BASE_URL } from "../../api"; // Import API & BASE_URL
import "./Profile.scss";

export default function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    bio: "",
    pfp: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await API.get("/profile/1"); // Assume user ID 1
        const profileData = response.data.profile;

        // Construct full profile picture URL
        if (profileData.pfp) {
          profileData.pfp = `${BASE_URL}${profileData.pfp}`;
        }

        setUserData(profileData);
      } catch (err) {
        console.error("Failed to load user profile:", err);
      }
    }

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await API.post("/profile/1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setUserData((prev) => ({
          ...prev,
          pfp: `${BASE_URL}${response.data.filename}`,
        }));
        setUpdateMessage("Profile picture updated successfully!");
      } else {
        setUpdateMessage("Failed to update profile picture.");
      }
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      setUpdateMessage("Error uploading profile picture.");
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!userData.username.trim()) validationErrors.username = "Name is required.";
    if (!/^[89]\d{7}$/.test(userData.phone)) validationErrors.phone = "Phone number must start with 8 or 9 and be 8 digits long.";
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.email)) validationErrors.email = "Invalid email format.";
    if (!userData.bio.trim()) validationErrors.bio = "Bio is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await API.post("/profile/1", {
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        bio: userData.bio,
      });

      if (response.status === 200) {
        setUpdateMessage("Profile updated successfully!");
      } else {
        setUpdateMessage("Failed to update profile.");
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setUpdateMessage("Error updating profile.");
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-info">
        <h1>{isEditing ? "Edit Profile" : "Profile"}</h1>

        <div className="profile-picture-section">
          <img
            src={userData.pfp || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-picture"
          />
          <input type="file" id="upload-pfp" accept="image/*" onChange={handleFileChange} />
          <label htmlFor="upload-pfp" className="upload-btn-label">Upload New Picture</label>
        </div>

        <div className="profile-field">
          <label>Name</label>
          <input type="text" name="username" value={userData.username} onChange={handleChange} disabled={!isEditing} />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div className="profile-field">
          <label>Email</label>
          <input type="email" name="email" value={userData.email} onChange={handleChange} disabled={!isEditing} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="profile-field">
          <label>Phone</label>
          <input type="text" name="phone" value={userData.phone} onChange={handleChange} disabled={!isEditing} />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <div className="profile-field">
          <label>Bio</label>
          <textarea name="bio" value={userData.bio} onChange={handleChange} disabled={!isEditing} />
          {errors.bio && <span className="error">{errors.bio}</span>}
        </div>

        {updateMessage && <p className="update-message">{updateMessage}</p>}

        <button className="edit-btn" onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}>
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </section>
    </main>
  );
}