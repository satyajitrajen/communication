import React, { useState, useCallback } from 'react';
import SearchBar from './SearchBar';

interface HeaderProps {
    onSearch: (searchTerm: string, searchBy: 'fullName' | 'phoneNumber') => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        // Determine search type based on input
        const isPhoneNumber = /^[0-9]/.test(term);
        const searchBy = isPhoneNumber ? 'phoneNumber' : 'fullName';
        onSearch(term, searchBy);
    }, [onSearch]);

    return (
        <div className="">
            <SearchBar 
                value={searchTerm}
                onChange={handleSearch}
                
            />
        </div>
    );
};

export default Header;
