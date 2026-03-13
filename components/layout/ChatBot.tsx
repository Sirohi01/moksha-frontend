"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Namaste! 🙏 Welcome to Moksha Seva. How can I assist you today?",
            sender: "bot",
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");

        // Simulate bot response (replace with API call later)
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Thank you for your message. Our team will assist you shortly. For immediate help, please call our 24/7 helpline: 1800-123-456",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Panel */}
            {isOpen && (
                <div className={cn(
                    "fixed bottom-24 right-6 w-[380px] bg-white rounded-3xl shadow-2xl border border-stone-200 z-[1100] transition-all duration-300",
                    isMinimized ? "h-16" : "h-[600px]"
                )}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-gradient-to-r from-[#f4c430] to-[#eab308] rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Bot className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Moksha Seva Assistant</h3>
                                <p className="text-white/80 text-xs">Always here to help</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="text-white/80 hover:text-white transition-colors p-1"
                                aria-label="Minimize chat"
                            >
                                <Minimize2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors p-1"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages Area */}
                            <div className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-4 bg-stone-50">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex gap-3",
                                            message.sender === "user" ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {message.sender === "bot" && (
                                            <div className="w-8 h-8 rounded-full bg-[#f4c430]/10 flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-5 h-5 text-[#f4c430]" />
                                            </div>
                                        )}
                                        <div
                                            className={cn(
                                                "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                                                message.sender === "user"
                                                    ? "bg-[#f4c430] text-white rounded-br-sm"
                                                    : "bg-white text-stone-800 rounded-bl-sm border border-stone-200"
                                            )}
                                        >
                                            <p className="text-sm leading-relaxed">{message.text}</p>
                                            <p className={cn(
                                                "text-xs mt-1",
                                                message.sender === "user" ? "text-white/70" : "text-stone-400"
                                            )}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        {message.sender === "user" && (
                                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-stone-600" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-stone-200 bg-white rounded-b-3xl">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-3 rounded-xl border border-stone-300 focus:border-[#f4c430] focus:ring-2 focus:ring-[#f4c430]/20 outline-none transition-all text-sm"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim()}
                                        className="px-4 py-3 bg-[#f4c430] hover:bg-[#eab308] disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
                                        aria-label="Send message"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-xs text-stone-400 mt-2 text-center">
                                    Powered by Moksha Seva AI
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Floating Chat Button */}
            <div className="fixed bottom-6 left-6 z-[1100] flex flex-col gap-3">
                {/* Chat Button */}
                <button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setIsMinimized(false);
                    }}
                    className={cn(
                        "group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95",
                        isOpen
                            ? "bg-stone-900 text-white"
                            : "bg-gradient-to-br from-[#f4c430] to-[#eab308] text-white hover:shadow-[#f4c430]/40"
                    )}
                    aria-label={isOpen ? "Close chat" : "Open chat"}
                >
                    <div className="absolute -inset-2 bg-[#f4c430]/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {isOpen ? (
                        <X className="w-5 h-5 relative z-10" />
                    ) : (
                        <>
                            <MessageCircle className="w-5 h-5 relative z-10" />
                            {/* Notification Badge */}
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse z-20">
                                1
                            </span>
                        </>
                    )}

                    {/* Tooltip */}
                    {!isOpen && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-stone-900/95 backdrop-blur-sm text-white text-xs font-bold rounded-xl opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10 uppercase tracking-widest shadow-xl">
                            Chat with us
                        </div>
                    )}
                </button>

                {/* WhatsApp Button */}
                <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP?.replace(/\D/g, "") || "919773992516"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-green-500/40 transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="Contact us on WhatsApp"
                >
                    <div className="absolute -inset-2 bg-green-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <MessageCircle className="w-5 h-5 fill-white relative z-10" strokeWidth={2} />

                    {/* Tooltip */}
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-stone-900/95 backdrop-blur-sm text-white text-xs font-bold rounded-xl opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10 uppercase tracking-widest shadow-xl">
                        Chat on WhatsApp
                    </div>
                </a>
            </div>
        </>
    );
}
