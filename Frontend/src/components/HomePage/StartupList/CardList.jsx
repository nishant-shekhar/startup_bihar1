
import React from "react";
import CompanyCardWide from "./CompanyCardWide";

const CardList = ({ startups }) => {
  if (!startups || startups.length === 0) {
    return (
      <div className="text-center text-gray-500">No startups found.</div>
    );
  }

  const startupMottos = [
    "Innovating for a better tomorrow.",
    "Empowering ideas, transforming industries.",
    "Where creativity meets technology.",
    "Revolutionizing the way the world works.",
    "Your vision, our innovation.",
    "Connecting people, changing lives.",
    "Building solutions for a smarter future.",
    "Redefining possibilities, one step at a time.",
    "Passion for progress, driven by purpose.",
    "Fueling growth, igniting potential.",
    "Making dreams a reality, every day.",
    "Think big, act bold, achieve greatness.",
    "Breaking barriers, shaping the future.",
    "Inspiring change, empowering communities.",
    "From concept to creation, we lead the way.",
    "Driving sustainability through innovation.",
    "Empowering startups, elevating success.",
    "Transforming challenges into opportunities.",
    "Dream it, build it, grow it.",
    "Innovation at the heart of everything we do."
];

  return (
    // Use px-4 for mobile, px-6 for larger screens
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-4 sm:px-6">
      {startups.map((startup, index) => (
        <CompanyCardWide
          key={index}
          logo={startup.logo || "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPink%20Marble%20Background%20Reminder%20Instagram%20Post%20(1).png?alt=media&token=dd704bc5-5cc1-48f4-a80a-a8ec12fa9512"}
          fundingStatus={startup.fundingStatus || "Not Funded"}
          name={startup.company_name}
          founder={startup.founder_name}
          founderLogo={startup.founder_dp}
          startupSince={startup.startup_since}
          Category={startup.category}
          user_id={startup.user_id}
          tagline={startup.moto || startupMottos[Math.floor(Math.random() * startupMottos.length)]}
        />
      ))}
    </div>
  );
};

export default CardList;
