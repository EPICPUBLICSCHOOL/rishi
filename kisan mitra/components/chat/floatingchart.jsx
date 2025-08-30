import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InvokeLLM } from "@/integrations/Core";
import { ChatMessage } from "@/entities/ChatMessage";

export default function FloatingChat({ language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}`);
  const scrollAreaRef = useRef(null);

  const text = {
    english: {
      title: "Ask Our AI Assistant",
      subtitle: "Get instant farming advice",
      placeholder: "Type your farming question...",
      send: "Send",
      welcome: "Hello! I'm your AI farming assistant. Ask me anything about crops, diseases, fertilizers, or farming techniques.",
      typing: "AI is thinking..."
    },
    hindi: {
      title: "हमारे AI सहायक से पूछें",
      subtitle: "तुरंत कृषि सलाह प्राप्त करें",
      placeholder: "अपना कृषि प्रश्न लिखें...",
      send: "भेजें",
      welcome: "नमस्ते! मैं आपका AI कृषि सहायक हूँ। फसल, रोग, उर्वरक या कृषि तकनीकों के बारे में कुछ भी पूछें।",
      typing: "AI सोच रहा है..."
    },
    bengali: {
      title: "আমাদের AI সহায়কের কাছে জিজ্ঞাসা করুন",
      subtitle: "তাৎক্ষণিক কৃষি পরামর্শ পান",
      placeholder: "আপনার কৃষি প্রশ্ন লিখুন...",
      send: "পাঠান",
      welcome: "নমস্কার! আমি আপনার AI কৃষি সহায়ক। ফসল, রোগ, সার বা কৃষি কৌশল সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন।",
      typing: "AI চিন্তা করছে..."
    }
  };

  const currentText = text[language];

  useEffect(() => {
    // Add welcome message when chat opens for the first time
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        message: currentText.welcome,
        sender: 'assistant',
        timestamp: new Date().toISOString()
      }]);
    }
  }, [isOpen, messages.length, currentText.welcome]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

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
- Local farming practices
- Disease prevention and treatment
- Crop management
- Soil health
- Irrigation techniques

Farmer's question: ${inputMessage}

Provide a helpful, detailed response that a farmer can easily understand and implement.`;

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
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-24 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
          size="icon"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-40 right-4 w-80 h-96 z-40"
          >
            <Card className="h-full shadow-xl border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg p-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="w-5 h-5" />
                  {currentText.title}
                </CardTitle>
                <p className="text-green-100 text-sm">{currentText.subtitle}</p>
              </CardHeader>

              <CardContent className="p-0 flex flex-col h-full">
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-green-600 text-white rounded-br-sm'
                              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {msg.sender === 'assistant' && (
                              <Bot className="w-4 h-4 mt-0.5 text-green-600" />
                            )}
                            {msg.sender === 'user' && (
                              <User className="w-4 h-4 mt-0.5 text-white" />
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
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-sm">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4 text-green-600" />
                            <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                            <span className="text-sm">{currentText.typing}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-3 border-t border-gray-200">
                  <div className="flex gap-2">
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
                      size="icon"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

