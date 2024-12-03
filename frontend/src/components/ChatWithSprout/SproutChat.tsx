import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import io from "@/logic/socket";

interface Message {
  text: string;
  user: boolean;
}

export const SproutChat = () => {
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Who are you?', user: true },
        { text: 'I am Sprout, your garden assistant chatbot.', user: false },
    ]);
    const [userMessage, setUserMessage] = useState<string>('');

    useEffect(() => {
        io.on('SproutResponse', (data: { response: string }) => {
            console.log(data)
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: data.response, user: false },
          ]);
        });
    
        return () => {
          io.off('SproutResponse');
        };
      }, []);
    
      const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserMessage(event.target.value);
      };

    const sendMessage = () => {
        if (userMessage.trim() !== '') {
        setMessages((prevMessages) => [
            ...prevMessages,
            { text: userMessage, user: true },
        ]);
        io.emit('ReqSproutResponse', {message: userMessage});
        setUserMessage('');
        }
    };

    return (
        <div className="container w-full min-h-[75vh] max-h-max mt-8">
            <div className="text-4xl min-h-[70vh]">
                {messages.map((msg, index) => (
                  <div key={index} style={{ textAlign: msg.user ? 'right' : 'left' }} >
                      <p className={msg.user ? "bg-blue-200 rounded-lg my-4 p-2 inline-block" : "bg-lime-400 rounded-lg my-4 p-2 inline-block"}>{msg.text}</p>
                  </div>
                ))}
            </div>
            <div className="flex">
                <Input value={userMessage} onChange={handleInputChange} className="mr-4 bg-slate-200" />
                <Button onClick={sendMessage} variant='default' className="text-4xl">Send</Button>
            </div>
        </div>
    );
};

export default SproutChat;
