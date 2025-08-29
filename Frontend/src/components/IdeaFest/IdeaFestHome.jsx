import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BgExpanded from "../../assets/bg_expanded.png"; 

const IdeaFestHome = () => {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.trim()) {
      navigate(`/certificate/${id}`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-no-repeat bg-bottom"
      style={{ backgroundImage: `url(${BgExpanded})` }}
    >
      {/* Navbar */}
 <nav className="w-full flex justify-between items-center px-8 py-1 border-b border-gray-300 bg-white/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <img src={"startup_bihar_logo1.png"} alt="IdeaFest Logo" className="h-20 w-30 object-contain" />
        </div>

        <ul className="flex gap-6 text-lg font-medium text-black">
          <li className="hover:text-gray-600 cursor-pointer">Home</li>
          <li className="hover:text-gray-600 cursor-pointer">About</li>
          <li className="hover:text-gray-600 cursor-pointer">Contact</li>
        </ul>
      </nav>
      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-start text-center text-black px-4 pt-16">
        <h1 className="text-4xl font-bold mb-2">IdeaFest Certificate Portal</h1>
        <p className="mb-6 text-sm text-gray-500 ">
          Enter your registered ID to download your IdeaFest certificate.
        </p>

        <form
         style={{
  boxShadow: 'rgba(17, 12, 46, 0.15) 0px 48px 100px 0px'
}}

          onSubmit={handleSubmit}
          className="p-6 rounded-2xl border border-gray-200 shadow-lg flex gap-3 justify-center max-w-md mx-auto bg-white/80 backdrop-blur-sm"
        >
          <input
            type="text"
            placeholder="Enter your ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none text-black placeholder-gray-500 flex-1"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white font-semibold rounded-lg shadow hover:bg-gray-800 transition"
          >
            Get Certificate
          </button>
        </form>
      </div>

    </div>
  );
};

export default IdeaFestHome;
