import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LeftBar from "./Navbar/LeftBar";
import SecondTranche from "../../UserForm/SecondTranche";
import PostSeed from "../../UserForm/Postseed";
import Qpr from "../../UserForm/Qpr";
import Matchingloan from "../../UserForm/Matchingloan";
import Incubation from "../../UserForm/Incubation";
import Acceleration from "../../UserForm/Acceleration";
import Reimbursement from "../../UserForm/Reimbursement";
import Coworking from "../../UserForm/Coworking";
import UserProfile from "./Home";
import HomeSection from "./HomeSection";
import Grievance from "../../UserForm/Grievance";
import SeedFund from "../../UserForm/SeedFund";
import StartupForm from "../../UserForm/Startupform";
import StatusDialog from "../../UserForm/StatusDialog";
import SecondTranchePartialReject from "./FieldsUpdate/SecondTranchePartialReject";
import PostSeedPartialReject from "./FieldsUpdate/PostSeedPartialReject";
import SeedFundPartialReject from "./FieldsUpdate/SeedFundPartialReject";
import StartupFormPartialReject from "./FieldsUpdate/StartupFormPartialReject";
import UserNotification from "../../Userform/UserNotification";

const COMPONENTS = {
  HomeSection,
  Matchingloan,
  Incubation,
  SeedFund,
  Qpr,
  Reimbursement,
  Coworking,
  Acceleration, 
  StartupForm,
  SecondTranche,
  PostSeed,
  Grievance,
  SecondTranchePartialReject,
  UserNotification,
};
const PARTIAL_REJECT_COMPONENTS = {
  SecondTranche: SecondTranchePartialReject,
  PostSeed:PostSeedPartialReject,
  SeedFund:SeedFundPartialReject,
  StartupForm:StartupFormPartialReject

};

const StartupProfileMain = () => {
  const [activePage, setActivePage] = useState("HomeSection");
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogStatus, setDialogStatus] = useState({ isVisible: false, title: "", subtitle: "", buttonVisible: false, status: "" });
  const navigate = useNavigate();
  const [partialReject, setPartialReject] = useState({isVisible: false,comment: "",component: null,});

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      navigate("/login");
    }
  }, [navigate]);


  const checkFormStatus = async (newPanel) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setDialogStatus({ isVisible: true, title: "Authentication Error", subtitle: "No token found", buttonVisible: false, status: "failed" });
      return;
    }

    try {
      let apiUrl = "";
      if (newPanel === "StartupForm") {
        apiUrl = "http://localhost:3007/api/StartupProfile/user-document";
      } else if (newPanel === "SeedFund") {
        apiUrl = "http://localhost:3007/api/seed-fund/status";
      } else if (newPanel === "PostSeed") {
        apiUrl = "http://localhost:3007/api/post-seed/status";
      } else if (newPanel === "SecondTranche") {
        apiUrl = "http://localhost:3007/api/second-tranche/status";
      }

      if (apiUrl) {
        setDialogStatus({ isVisible: true, title: "Checking Form Status", subtitle: "Wait while we are fetching form status!", buttonVisible: false, status: "checking" });

        const response = await axios.get(apiUrl, {
          headers: { Authorization: token },
        });
        console.log(response.data);

        if (response.data && response.data.document) {
          const { document } = response.data;
          const formStatus = document.documentStatus;
          const comment = document.comment;

          if (formStatus === "null"|| !formStatus) {
            setDialogStatus({ isVisible: false, title: "", subtitle: "", buttonVisible: false, status: "" });
            setActivePage(newPanel);
          } else if (formStatus === "Accepted") {
            setDialogStatus({ isVisible: true, title: "Form Accepted", subtitle: "Your form has been accepted.", buttonVisible: true, status: "success" });
            //setActivePage("UserProfile");
          } else if (formStatus === "Rejected") {
            setDialogStatus({ isVisible: true, title: "Form Rejected", subtitle: `Your form has been rejected. Redirecting to refill...\n${document.comment}`, buttonVisible: false, status: "failed" });
            setTimeout(() => {
              setActivePage(newPanel);
              setDialogStatus({ isVisible: false, title: "", subtitle: "", buttonVisible: false, status: "" });
            }, 3000);
          } else if (formStatus === "created" || formStatus === "Updated") {
            setDialogStatus({ isVisible: true, title: "Form Under Review", subtitle: "Your form is under review.", buttonVisible: true, status: "under review" });
            //setActivePage("UserProfile");
          } else if (formStatus === "Partially Rejected") {
            const PartialRejectComponent = PARTIAL_REJECT_COMPONENTS[newPanel];
            setDialogStatus({
              isVisible: true,
              title: "Form Partially Rejected",
              subtitle: `Your form has been partially rejected.`,
              buttonVisible: false,
              status: "failed",
            });
            if (PartialRejectComponent) {
              

              setTimeout(() => {
                setPartialReject({
                  isVisible: true,
                  comment,
                  component: PartialRejectComponent,
                });
                setDialogStatus({
                  isVisible: false,
                  title: "",
                  subtitle: "",
                  buttonVisible: false,
                  status: "",
                });
              }, 3000);
            }else{

            }
          }
        } else {
          throw new Error("Invalid response structure");
        }
      } else {
        setActivePage(newPanel);
      }
    } catch (error) {
      console.error("Error checking form status:", error);
      setDialogStatus({ isVisible: true, title: "Error", subtitle: "Failed to retrieve form status.", buttonVisible: true, status: "failed" });
    }
  };

  const handleFormSubmitSuccess = () => {
    setActivePage("HomeSection");
  };
  const changePanel = (newPanel) => {
    if (newPanel === "StartupForm" || newPanel === "SeedFund" || newPanel === "SecondTranche" || newPanel === "PostSeed") {
      checkFormStatus(newPanel);
    } else if (COMPONENTS[newPanel]) {
      setActivePage(newPanel);
    } else {
      console.error("Invalid panel name:", newPanel);
      setActivePage("UserProfile");
    }
  };

  const ActiveComponent = COMPONENTS[activePage] || HomeSection;

  return (
    <div className="flex w-screen">
      <LeftBar changePanel={changePanel} selectedItem={selectedItem} />
      <div className="flex-grow w-[75%]">
        <ActiveComponent changePanel={changePanel} 
                  onFormSubmitSuccess={handleFormSubmitSuccess}/>
      </div>
      <StatusDialog
        isVisible={dialogStatus.isVisible}
        title={dialogStatus.title}
        subtitle={dialogStatus.subtitle}
        buttonVisible={dialogStatus.buttonVisible}
        onClose={() => setDialogStatus({ ...dialogStatus, isVisible: false })}
        status={dialogStatus.status}
      />
       {partialReject.isVisible &&
        partialReject.component && (
          <partialReject.component
            isVisible={partialReject.isVisible}
            comment={partialReject.comment}
            onClose={() => setPartialReject({ isVisible: false, comment: "", component: null })}
          />
        )}
    </div>
  );
};

export default StartupProfileMain;
