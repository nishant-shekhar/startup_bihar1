import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importing a search icon from react-icons

const SearchBox = () => {
  return (
    <div className="mr-3 flex items-center bg-[#f4f5fa] p-2 rounded-full w-full max-w-md mx-auto">
      <FaSearch className="text-gray-400 m-2" />
      <input
        type="text"
        placeholder="Search Startups"
        className="flex-grow outline-none bg-transparent placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBox;
