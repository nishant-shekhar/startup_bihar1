import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StarterAdminForm from "./AdminForm";
import SeedAdminForm from "./seedAdminForm";
import SecondTrancheAdminForm from "./SecondTrancheAdmin";
import Navbar from "./Navbar/Navbar";
import accelerationProgrammeModule from './accelerationAdmin';
import TopNavbar from "./Navbar/TopNavBar";

const App = () => {
  return (
    <Router>
      <div className="">
        <TopNavbar/>
      <div className="flex">
        <Navbar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/startupProfile" element={<StarterAdminForm />} />

            <Route path="/seedFund" element={<SeedAdminForm />} />

            <Route path="/secondTranche" element={<SecondTrancheAdminForm />} />
            <Route
              path="/accelerationProgramme"
              element={<accelerationProgrammeModule />}
            />
          </Routes>
        </div>
      </div>
      </div>
    </Router>
  );
};

export default App;
