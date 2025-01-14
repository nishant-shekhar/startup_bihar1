// Events.jsx
import React from "react";
import NavBarNew from '../HomePage/NavBarNew';
import Footer from '../HomePage/footer';
import EventsData from "./EventsData";
import topImage from "/Users/nishantshekhar/Documents/GitHub/startup_bihar1/Frontend/src/assets/top_right.png"
import bottomImage from "/Users/nishantshekhar/Documents/GitHub/startup_bihar1/Frontend/src/assets/bottom_left.png"


const EventCard = ({ imgurl, dateandtime, title, tag, subtitle, projectLink }) => {

  const handleMoreDetailsClick = () => {
    const url = projectLink.startsWith("http") ? projectLink : `https://${projectLink}`;
    window.open(url, "_blank");
  };

  return (
    <div>
      <div className="overflow-hidden rounded-lg border hover:shadow-xl transition-shadow flex-1 min-w-0  mt-1 bg-gray-200 backdrop-filter backdrop-blur-sm bg-opacity-50">
        <div className="mx-5 mt-5 h-40 overflow-hidden rounded-lg">
          <img src={imgurl} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <div className="text-md text-green-500 font-light mb-2">{dateandtime}</div>
          <h3 className="text-xl font-semibold mb-2 truncate">{title}</h3>
          <div className="text-sm text-gray-600 truncate">
            <span className=" px-2 py-2 text-indigo-600">{tag}</span> • {subtitle}
          </div>
          <hr className="mt-3" />
          <button
            type="button"
            onClick={handleMoreDetailsClick}
            className="bg-blue-600 py-2 w-3/6 px-1 rounded-full mt-3 text-white"
          >
            More Details
          </button>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  return (
<div className="h-screen ">

<div>
  <NavBarNew />
  <div className="text-center px-4">
    <p className="text-xl md:text-md font-bold text-[#303462] data-aos=fade-up pt-32">Startup Bihar</p>
    <h2 className="pt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-[#303462]">Past Events</h2>

  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-10 py-6  mb-2">
  {EventsData.map((event) => (
          <EventCard
            key={event.id}
            imgurl={event.imgurl}
            dateandtime={event.dateandtime}
            title={event.title}
            tag={event.tag}
            subtitle={event.subtitle}
            projectLink={event.projectLink}
          />
        ))}
  </div>
  <div className="text-center mb-8 px-4">

  </div>

  
  <Footer />
</div>
</div>

    
  );
};

export default Events;
