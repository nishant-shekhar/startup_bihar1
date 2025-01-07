import React from "react";

const PersonProfileCard = ({ image, name, role, animationDelay, linkedin, technologies }) => {
    return (
        <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full max-w-[260px] p-4 group transition-transform duration-300 hover:scale-105"
            data-aos-delay={animationDelay}
        >
             <div className="w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 mx-auto rounded-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
            </div>
            <h3 className="text-md md:text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 mt-2 mb-1">
                {name}
            </h3>
            <p className="text-xs md:text-sm text-blue-700 group-hover:text-gray-800 transition-colors duration-300">
                {role}
            </p>
            <p className="text-xs md:text-sm text-gray-600 transition-colors duration-300">
                {technologies}
            </p>
        </a>
    );
};

export default PersonProfileCard;
