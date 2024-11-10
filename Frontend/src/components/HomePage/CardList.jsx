import React, { useState, useEffect } from 'react';
import CompanyCard from './CompanyCard';
import dp from '../../assets/logo1.png'; // Assuming dp.png is the default company logo

const CardList = ({ category }) => {
  // Sample card data
  const cardsData = [
    { logo: dp, name: 'Dream Fire Studio', founder: 'Ankit', startupSince: '2023', fundingStatus: 'Seed Funded', Category: "Tech" },
    { logo: dp, name: 'floww', founder: 'Amit', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Food" },
    { logo: dp, name: 'Roboto', founder: 'Mukesh', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Food" },
    { logo: dp, name: 'Medicare', founder: 'Iyer', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Education" },
    { logo: dp, name: 'College', founder: 'Sukesh', startupSince: '2022', fundingStatus: 'Not Funded', Category: "Education" },
    { logo: dp, name: 'NS APPS', founder: 'Nishant', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Finance" },
    { logo: dp, name: 'Company 7', founder: 'Founder 7', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Finance" },
    { logo: dp, name: 'Company 8', founder: 'Founder 8', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Health" },
    { logo: dp, name: 'Company 9', founder: 'Founder 9', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Tech" },
    { logo: dp, name: 'Company 10', founder: 'Founder 10', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Tech" },
  ];

  const [visibleCards, setVisibleCards] = useState(9); // Default to showing 9 cards
  const [filteredCards, setFilteredCards] = useState(cardsData);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle "See All" functionality
  const showMoreCards = () => {
    setVisibleCards(filteredCards.length); // Show all cards on click
  };

  // Filter cards based on selected category and animate on change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300); // Adjust animation duration as needed

    const filtered = category === 'All' ? cardsData : cardsData.filter(card => card.Category.toLowerCase() === category.toLowerCase());
    setFilteredCards(filtered);
    setVisibleCards(9); // Reset visible cards when category changes

    return () => clearTimeout(timer); // Cleanup the timer
  }, [category]);

  return (
    <div className={`w-full flex flex-col items-center m-2 ${isAnimating ? 'animate-fade-in' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.slice(0, visibleCards).map((card, index) => (
          <CompanyCard
            key={index}
            logo={card.logo}
            name={card.name}
            founder={card.founder}
            startupSince={card.startupSince}
            fundingStatus={card.fundingStatus}
            Category={card.Category}
          />
        ))}
      </div>

      {/* Button to show more cards */}
      {visibleCards < filteredCards.length && (
        <button
          onClick={showMoreCards}
          className="mt-8 px-6 py-2 bg-[#780206] text-white rounded-lg hover:bg-[#fb6368] transition-colors"
        >
          See All
        </button>
      )}
    </div>
  );
};

export default CardList;
