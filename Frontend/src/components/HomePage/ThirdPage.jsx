import React, { useState } from 'react';
import './ThirdPage.css';

const ThirdPage = () => {
    const [activeTab, setActiveTab] = useState("notifications");
    const notifications = [
            { text: 'Startup Evaluation Test Result Held on 07th August 2024', date: 'Aug 7, 2024', author: 'Admin', link: 'https://startup.bihar.gov.in/api/upload/photo/StartUP_Evaluation_Result%20_07_Aug_2024_b736de13ac.pdf' },
        { text: 'Bihar Purchase Preference Policy updated, 2024', date: 'Aug 2024', author: 'Admin', link: 'https://startup.bihar.gov.in/api/upload/photo/D__GazettePrinting_GazettePublished_749_2_2024_3016b57b6f.pdf' },
        { text: 'Result of startup cell coordinator interview held on 24th August 2024', date: 'Aug 24, 2024', author: 'Admin', link: 'https://startup.bihar.gov.in/api/upload/photo/Startupcell_result_153bcc10c12.pdf' },
        { text: 'Startup Evaluation Test Result Held on 13th September 2024', date: 'Sep 13, 2024', author: 'Admin', link: 'https://startup.bihar.gov.in/api/upload/photo/StartUP_Evaluation_Result%20_13_September_2024_f71367d10c10.pdf' },
        { text: 'Startup Evaluation Test Result Held on 07th October 2024', date: 'Oct 7, 2024', author: 'Admin', link: 'https://startup.bihar.gov.in/api/upload/photo/StartUP_Evaluation_Result%20_07_October_2024_fc53bad3e2.pdf' },
        { text: 'New Startup Evaluation Test Result Held on 15th November 2024', date: 'Nov 15, 2024', author: 'Admin', link: 'https://startup.bihar.gov.in/api/upload/photo/StartUP_Evaluation_Result%20_15_November_2024_a92dabf022.pdf' },

        { text: '🚀🚀 New Startup Evaluation Test Result Held on 8th & 9th January 2025 🚀🚀', date: 'Jan 20, 2025', author: 'Admin', link: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FNotification%2FStartUP_Evaluation_Result%20_08_9th_January_2025.pdf?alt=media&token=e00dfc6b-b0f7-410a-9256-96ccc48866fc' },
        { text: '🚀🚀 New Startup Evaluation Test Result Held on 06th February 2025 🚀🚀', date: 'Feb 11, 2025', author: 'Admin', link: 'https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FNotification%2FStartUP_Evaluation_Result%20_06_February_2025.pdf?alt=media&token=d6f31ec2-5723-4068-8c0e-588f015d10c6' },
        { text: '🚀🚀 New Startup Evaluation Test Result Held on 7th, 10th, 11th March 2025 🚀🚀', date: 'Feb 15, 2025', author: 'Admin', link: '    https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FNotification%2FStartUP_Evaluation_Result%20_7_10_11_March_2025.pdf?alt=media&token=fac685ec-53bf-4567-b385-b479de8112ee' },
    ];
    

    const appNotifications = [
        { text: 'New Startup Evaluation Test Result Held on 15th November 2024', date: 'Nov 15, 2024', author: 'Admin', link: 'https://example.com/nov15-result' },
        { text: 'Startup Evaluation Test Result Held on 07th October 2024', date: 'Oct 7, 2024', author: 'Admin', link: 'https://example.com/oct7-result' },
        { text: 'Startup Evaluation Test Result Held on 13th September 2024', date: 'Sep 13, 2024', author: 'Admin', link: 'https://example.com/sep13-result' },
        { text: 'Result of startup cell coordinator interview held on 24th August 2024', date: 'Aug 24, 2024', author: 'Admin', link: 'https://example.com/aug24-interview' },
        { text: 'Bihar Purchase Preference Policy updated, 2024', date: 'Aug 2024', author: 'Admin', link: 'https://example.com/bpp-policy' },
        { text: 'Startup Evaluation Test Result Held on 07th August 2024', date: 'Aug 7, 2024', author: 'Admin', link: 'https://example.com/aug7-result' },
        { text: 'Startup Evaluation Test Result Held on 27th June 2024', date: 'Jun 27, 2024', author: 'Admin', link: 'https://example.com/jun27-result' },
        { text: 'Startup Evaluation Test Result Held on 28th May 2024', date: 'May 28, 2024', author: 'Admin', link: 'https://example.com/may28-result' },
        { text: 'Startup Evaluation Test Result Held on 30th April 2024', date: 'Apr 30, 2024', author: 'Admin', link: 'https://example.com/apr30-result' },
        { text: 'Startup Evaluation Test Result Held on 2nd April 2024', date: 'Apr 2, 2024', author: 'Admin', link: 'https://example.com/apr2-result' },
      ];

    const renderNotifications = (data) => {
        return data.map((notification, index) => (
            <div key={index} className="my-2 text-white">
                <a 
                    href={notification.link || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-blue-500 hover:underline"
                >
                    {notification.text}
                </a>
                <p className="text-xs text-gray-400">{notification.date} by {notification.author}</p>
            </div>
        ));
    };
    


    return (
        <div>
            <div id="product" className="coworking bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="text-center text-base font-semibold text-indigo-600">
                        Transforming ideas into enterprises
                    </h2>
                    <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
                        Startup Bihar Vision for Innovation                       </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600 text-center" >
                        Startup Bihar aims to empower local entrepreneurs by providing the resources, mentorship, and financial support needed to build scalable businesses that contribute to the state’s economic development.
                    </p>

                    <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                        {/* startup_policy */}
                        <div className="relative lg:row-span-2">
                            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-lg lg:rounded-l-[calc(2rem+1px)]">
                                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                        Bihar Business Connect
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600 max-lg:text-center">
                                        Bihar Business Connect 24 has also attracted significant investments and opened new opportunities for local startups to thrive.
                                    </p>

                                </div>
                                <div
                                    className="relative min-h-[30rem] w-full grow max-lg:mx-auto max-lg:max-w-sm cursor-pointer"
                                   onClick={() => window.open("https://biharbusinessconnect.com/", "_blank")}
                                    title="BBC 2024"
                                >
                                    <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-8 border-t-8 border-gray-700 bg-gray-900 shadow-2xl transition-transform duration-300 hover:scale-105">
                                        <img
                                            className="size-full object-cover object-top"
                                            src="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FFB_IMG_1736488698591.jpg?alt=media&token=6a91c5af-675c-45b8-9311-d0546de3e75e"
                                            alt="Mobile friendly"
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
                        </div>
                        {/* startup_fund */}
                        <div className="relative max-lg:row-start-1">
                            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-lg max-lg:rounded-t-[calc(2rem+1px)]">
                                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                        Bihar Startup Policy 2022
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600 max-lg:text-center">
                                    Providing interest-free loans of up to ₹10 lakh, along with dedicated support for women entrepreneurs, empowering startups to innovate and drive economic growth.                                    </p>

                                </div>
                                <div
                                    className="relative  w-full grow max-lg:mx-auto max-lg:max-w-sm cursor-pointer"
                                    onClick={() => window.open("https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FBihar%20Start%20Up%20Policy%202022%20-%20English.pdf?alt=media&token=aefa13ec-30a4-46f8-98a9-87b9cb5b8768", "_blank")}
                                    title="Click to view the PDF"
                                >
                                    <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2 hover:scale-105">
                                    <img
                                        className="w-full max-lg:max-w-xs"
                                        src="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FImage%20(5).png?alt=media&token=81c7c911-ea44-4785-9201-106bfb36a0ca"
                                        alt="Performance"
                                    />
                                    </div>
                                </div>
                               
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
                        </div>
                        {/* Security Section */}
                        <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                            <div className="absolute inset-px rounded-lg bg-white"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-lg items-center">
                                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                        Incubation & Mentorship
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600 max-lg:text-center">
                                        Bihar has established incubation hubs like Bihar Innovation
                                        Lab and Bihar Startup Hub, partnering with top institutes of
                                        Bihar to support entrepreneurship.
                                    </p>
                                </div>
                                <div className="flex flex-1 items-center max-lg:py-6 lg:pb-2">
                                    <img
                                        className="h-[min(152px,40cqw)] object-cover object-center"
                                        src="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2Fmentorship_incubation.png?alt=media&token=94481429-264e-47ee-8c12-cfad0ca902b0"
                                        alt="mentorship"
                                    />
                                </div>
                            </div>
                            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
                        </div>
                        {/* Powerful APIs Section */}
                        <div className="relative lg:row-span-2">
                            <div className="absolute inset-px rounded-lg bg-white lg:rounded-r-[2rem] max-lg:rounded-b-[2rem]"></div>
                            <div className="relative flex h-full flex-col overflow-hidden rounded-lg max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                                    <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                                        1400+ Startups funded
                                    </p>
                                    <p className="mt-2 text-sm text-gray-600 max-lg:text-center">
                                        Over 1400 startups have been funded under the Bihar Startup
                                        Policy, fostering innovation and entrepreneurship.
                                    </p>
                                </div>
                                <div className="relative min-h-[30rem] w-full grow">
                                    <div className="absolute bottom-0 left-10 right-0 top-1 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                                        {/* Tab headers */}
                                        <div className="flex bg-gray-800/40 ring-1 ring-white/5 z-10">
                                            <div
                                                className={`flex-1 text-center py-2 cursor-pointer ${activeTab === "notifications" ? "bg-violet-900 text-white" : "bg-gray-600 text-gray-300"}`}
                                                onClick={() => setActiveTab("notifications")}
                                            >
                                                Notifications
                                            </div>
                                            {/* 
                                            <div
                                                className={`flex-1 text-center py-2 cursor-pointer ${activeTab === "appNotifications" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300"}`}
                                                onClick={() => setActiveTab("appNotifications")}
                                            >
                                                App Notifications
                                            </div>
                                            */}
                                        </div>

                                        {/* Scrollable Section */}
                                        <div className="px-6 pb-14 pt-6 overflow-hidden">
                                            <div
                                                className={`notifications-scroll ${activeTab === "notifications" ? "show-notifications" : "show-app-notifications"}`}
                                                style={{
                                                    paddingTop: "2rem", // Ensure space between header and scroll area
                                                    height: "calc(100% - 4rem)", // Account for the header's height
                                                }}
                                            >
                                                {activeTab === "notifications"
                                                    ? renderNotifications(notifications)
                                                    : renderNotifications(appNotifications)}
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>


                            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ThirdPage
