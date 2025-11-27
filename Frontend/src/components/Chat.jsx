import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';
import './Chat.css';

const Chat = () => {
  const { user, logout } = useAuth();
  const socket = useSocket(); // This will be null initially, which is fine
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return; // Wait for socket to be initialized

    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // Listen for confirmation when user sends a message
    socket.on('message-sent', (message) => {
      setMessages((prev) => {
        // Check if message already exists (avoid duplicates)
        const exists = prev.some(m => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
      scrollToBottom();
    });

    socket.on('user-typing', (data) => {
      if (data.sender === selectedUser?._id) {
        setTypingUser(data.username);
        setTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false);
          setTypingUser(null);
        }, 3000);
      }
    });

    socket.on('user-online', ({ userId }) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isOnline: true } : u))
      );
    });

    socket.on('user-offline', ({ userId }) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isOnline: false } : u))
      );
    });

    return () => {
      if (socket) {
        socket.off('receive-message');
        socket.off('message-sent');
        socket.off('user-typing');
        socket.off('user-online');
        socket.off('user-offline');
      }
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser || !socket) return;

    socket.emit('send-message', {
      receiver: selectedUser._id,
      content: messageInput.trim(),
    });

    setMessageInput('');
    socket.emit('typing', {
      receiver: selectedUser._id,
      isTyping: false,
    });
  };

  const handleTyping = () => {
    if (socket && selectedUser) {
      socket.emit('typing', {
        receiver: selectedUser._id,
        isTyping: true,
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-header">
          <div className="user-info">
            <div className="user-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="user-name">{user?.username}</div>
              <div className="user-status">Online</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        
        <div className="users-list">
          <h3>Users</h3>
          {users.map((u) => (
            <div
              key={u._id}
              className={`user-item ${selectedUser?._id === u._id ? 'active' : ''}`}
              onClick={() => setSelectedUser(u)}
            >
              <div className="user-avatar-small">
                {u.username.charAt(0).toUpperCase()}
                {u.isOnline && <span className="online-indicator"></span>}
              </div>
              <div className="user-details">
                <div className="user-name-small">{u.username}</div>
                <div className="user-status-small">
                  {u.isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-main">
        {selectedUser ? (
          <>
            <div className="chat-messages-header">
              <div className="selected-user-info">
                <div className="user-avatar-small">
                  {selectedUser.username.charAt(0).toUpperCase()}
                  {selectedUser.isOnline && <span className="online-indicator"></span>}
                </div>
                <div>
                  <div className="user-name-small">{selectedUser.username}</div>
                  <div className="user-status-small">
                    {selectedUser.isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${msg.sender._id === user._id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">{msg.content}</div>
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))}
              {typing && typingUser && (
                <div className="message received">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="chat-input-form">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button type="submit" className="send-button">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-icon">💬</div>
            <h2>Select a user to start chatting</h2>
            <p>Choose someone from the sidebar to begin your conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

