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
    <div>
        <NavBarNew/>
        <div className="text-center mt-32">
          <h1 className="text-4xl font-bold text-gray-800">Past Events</h1>
          <p className="text-lg text-gray-600 mt-2">
            Discover the latest happenings and events tailored just for you. Stay tuned for exciting updates!
          </p>
        </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-10 py-5 relative h-screen overflow-y-auto bg-white" style={{
         backgroundImage: `url(${topImage}), url(${bottomImage})`,
         backgroundPosition: 'top right, bottom left',
         backgroundRepeat: 'no-repeat, no-repeat',
         backgroundAttachment: 'fixed, fixed', // This makes the images fixed
         }}>
            
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
    <Footer />
    </div>
  );
};

export default Events;
