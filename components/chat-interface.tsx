"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MenuIcon, Send } from "lucide-react";

export function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "system",
        content:
          "You are an AI assistant specialized in generating in-app notification copy. Your task is to create concise, engaging, and relevant notification messages for various app events and user interactions. Keep the tone friendly and consistent with the app's brand voice. Ensure the notifications are informative and encourage user engagement without being intrusive.",
      },
    ],
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.ctrlKey || e.shiftKey) {
        // If Ctrl+Enter or Shift+Enter, insert a newline
        e.preventDefault();
        const newValue = input + "\n";
        handleInputChange({
          target: { value: newValue },
        } as React.ChangeEvent<HTMLTextAreaElement>);
        return;
      }
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto`}
      >
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Audience Dimensions</h2>
          <div className="space-y-2">
            <Label htmlFor="age">Age Range</Label>
            <Input id="age" placeholder="e.g., 18-35" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select id="gender" className="w-full p-2 border rounded">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g., Urban US" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests</Label>
            <Textarea
              id="Additional notes"
              placeholder="Interests, intention etc"
            />
          </div>
          <Button className="w-full">Apply Dimensions</Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Notifications writer</h1>
          <div className="w-6 md:w-0" />
        </header>

        {/* Chat Area */}
        <div className="flex-1 grid place-items-center">
          <ScrollArea className="flex-1 p-4 w-full max-w-screen-md">
            <div className="space-y-4">
              {messages
                .filter((x) => !(x.role === "system"))
                .map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start space-x-2 ${
                      m.role === "user" ? "justify-end" : ""
                    }`}
                  >
                    {m.role !== "user" && (
                      <Avatar>
                        <AvatarImage
                          src="/placeholder-avatar.jpg"
                          alt="Assistant"
                        />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`p-2 px-4 rounded-lg ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary-foreground"
                      }`}
                    >
                      <p>{m.content}</p>
                    </div>
                    {m.role === "user" && (
                      <Avatar>
                        <AvatarImage
                          src="/placeholder-avatar-2.jpg"
                          alt="User"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
            </div>
          </ScrollArea>{" "}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Textarea
              className="flex-1"
              placeholder="Type your notification requirements here"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
