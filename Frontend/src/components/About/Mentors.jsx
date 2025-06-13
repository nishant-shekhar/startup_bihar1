import React from 'react';
import NavBarNew from '../HomePage/NavBarNew';
import Footer from '../HomePage/footer';

const mentorsData = [
  {
    id: 1,
    name: 'Rahul Agarwal',
    pic: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fmentors%2Frahulagarwal.jpeg?alt=media&token=d60e2da4-954d-44d9-9e2a-33db462e0dbf",
    designation: 'Chief Operating Officers at Expressbees',
    linkedinUrl: 'https://www.linkedin.com/in/rahul-agrawal-a57099113/',
    areaOfExpertise: 'Financial Management, Fund Raising, Investor Relations, Startup Mentorship, Strategic Planning and Implementation',
  },
  
  {
    id: 2,
    name: 'Tushar Jain',
    pic: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fmentors%2Ftusarjain.jpeg?alt=media&token=b41e5360-72ca-4f52-a027-cfc23d1576f9",
    designation: 'Managing Director - High Spirit Commercial Ventures Pvt. Ltd.',
    linkedinUrl: 'https://www.linkedin.com/in/tushar-jain-4b8586a6/',
    areaOfExpertise: 'Manufacturing, Retail, Production, Supply Chain Management, Quality Analysis, Sales & Marketing',
  },
  {
    id: 3,
    name: 'Dr. Dilip Patel',
    pic: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fmentors%2Fdilippatel.jpeg?alt=media&token=42126fb8-adbf-4b20-913a-5052d1339330",
    designation: 'MBBS, MD Chairman & Managing Director Patel Group of Industries',
    linkedinUrl: 'https://www.linkedin.com/in/drdilippatelcmd/',
    areaOfExpertise: 'Biofuels, Renewable Energy, Agriculture and Food Processing, Power Generation, Mining, Healthcare',
  },
];

const Mentors = () => {
  return (
    <div className="h-screen ">

      <div>
        <NavBarNew />
        <div className="text-center px-4">
          <p className="text-xl md:text-md font-bold text-[#303462] data-aos=fade-up pt-32">Startup Bihar</p>
          <h2 className="pt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-[#303462]">List of Mentors</h2>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:px-10 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10 px-10 bg-gray-100">
          {mentorsData.map((mentor) => (
            <div
              key={mentor.id}
              className="overflow-hidden rounded-lg border hover:shadow-xl transition-shadow flex-1 min-w-0 mt-1 bg-gray-200 backdrop-filter backdrop-blur-sm bg-opacity-50"
            >
              <div className="mx-5 mt-5 h-48 overflow-hidden rounded-lg">
                <img
                  src={mentor.pic}
                  alt={mentor.name}
                  className="w-40 h-40 rounded-full relative top-8 mx-auto mb-4 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 truncate">{mentor.name}</h3>
                <div className="text-md text-green-500 font-light mb-2">{mentor.designation}</div>
                <div className="text-sm text-gray-600 mb-3 truncate">{mentor.areaOfExpertise}</div>
                <hr className="mt-3" />
              <a
  href={mentor.linkedinUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="bg-blue-600 py-2 w-3/6 px-1 rounded-full mt-3 text-white text-center block transform hover:scale-100 mx-auto"
>
  View LinkedIn
</a>

              </div>
            </div>
          ))}
        </div>
        <div className="text-center mb-8 px-4">

        </div>


        <Footer />
      </div>
    </div>
  );
};

export default Mentors;
