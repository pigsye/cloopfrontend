import React, { useState, useEffect } from "react";
import API, { BASE_URL } from "../../api";
import { jwtDecode } from "jwt-decode"; // Decode JWT to get user ID
import "./Profile.scss";

export default function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    bio: "",
    pfp: "",
  });

  const [userId, setUserId] = useState(null); // Store logged-in user ID
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState("");

  // ✅ Get the logged-in user ID from the token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.sub.id); // Extract the user ID from the token
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
  
    async function fetchUserProfile() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found, cannot fetch profile.");
        return;
      }
  
      try {
        const response = await API.get(`/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Include JWT
        });
  
        const profileData = response.data.profile;
  
        if (profileData.pfp) {
          profileData.pfp = `${BASE_URL}/uploads/${profileData.pfp}`;
        }
  
        setUserData(profileData);
      } catch (err) {
        console.error("❌ Failed to load user profile:", err.response || err);
      }
    }
  
    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await API.post(`/profile/${userId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setUserData((prev) => ({
          ...prev,
          pfp: `${BASE_URL}/uploads/${response.data.filename}`,
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
      const response = await API.post(`/profile/${userId}`, {
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

  // ✅ Open Change Password Modal
  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setPasswordErrors("");
  };

  // ✅ Close Change Password Modal
  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordErrors("");
  };

  // ✅ Handle Password Change Form Submission
  const handleChangePassword = async () => {
    if (passwordForm.newPassword.length < 8) {
      setPasswordErrors("New password must be at least 8 characters long.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordErrors("New passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token"); // 🔹 Get JWT token

    try {
      const response = await API.post(`/profile/${userId}/change-password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Include Authorization header
      });

      if (response.status === 200) {
        setUpdateMessage("Password updated successfully!");
        closePasswordModal();
      } else {
        setPasswordErrors(response.data.error || "Failed to change password.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordErrors("An error occurred.");
    }
};

  return (
    <main className="profile-page">
      <section className="profile-info">
        <h1>{isEditing ? "Edit Profile" : "Profile"}</h1>

        <div className="profile-picture-section">
          <img src={userData.pfp || "https://via.placeholder.com/150"} alt="Profile" className="profile-picture" />
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

        <button className="password-btn" onClick={openPasswordModal}>Change Password</button>

        {updateMessage && <p className="update-message">{updateMessage}</p>}

        <button className="edit-btn" onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}>
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </section>

      {/* ✅ Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Change Password</h2>
            <input type="password" placeholder="Current Password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
            <input type="password" placeholder="New Password (8+ chars)" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
            <input type="password" placeholder="Confirm New Password" value={passwordForm.confirmNewPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })} />
            {passwordErrors && <p className="error">{passwordErrors}</p>}
            <button onClick={handleChangePassword}>Update Password</button>
            <button onClick={closePasswordModal}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
}