"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Update with your backend URL
const OPENAI_API_KEY = "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";

export default function Chat() {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState("");
  const [aiAssist, setAiAssist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleReceiveMessage = (message: { text: string; sender: string }) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socket.emit("sendMessage", newMessage);
    setInput("");

    if (aiAssist) {
      setLoading(true);
      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        }),
      });

      const aiData = await aiResponse.json();
      setLoading(false);

      if (aiData.choices && aiData.choices.length > 0) {
        const aiMessage = { text: aiData.choices[0].message.content, sender: "AI" };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }
    }
  };

  const summarizeConversation = async () => {
    setLoading(true);
    const conversationText = messages.map((msg) => `${msg.sender}: ${msg.text}`).join("\n");
    
    const summaryResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Summarize this conversation: \n${conversationText}` }],
      }),
    });

    const summaryData = await summaryResponse.json();
    setLoading(false);

    if (summaryData.choices && summaryData.choices.length > 0) {
      const summaryMessage = { text: `Summary: ${summaryData.choices[0].message.content}`, sender: "AI" };
      setMessages((prevMessages) => [...prevMessages, summaryMessage]);
    }
  };

  return (
    <div>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <span style={{
              display: "inline-block",
              padding: "5px 10px",
              borderRadius: "10px",
              backgroundColor: msg.sender === "user" ? "#007bff" : "#f1f1f1",
              color: msg.sender === "user" ? "white" : "black",
              margin: "5px 0"
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          style={{ flexGrow: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          placeholder={aiAssist ? "AI Assist is ON. Type a message..." : "Type a message..."}
        />
        <button 
          onClick={sendMessage} 
          style={{ marginLeft: "10px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <label>
          <input 
            type="checkbox" 
            checked={aiAssist} 
            onChange={() => setAiAssist(!aiAssist)} 
          /> Enable AI Assistance
        </label>
      </div>
      <button 
        onClick={summarizeConversation} 
        style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Summarize Conversation
      </button>
    </div>
  );
}
