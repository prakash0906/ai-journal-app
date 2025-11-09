import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const Input = ({ status, handleSubmit }: any) => {
    const [input, setInput] = useState<string>('');
    const handleInputChange = (e: any) => {
        setInput(e.target.value);
    };

    const doSubmit = (e: any) => {
        e.preventDefault();
        input.trim() && handleSubmit(input.trim());
        setInput('');
    }

    return (<div className="flex gap-3">
        <input
            value={input}
            disabled={status !== 'ready'}
            onChange={handleInputChange}
            onKeyUp={(e) => e.key === 'Enter' && !e.shiftKey && doSubmit(e)}
            placeholder="Add an entry or query about your journal."
            className="flex-1 px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
        />
        <button
            onClick={doSubmit}
            disabled={status !== 'ready' || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
        >
            <Send className="w-5 h-5" />
            <span className="font-medium">Send</span>
        </button>
    </div>);
};

export default Input;