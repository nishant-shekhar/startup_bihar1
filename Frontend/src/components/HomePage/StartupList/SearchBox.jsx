import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importing a search icon from react-icons

const SearchBox = () => {
  return (
    <div className="mt-4 flex items-center bg-[#F8F7F3] p-2 rounded-full w-full max-w-lg mx-auto">
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
