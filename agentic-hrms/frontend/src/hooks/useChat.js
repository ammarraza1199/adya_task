import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI HR assistant. How can I help you today?', type: 'text' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { token } = useAuth();

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text, type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        type: data.type || 'text',
        data: data.data || null
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        type: 'text'
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [token, messages]);

  return { messages, isTyping, sendMessage };
};
