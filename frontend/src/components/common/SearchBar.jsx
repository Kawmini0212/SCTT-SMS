import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ onSearch, placeholder = 'Search...', className = '' }) {
    const [value, setValue] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => { onSearch(value); }, 500);
        return () => clearTimeout(timer);
    }, [value, onSearch]);

    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-brand-gray3" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-12 pr-4 py-3 border-2 border-brand-gray2 rounded-lg bg-brand-white
                           focus:border-brand-red focus:ring-2 focus:ring-brand-red/20
                           transition-all duration-200 placeholder:text-brand-gray3
                           text-brand-black text-sm"
            />
        </div>
    );
}
