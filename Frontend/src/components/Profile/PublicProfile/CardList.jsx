import React, { useState, useEffect } from 'react';
import CompanyCard2 from './CompanyCard copy';

const CardList = ({ category }) => {
  // Sample card data
  const cardsData = [
    { logo: 'https://cdn.brandfetch.io/idLWYGd2zx/w/300/h/300/theme/dark/icon.png?k=id64Mup7ac&t=1668030994775', name: 'Dream Fire Studio', founder: 'Robert', founderLogo: 'https://randomuser.me/api/portraits/men/1.jpg', startupSince: '2023', fundingStatus: 'Seed Funded', Category: "Tech", tagline: "Innovating digital solutions for next-gen tech needs." },
    { logo: 'https://cdn.brandfetch.io/google.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1719562006782', name: 'Google', founder: 'Downey', founderLogo: 'https://randomuser.me/api/portraits/men/2.jpg', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Food", tagline: "Revolutionizing food delivery with AI integration." },
    { logo: 'https://cdn.brandfetch.io/netflix.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1717632067836', name: 'Microsoft', founder: 'Sherlock', founderLogo: 'https://randomuser.me/api/portraits/men/3.jpg', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Food", tagline: "Enhancing food sustainability through technology." },
    { logo: 'https://cdn.brandfetch.io/tesla.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1718150206536', name: 'Infosys', founder: 'Holmes', founderLogo: 'https://randomuser.me/api/portraits/men/4.jpg', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Education", tagline: "Empowering educators with cutting-edge software." },
    { logo: 'https://cdn.brandfetch.io/airbnb.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1717781498236', name: 'Cognizant', founder: 'John', founderLogo: 'https://randomuser.me/api/portraits/men/5.jpg', startupSince: '2022', fundingStatus: 'Not Funded', Category: "Education", tagline: "Building smarter classrooms for smarter futures." },
    { logo: 'https://cdn.brandfetch.io/nike.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1717772321786', name: 'NS APPS', founder: 'Rocky', founderLogo: 'https://randomuser.me/api/portraits/men/6.jpg', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Finance", tagline: "Streamlining finances with robust tech tools." },
    { logo: 'https://cdn.brandfetch.io/idZ_uGTj4S/w/400/h/400/theme/dark/icon.jpeg?k=id64Mup7ac&t=1668020051646', name: 'Evernote', founder: 'Founder 7', founderLogo: 'https://randomuser.me/api/portraits/men/7.jpg', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Finance", tagline: "Revolutionizing personal finance management." },
    { logo: 'https://cdn.brandfetch.io/ford.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1719581237892', name: 'Company 8', founder: 'Founder 8', founderLogo: 'https://randomuser.me/api/portraits/men/8.jpg', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Health", tagline: "Delivering health solutions with innovative tech." },
    { logo: 'https://cdn.brandfetch.io/apple.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1717952037589', name: 'Company 9', founder: 'Founder 9', founderLogo: 'https://randomuser.me/api/portraits/men/9.jpg', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Tech", tagline: "Crafting the future with revolutionary tech ideas." },
    { logo: 'https://cdn.brandfetch.io/microsoft.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1718150234896', name: 'Company 10', founder: 'Founder 10', founderLogo: 'https://randomuser.me/api/portraits/men/10.jpg', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Tech", tagline: "Tech solutions that promise better tomorrow." },
    { logo: 'https://cdn.brandfetch.io/solarcity.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1718440256792', name: 'Aqua Tech', founder: 'Alice', founderLogo: 'https://randomuser.me/api/portraits/women/11.jpg', startupSince: '2021', fundingStatus: 'Seed Funded', Category: "Environment", tagline: "Pioneering water purification with eco-friendly tech." },
    { logo: 'https://cdn.brandfetch.io/aws.amazon.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1718432870098', name: 'GreenBuild', founder: 'Bob', founderLogo: 'https://randomuser.me/api/portraits/men/12.jpg', startupSince: '2021', fundingStatus: 'Not Funded', Category: "Construction", tagline: "Constructing green buildings for a greener planet." },
    { logo: 'https://cdn.brandfetch.io/github.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1718490027867', name: 'EduTrack', founder: 'Clara', founderLogo: 'https://randomuser.me/api/portraits/women/13.jpg', startupSince: '2021', fundingStatus: 'Seed Funded', Category: "Education", tagline: "Tracking educational progress with smart apps." },
    { logo: 'https://cdn.brandfetch.io/oracle.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1719440092341', name: 'HealthHub', founder: 'Derek', founderLogo: 'https://randomuser.me/api/portraits/men/14.jpg', startupSince: '2023', fundingStatus: 'Seed Funded', Category: "Health", tagline: "Integrating technology for advanced healthcare." },
    { logo: 'https://cdn.brandfetch.io/adobe.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1718550278710', name: 'AgriGrow', founder: 'Eva', founderLogo: 'https://randomuser.me/api/portraits/women/15.jpg', startupSince: '2023', fundingStatus: 'Seed Funded', Category: "Agriculture", tagline: "Modernizing agriculture with AI and machine learning." },
    { logo: 'https://cdn.brandfetch.io/cisco.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1718784545632', name: 'Safe Streets', founder: 'Fiona', founderLogo: 'https://randomuser.me/api/portraits/women/16.jpg', startupSince: '2023', fundingStatus: 'Not Funded', Category: "Tech", tagline: "Enhancing urban safety with smart tech solutions." },
    { logo: 'https://cdn.brandfetch.io/slack.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1718498320021', name: 'Foodie Junction', founder: 'George', founderLogo: 'https://randomuser.me/api/portraits/men/17.jpg', startupSince: '2022', fundingStatus: 'Seed Funded', Category: "Food", tagline: "Connecting food lovers with gourmet experiences." },
  ]


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
          <CompanyCard2
            key={index}
            logo={card.logo}
            name={card.name}
            founder={card.founder}
            founderLogo={card.founderLogo}
            startupSince={card.startupSince}
            fundingStatus={card.fundingStatus}
            Category={card.Category}
            tagline={card.tagline}
          />
        ))}
      </div>

      {/* Button to show more cards */}
      {visibleCards < filteredCards.length && (
        <button
          onClick={showMoreCards}
          className="mt-8 px-6 py-2 bg-[#004aad] text-white rounded-lg hover:bg-[#cb6ce6] transition-colors"
        >
          See All
        </button>
      )}
    </div>
  );
};

export default CardList;
