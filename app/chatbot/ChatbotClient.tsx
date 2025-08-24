'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Send, 
  RefreshCw, 
  History, 
  Settings, 
  MessageCircle, 
  Info, 
  AlertTriangle, 
  User,
  Bot,
  X
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your municipal services assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response - Replace with your API call
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I understand you're asking about: "${inputValue}". This is a placeholder response. Implement your API endpoint at /api/chat to get real responses.`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendQuickMessage = (text: string) => {
    setInputValue(text);
    // Auto-send after a brief delay
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I\'m your municipal services assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic here
    // You can integrate with Web Speech API or other voice services
  };

  const quickActions = [
    { 
      label: 'Services', 
      icon: Info, 
      text: 'What municipal services do you offer?',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    { 
      label: 'Complaints', 
      icon: AlertTriangle, 
      text: 'I want to register a complaint',
      color: 'from-orange-500/20 to-red-500/20'
    },
    { 
      label: 'Profile', 
      icon: User, 
      text: 'Help me with my profile',
      color: 'from-green-500/20 to-emerald-500/20'
    },
    { 
      label: 'General', 
      icon: MessageCircle, 
      text: 'General information about municipal services',
      color: 'from-purple-500/20 to-indigo-500/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 flex items-center justify-center">
      <Card className="w-full max-w-4xl h-[90vh] bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Janvaani Assistant</CardTitle>
                <p className="text-sm text-muted-foreground">Your voice-based municipal services helper</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-600 border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Online
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-sm">Assistant is typing</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">Try these quick actions:</p>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      className={`h-auto p-3 flex flex-col items-center gap-2 bg-gradient-to-br ${action.color} border-border/50 hover:bg-muted/80`}
                      onClick={() => sendQuickMessage(action.text)}
                    >
                      <action.icon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-muted/30 border-t border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="h-8 px-3 text-xs border-border/50 hover:bg-muted"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Clear Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs border-border/50 hover:bg-muted"
              >
                <History className="w-3 h-3 mr-1" />
                History
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs border-border/50 hover:bg-muted"
              >
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </Button>
            </div>
            
            <div className="flex items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here... (Enter to send)"
                  className="w-full resize-none border-2 border-border/50 focus:border-primary rounded-lg px-4 py-2 pr-20 focus:outline-none bg-background text-foreground"
                  rows={1}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceRecording}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                    isRecording ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}