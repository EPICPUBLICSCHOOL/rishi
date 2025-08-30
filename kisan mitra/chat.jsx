import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/entities/ChatMessage";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";

export default function Chat() {
  const [language] = useState(() => 
    localStorage.getItem('preferred_language') || 'english'
  );
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}`);
  const scrollAreaRef = useRef(null);

  const text = {
    english: {
      title: "Chat with AI Farming Assistant",
      subtitle: "Get expert advice on crops, diseases, and farming techniques",
      placeholder: "Ask me anything about farming...",
      send: "Send",
      welcome: "Hello! I'm your AI farming assistant. Ask me anything about crops, diseases, fertilizers, pest control, or any farming techniques. How can I help you today?",
      typing: "Assistant is thinking..."
    },
    hindi: {
      title: "AI कृषि सहायक के साथ चैट करें",
      subtitle: "फसलों, रोगों और कृषि तकनीकों पर विशेषज्ञ सलाह प्राप्त करें",
      placeholder: "कृषि के बारे में कुछ भी पूछें...",
      send: "भेजें",
      welcome: "नमस्ते! मैं आपका AI कृषि सहायक हूँ। फसल, रोग, उर्वरक, कीट नियंत्रण या किसी भी कृषि तकनीक के बारे में मुझसे कुछ भी पूछें। आज मैं आपकी कैसे मदद कर सकता हूँ?",
      typing: "सहायक सोच रहा है..."
    },
    bengali: {
      title: "AI কৃষি সহায়কের সাথে চ্যাট করুন",
      subtitle: "ফসল, রোগ এবং কৃষি কৌশলের বিশেষজ্ঞ পরামর্শ পান",
      placeholder: "কৃষি সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন...",
      send: "পাঠান",
      welcome: "নমস্কার! আমি আপনার AI কৃষি সহায়ক। ফসল, রোগ, সার, পোকা নিয়ন্ত্রণ বা যেকোনো কৃষি কৌশল সম্পর্কে আমাকে যেকোনো কিছু জিজ্ঞাসা করুন। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
      typing: "সহায়ক চিন্তা করছে..."
    }
  };

  const currentText = text[language];

  useEffect(() => {
    // Load chat history or add welcome message
    loadChatHistory();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const loadChatHistory = async () => {
    try {
      const history = await ChatMessage.filter({ session_id: sessionId }, 'timestamp');
      if (history.length === 0) {
        // Add welcome message
        setMessages([{
          id: 'welcome',
          message: currentText.welcome,
          sender: 'assistant',
          timestamp: new Date().toISOString()
        }]);
      } else {
        setMessages(history);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setMessages([{
        id: 'welcome',
        message: currentText.welcome,
        sender: 'assistant',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Save user message
      await ChatMessage.create({
        message: inputMessage,
        sender: 'user',
        language: language,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      });

      // Get AI response
      const aiPrompt = `You are an expert AI farming assistant helping farmers. Answer the following question in ${language === 'hindi' ? 'Hindi' : language === 'bengali' ? 'Bengali' : 'English'}.

Be practical, specific, and actionable in your advice. Focus on:
- Practical farming solutions
- Cost-effective methods
- Organic and chemical options when relevant
- Seasonal considerations
- Local farming practices in India
- Disease prevention and treatment
- Crop management
- Soil health
- Irrigation techniques
- Market prices and crop selection
- Weather-related farming advice

Farmer's question: ${inputMessage}

Provide a helpful, detailed response that a farmer can easily understand and implement. Use simple language and include specific measurements, timing, and steps when possible.`;

      const aiResponse = await InvokeLLM({
        prompt: aiPrompt,
        add_context_from_internet: true
      });

      const assistantMessage = {
        id: Date.now() + 1,
        message: aiResponse,
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save AI response
      await ChatMessage.create({
        message: aiResponse,
        sender: 'assistant',
        language: language,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        id: Date.now() + 1,
        message: language === 'hindi' ? 'क्षमा करें, कुछ गलत हुआ। कृपया पुनः प्रयास करें।' :
                 language === 'bengali' ? 'দুঃখিত, কিছু ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' :
                 'Sorry, something went wrong. Please try again.',
        sender: 'assistant',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="p-4 bg-white border-b border-green-100">
        <h1 className="text-xl font-bold text-gray-900">{currentText.title}</h1>
        <p className="text-sm text-gray-600">{currentText.subtitle}</p>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {msg.sender === 'assistant' && (
                      <Bot className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                    )}
                    {msg.sender === 'user' && (
                      <User className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 p-4 rounded-lg rounded-bl-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-green-600" />
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                    <span className="text-sm">{currentText.typing}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-green-100">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentText.placeholder}
              className="flex-1 border-green-200 focus:border-green-500"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">{currentText.send}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

