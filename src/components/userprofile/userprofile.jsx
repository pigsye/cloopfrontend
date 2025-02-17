import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API, { BASE_URL } from "../../api";
import { jwtDecode } from "jwt-decode"; // Import JWT decode
import "./userProfile.scss";

export default function UserProfile() {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate(); // Hook to redirect user
  const [userData, setUserData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Store logged-in user ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // ✅ Decode JWT token to get the logged-in user ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.sub.id); // Extract the user ID from the token
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await API.get(`/user/${id}`);
        const profileData = response.data.profile;

        // Construct full profile picture URL if a filename exists
        if (profileData.pfp) {
          profileData.pfp = `${BASE_URL}/uploads/${profileData.pfp}`;
        }

        setUserData(profileData);
      } catch (err) {
        setError("Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [id]);

  const startChat = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No token found, cannot start chat.");
      alert("You must be logged in to start a chat.");
      return;
    }

    try {
      const response = await API.post(`/start-chat/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Include JWT token
      });

      if (response.status === 201 || response.status === 200) {
        const chatId = response.data.chat_id;
        navigate(`/chat?chat_id=${chatId}`); // Redirect to chat page with chat ID
      } else {
        alert("Failed to start chat.");
      }
    } catch (err) {
      console.error("❌ Error starting chat:", err.response || err);
      alert("An error occurred while starting the chat.");
    }
  };

  const submitReport = async () => {
    if (!reportReason.trim()) {
      alert("Please enter a reason for reporting.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to report a user.");
      return;
    }

    try {
      const response = await API.post(
        `/report-user/${id}`,
        { reason: reportReason },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Report submitted successfully!");
        setReportModalOpen(false);
        setReportReason("");
      } else {
        alert("Failed to submit report.");
      }
    } catch (err) {
      console.error("❌ Error submitting report:", err.response || err);
      alert("An error occurred while submitting the report.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!userData) return <p className="error">User not found.</p>;

  return (
    <main className="user-profile-page">
      <section className="profile-info">
        <h1>{userData.username}'s Profile</h1>

        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <img
            src={userData.pfp || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profile-picture"
          />
        </div>

        {/* Profile Information */}
        <div className="profile-field">
          <label>Name</label>
          <p>{userData.username}</p>
        </div>
        <div className="profile-field">
          <label>Email</label>
          <p>{userData.email}</p>
        </div>
        <div className="profile-field">
          <label>Phone</label>
          <p>{userData.phone || "No phone number provided"}</p>
        </div>
        <div className="profile-field">
          <label>Bio</label>
          <p>{userData.bio || "No bio available"}</p>
        </div>

        {/* ✅ Hide Start Chat Button if Profile Belongs to Logged-in User */}
        {currentUserId !== id && (
          <>
            <button className="start-chat-btn" onClick={startChat}>
              Start Chat
            </button>
            <button className="report-btn" onClick={() => setReportModalOpen(true)}>
              Report User
            </button>
          </>
        )}

        {/* Report Modal */}
        {reportModalOpen && (
          <div className="report-modal">
            <div className="modal-content">
              <h2>Report User</h2>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Enter your reason for reporting..."
                rows="4"
              />
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setReportModalOpen(false)}>Cancel</button>
                <button className="submit-btn" onClick={submitReport}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}