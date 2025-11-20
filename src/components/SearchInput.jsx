import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ onSearch, initialQuery = '' }) => {
    const [query, setQuery] = useState(initialQuery);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:shadow-md focus:border-transparent focus:outline-none transition-all text-lg"
                    placeholder="Search Arxiv papers..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {/* Optional: Clear button or voice search icon could go here */}
                </div>
            </div>
        </form>
    );
};

export default SearchInput;
