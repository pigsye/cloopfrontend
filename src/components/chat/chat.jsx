import React, { useState, useEffect, useRef } from "react";
import API from "../../api"; // Import API
import "./Chat.scss";

export default function Chat() {
  const userId = 1; // Assume user ID 1 for now
  const [chats, setChats] = useState({});
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [drafts, setDrafts] = useState({}); // Store drafts locally
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const toggleChatList = () => {
    setIsChatListOpen((prev) => !prev);
  };

  // Fetch all chat contacts
  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await API.get(`/chats/${userId}`);
        setChats(response.data.chats);

        if (Object.keys(response.data.chats).length > 0) {
          setCurrentChat(Object.keys(response.data.chats)[0]); // Select first chat
        }
      } catch (err) {
        console.error("Failed to load chat contacts:", err);
      }
    }

    fetchChats();
  }, []);

  // Fetch chat messages when chat changes
  useEffect(() => {
    async function fetchChatMessages() {
      if (!currentChat) return;
      try {
        const response = await API.get(`/chats/${userId}/${currentChat}`);
        setMessages((prev) => ({
          ...prev,
          [currentChat]: response.data.logs || [],
        }));
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    }

    fetchChatMessages();
  }, [currentChat]);

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Switch Chat & Restore Drafts
  const handleChatClick = (chatId) => {
    if (currentChat) {
      setDrafts((prev) => ({ ...prev, [currentChat]: input })); // Save draft
    }

    setCurrentChat(chatId);
    setInput(drafts[chatId] || ""); // Restore draft for new chat
    setIsChatListOpen(false);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  // Send a message locally (without API call)
  const sendMessage = () => {
    if (!currentChat || input.trim() === "") return;

    setMessages((prev) => ({
      ...prev,
      [currentChat]: [...(prev[currentChat] || []), { user: userId, timestamp: Date.now(), message: input }],
    }));

    setDrafts((prev) => ({ ...prev, [currentChat]: "" })); // Clear draft
    setInput("");
    inputRef.current.focus();

    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 50);
  };

  return (
    <main className="chatpage">
      {/* Toggle Button for Mobile */}
      <button className="chat-toggle-btn" onClick={toggleChatList}>
        {isChatListOpen ? "Close Chats" : "Open Chats"}
      </button>

      {/* Chat List */}
      <div className={`chat-list ${isChatListOpen ? "open" : ""}`}>
        {Object.entries(chats).map(([otherUserId, data]) => (
          <div
            className={`chat-list-item ${currentChat === otherUserId ? "active" : ""}`}
            key={otherUserId}
            onClick={() => handleChatClick(otherUserId)}
          >
            <img src={`https://via.placeholder.com/40`} alt="user" />
            <span>@{data.username}</span>
          </div>
        ))}
      </div>

      {/* Chat Box */}
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