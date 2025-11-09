'use client';
import React from "react";
import { UIMessage } from "ai";
import ReactMarkdown from 'react-markdown';


const Message = ({ message }: { message: UIMessage }) => {
    return (<div
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
        <div
            className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-md ${message.role === 'user'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white'
                : 'bg-white text-gray-800 border border-gray-200'
                }`}
        >
            <div className="whitespace-pre-wrap leading-relaxed">
                {
                    message.parts.map((part: any, index: number) => <React.Fragment key={part.text ?? index}>
                        {part.type === "text" && part.text && <ReactMarkdown>{part.text}</ReactMarkdown>}
                    </React.Fragment>)
                }
            </div>
        </div>
    </div>);
}

export default Message;