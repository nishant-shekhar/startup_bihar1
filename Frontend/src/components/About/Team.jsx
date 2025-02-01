import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import topImage from "/Users/nishantshekhar/Documents/GitHub/startup_bihar1/Frontend/src/assets/top_right.png"
import bottomImage from "/Users/nishantshekhar/Documents/GitHub/startup_bihar1/Frontend/src/assets/bottom_left.png"
import PersonProfileCard from "../HomePage/PersonProfileCard";
import NavBarNew from "../HomePage/NavBarNew";


const teamLead = [
    {
        name: "Nishant Sekhar",
        role: "Founder, NS Apps Innovations",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQFUD3EMJW-SMQ/profile-displayphoto-shrink_800_800/B4DZR_Z.U3HkAg-/0/1737304303571?e=1743638400&v=beta&t=aelt0OVRghDVsVc87Jr_jT6U_UumWK59U16-DP0ZnDY",
        show: true,
        linkedin: "https://www.linkedin.com/in/nishantshekhar28/",
        technologies: "React, Node.js, Prisma, AWS",
    },
];

const teamhead = [
    {
        name: "Amit Kumar Verma",
        role: "Frontend Developer",
        image: "https://media.licdn.com/dms/image/v2/D5603AQHQTREGjm6ZAA/profile-displayphoto-shrink_800_800/B56ZSmkK1qHQAc-/0/1737961290080?e=1743638400&v=beta&t=O5TVqp4NyTesLiLhHc6gLbryEYfAILbI5w589Lkmip0",
        show: true,
        linkedin: "https://www.linkedin.com/in/amit-kumar-verma-50b236266/",
        technologies: "React.js, Tailwind CSS",
    },
    {
        name: "Pratush Sinha",
        role: "Backend Developer",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQFPUBM0kfxCiQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1683793618979?e=1741824000&v=beta&t=dIlHrKeILM-IQt_TZCv7NvZH-vgmj-Q6LQ3wu8FSp3M",
        show: true,
        linkedin: "https://www.linkedin.com/in/ps613/",
        technologies: "Node.js, Prisma, MySql",
    },
    {
        name: "Abhishek Anand",
        role: "React Developer",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQHgdEA3WVAhNQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1692214950711?e=1741824000&v=beta&t=be2Z8_hBGBwZXdsw04PNePEMU8gEhw2NQdlJ2nbtksw",
        linkedin: "https://www.linkedin.com/in/abhishek-anand-094799251/",
        technologies: "React.js, Tailwind CSS, Node.js",
    },
    {
        name: "Aditya Kumar",
        role: "React Developer",
        image: "https://media.licdn.com/dms/image/v2/D4E03AQGnU48IpbDc5A/profile-displayphoto-shrink_800_800/B4EZSroiAxHoAg-/0/1738046317285?e=1743638400&v=beta&t=uMhHI7ZUI2pzRiIHNj3EGP17AxqLieHmoCaLur-9Oc0",
        linkedin: "https://www.linkedin.com/in/aditya-kumar-780709320/",
        technologies: "React.js, Tailwind CSS",
    },
    {
        name: "Yuvika Kumari",
        role: "Frontend Developer",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQGYzOZRw7Rb_w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1704482269132?e=1741824000&v=beta&t=ZsiD16JWJfiHKGQOVnhHYwGMbt9qSlGK80Vd9D1nRwY",
        linkedin: "https://www.linkedin.com/in/yuvika-singh14/",
        technologies: "React.js, Tailwind CSS",
    },
];

const teamMembers = [
    {
        name: "Priyanshu Shankar",
        role: "QA Specialist",
        image: "https://media.licdn.com/dms/image/v2/D4D03AQFXF8LraML_hw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1714559521498?e=1741824000&v=beta&t=l2GYDKqEuBuPcp2sKXbaQBYn1FRV2x44Ph5T2BZ2N5s",
        linkedin: "https://www.linkedin.com/in/priyanshu-shankar-067831256/",
        technologies: "Test Automation, Bug Tracking",
    },
    {
        name: "Abhinav Kumar",
        role: "QA Specialist",
        image: "https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FWhatsApp%20Image%202024-12-09%20at%2015.42.22.jpeg?alt=media&token=dbcda014-652b-4951-8331-fa7f923aee37",
        linkedin: "https://www.linkedin.com/in/abhinab-kumar-546753279/",
        technologies: "Manual Testing, Bug Tracking",
    },
];

const Team = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
        });
    }, []);

    return (
        <div className="min-h-screen bg-white bg-no-repeat"
            style={{
                backgroundImage: `url(${topImage}), url(${bottomImage})`,
                backgroundPosition: "top right, bottom left",
            }}
        >
            <div className="grid grid-cols-1">
                <NavBarNew />
                <div className="text-center mb-8 px-4">
                    <p className="text-xl md:text-md font-bold text-[#303462] data-aos=fade-up pt-32" data-aos="zoom-in">
                        NS APPS INNOVATIONS
                    </p>
                    <h2 className="pt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-[#303462]">
                        Developer's Team
                    </h2>
                    <p className="text-sm text-gray-600 max-w-4xl mx-auto py-4">
                        NS Apps Innovations, a recognized startup by the Government of Bihar,
                        excels in app development using React.js, Node.js, and Flutter. With over 28
                        impactful projects like ASPIRE and Samadhan Apps, it transforms
                        governance through innovative tech solutions.
                    </p>
                </div>

                {/* Team Lead Section */}
                <div className="flex justify-center items-center  px-4">
                    <div className="flex flex-wrap gap-6">
                        {teamLead.map((member, index) => (
                            <PersonProfileCard
                                key={index}
                                name={member.name}
                                role={member.role}
                                image={member.image}
                                linkedin={member.linkedin}
                                technologies={member.technologies}
                                delay={ 3}
                            />
                        ))}
                    </div>
                </div>

                {/* Team Head Section */}
                <div className="flex justify-center items-center  px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-4 md:px-10">
                        {teamhead.map((member, index) => (
                            <PersonProfileCard
                                key={index}
                                name={member.name}
                                role={member.role}
                                image={member.image}
                                linkedin={member.linkedin}
                                technologies={member.technologies}

                                delay={4}
                            />
                        ))}
                    </div>
                </div>

                {/* Team Members Section */}
                <div className="flex justify-center items-center  px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 px-4 md:px-10">
                        {teamMembers.map((member, index) => (
                            <PersonProfileCard
                                key={index}
                                name={member.name}
                                role={member.role}
                                image={member.image}
                                linkedin={member.linkedin}
                                technologies={member.technologies}

                                delay={6}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
