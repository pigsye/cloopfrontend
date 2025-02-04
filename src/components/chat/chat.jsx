import React, { useState, useEffect, useRef } from "react";
import "./Chat.scss";

export default function Chat() {
  const [messages, setMessages] = useState({
    meekuom: {
      img: "images/user-1.jpg",
      chats: [
        { type: "received", text: "Hey, how are you?" },
        { type: "sent", text: "I'm good! How about you?" }
      ]
    },
    cloudspeaks: {
      img: "images/user2.jpg",
      chats: [
        { type: "received", text: "Hi, do you have any updates on the project?" },
        { type: "sent", text: "Yes! I’ll send them over soon." }
      ]
    },
    evelyn: {
      img: "images/user3.jpg",
      chats: [
        { type: "received", text: "Hi, do you meoiw?" },
        { type: "sent", text: "Yes! I’ll send them over soon." }
      ]
    }
  });

  const [currentChat, setCurrentChat] = useState(Object.keys(messages)[0]); // Select first chat by default
  const [drafts, setDrafts] = useState({});
  const [input, setInput] = useState("");
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  // Select a chat, restore draft message, and autofocus input
  const showChat = (username) => {
    if (currentChat) {
      setDrafts((prevDrafts) => ({
        ...prevDrafts,
        [currentChat]: input, // Save draft message for current chat
      }));
    }

    setCurrentChat(username);
    setInput(drafts[username] || ""); // Restore draft or empty string

    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  // Send a message
  const sendMessage = () => {
    if (!currentChat || input.trim() === "") return;

    console.log(`Sending message to ${currentChat}: "${input}"`);

    setMessages((prev) => ({
      ...prev,
      [currentChat]: {
        ...prev[currentChat],
        chats: [...prev[currentChat].chats, { type: "sent", text: input }]
      }
    }));

    setDrafts((prevDrafts) => ({
      ...prevDrafts,
      [currentChat]: "", // Clear the draft for this chat
    }));

    setInput("");
    inputRef.current.focus();

    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 50);
  };

  // Handle key press for Shift + Enter (newline) and Enter (send message)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setInput((prev) => prev + "\n"); // Add newline
    }
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, currentChat]);

  return (
    <main className="chatpage">
      {/* Chat List */}
      <div className="chat-list">
        {Object.entries(messages).map(([username, data]) => (
          <div className="chat-list-item" key={username} onClick={() => showChat(username)}>
            <img src={data.img} alt="user" />
            <span>@{username}</span>
          </div>
        ))}
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        <div className="chat-header">
          {currentChat ? `Chat with @${currentChat}` : "Select a chat"}
        </div>
        <div className="chat-messages" ref={chatRef}>
          {currentChat && messages[currentChat]?.chats.length > 0 ? (
            messages[currentChat].chats.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.text.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
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
            onKeyDown={handleKeyDown}
            rows={2}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </main>
  );
}