import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import { jwtDecode } from "jwt-decode";
import "./Chat.scss";

export default function Chat() {
  const navigate = useNavigate();
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleChatList = () => {
    setIsChatListOpen((prev) => !prev);
  };

  // ✅ Decode JWT Token and Set User ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("❌ No token found, redirecting to login.");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("✅ Decoded token:", decoded);

      if (!decoded.sub || !decoded.sub.id) {
        throw new Error("Invalid token format (Missing user ID).");
      }

      setUserId(decoded.sub.id);
    } catch (err) {
      console.error("❌ JWT decoding failed:", err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch Chats (Prevent Multiple Calls)
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    async function fetchChats() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await API.get("/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted) {
          setChats(response.data.chats);
          if (Object.keys(response.data.chats).length > 0) {
            setCurrentChat(Object.keys(response.data.chats)[0]); // Set first chat as active
          }
        }
      } catch (err) {
        console.error("❌ Failed to load chats:", err.response || err);
      }
    }

    fetchChats();
    return () => {
      isMounted = false; // Cleanup to prevent extra calls
    };
  }, [userId]);

  // ✅ Fetch Messages When Chat Changes
  useEffect(() => {
    if (!currentChat) return;
    let isMounted = true;

    async function fetchMessages() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await API.get(`/chats/${currentChat}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted) {
          setMessages((prev) => ({
            ...prev,
            [currentChat]: response.data.logs || [],
          }));
        }
      } catch (err) {
        console.error("❌ Failed to load messages:", err.response || err);
      }
    }

    fetchMessages();
    return () => {
      isMounted = false; // Prevent duplicate requests
    };
  }, [currentChat]);

  // ✅ Send Message
  const sendMessage = async () => {
    if (!currentChat || input.trim() === "") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await API.post(
        `/chats/${currentChat}`,
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) => ({
        ...prev,
        [currentChat]: [
          ...(prev[currentChat] || []),
          { user: userId, message: input, timestamp: Date.now() },
        ],
      }));

      setInput("");
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }
  };

  return (
    <main className="chatpage">
      <button className="chat-toggle-btn" onClick={toggleChatList}>
        {isChatListOpen ? "Close Chats" : "Open Chats"}
      </button>

      <div className={`chat-list ${isChatListOpen ? "open" : ""}`}>
        {Object.entries(chats).map(([otherUserId, data]) => (
          <div
            className={`chat-list-item ${currentChat === otherUserId ? "active" : ""}`}
            key={otherUserId}
            onClick={() => setCurrentChat(otherUserId)}
          >
            <img src={`https://via.placeholder.com/40`} alt="user" />
            <span>@{data.username}</span>
          </div>
        ))}
      </div>

      <div className="chat-box">
        <div className="chat-header">
          {currentChat ? `Chat with @${chats[currentChat]?.username}` : "Select a chat"}
        </div>
        <div className="chat-messages" ref={chatRef}>
          {messages[currentChat]?.length > 0 ? (
            messages[currentChat].map((msg, index) => (
              <div key={index} className={`message ${msg.user === userId ? "sent" : "received"}`}>
                {msg.message}
              </div>
            ))
          ) : (
            <p className="no-messages">No messages yet.</p>
          )}
        </div>
        <div className="message-input">
          <textarea
            ref={inputRef}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </main>
  );
}