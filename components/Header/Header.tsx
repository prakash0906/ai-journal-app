import { BookOpen, Trash2 } from "lucide-react";

const Header = ({clearChat, status}: any) => ( <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BookOpen className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AI Journal</h1>
                <p className="text-sm text-gray-500">Powered by Llama 4 Scout via Groq</p>
              </div>
            </div>
            <button
              disabled={status !== 'ready'}
              onClick={clearChat}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>
      </div>);

export default Header;
