import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardList from './CardList'; // Assuming this component is defined below
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const HomeNav = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Tech', 'Health', 'Finance', 'Education', 'Food'];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/${category.toLowerCase()}`);
  };

  return (
    <div className=''>
      <NavBar/>
    <div className="flex flex-col items-center justify-top min-h-screen bg-white">
      <h1 className="text-4xl font-bold mb-6">Bihar's Brightest Startups</h1>
      <div className="bg-gray-200 rounded-2xl p-4">
        <nav className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`py-2 px-4 rounded-2xl ${
                selectedCategory === category ? 'bg-[#780206] text-white' : 'bg-gray-200'
              } transition-colors duration-300`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <CardList category={selectedCategory} />
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeNav;
