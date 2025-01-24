import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const RegisterStartup = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const categoryMapping = {
    
      "Art and handicrafts": "Art & Entertainment",
      "Food Processing": "Food",
      "Others (Shoe Laundry)": "Logistics",
      "IT/ITeS": "Technology",
      "Energy": "Environment",
      "Healthcare": "Health",
      "Finance and allied sectors": "Finance",
      "Packaging and Logistics": "Logistics",
      "E-commerce": "Retail",
      "Edu-tech": "Edu-tech",
      "Agriculture and allied sector": "Food",
      "IoT/ICT": "Smart Innovations",
      "Urban Transportation": "Logistics",
      "Others (Iron and Steels)": "Manufacturing",
      "Fashion and Apparels": "Retail",
      "Environment and Waste Management": "Environment",
      "Automobile sector": "Logistics",
      "Others (Manufacturing)": "Manufacturing",
      "Others (Household services)": "Retail",
      "Travel and Tourism": "Travel",
      "FMCG": "Retail",
      "E-Vehicle": "Smart Innovations",
      "Construction/ architecture/Proptech": "Technology",
      "Travel/Tourism & Hospitality": "Travel",
      "Others (Photography)": "Art & Entertainment",
      "Drone Technology": "Smart Innovations",
      "AR/VR": "Smart Innovations",
      "Media and Entertainment": "Art & Entertainment",
      "HR Services": "Technology",
      "AI/ML": "Smart Innovations",
      "Manufacturing/Industrial Automation": "Manufacturing",
      "Robotics Technology": "Smart Innovations",
      "Others (Relationship management)": "Technology",
      "Others (Event management)": "Art & Entertainment",
      "Others (Social Enterprise)": "Environment",
      "Others (Marketing)": "Technology",
      "Others (Grass Tea)": "Food",
      "Others (Startup services)": "Technology",
      "Others": "Technology",
      "E-commerce (Household)": "Retail",
      "Others (Saloon Services Online)": "Retail",
      "E-commerce (Spiritual)": "Retail",
      "E-commerce (Logistics)": "Logistics",
      "Others (Digital Marketing)": "Technology",
      "Others (Nano Technology)": "Smart Innovations",
      "Horeca": "Retail"
  
  
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryData = e.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Map the Excel data to the required fields
      const formattedData = sheetData
        .map((row) => {
          // Basic validation
          if (
            !row["User ID"] ||
            !row["Password"] ||
            !row["Registration No"] ||
            !row["Startup Name"]
          ) {
            console.error("Invalid row data:", row); // Log invalid rows for debugging
            return null; // Skip invalid rows
          }

          // Map category if found; otherwise, keep the original category
          const originalCategory = row["Category"]?.trim() || "";
          const mappedCategory = categoryMapping[originalCategory]
            ? categoryMapping[originalCategory]
            : originalCategory;

          // Parse integer values (default to 0 if empty or invalid)
          const seedFundAmount = parseInt(row["First Instalment Released"], 10) || 0;
          const secondTrancheAmount = parseInt(row["2nd/Last Instalment Released"], 10) || 0;
          const postSeedAmount = parseInt(row["Post Seed Fund"], 10) || 0;
          const matchingLoanAmount = parseInt(row["Matching Loan (In Lakhs)"], 10) || 0;

          return {
            user_id: row["User ID"],
            password: row["Password"],
            registration_no: row["Registration No"],
            company_name: row["Startup Name"],
            startup_since: row["Startup Since"] || "2022",
            about: row["About"] || "",
            founder_name: row["Founder Name"] || "",
            email: row["Email Id"] || "",
            mobile: String(row["Mobile"] || ""),
            districtRoc: row["District ROC"] || "",
            dateOfIncorporation: row["Date of Incorporation"] || "",
            address: row["Address"] || "",
            cin: row["CIN"] || "",
            // Final category: mapped if possible, otherwise original
            category: mappedCategory,

            topStartup: row["Top Startup"] === "Yes",

            seedFundAmount,
            secondTrancheAmount,
            postSeedAmount,
            matchingLoanAmount,
          };
        })
        .filter(Boolean); // Remove any null entries

      setData(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleRegisterUser = async (userData, index) => {
    try {
      setLoading(true);

      // Send exactly what's in 'userData' to the server
      const response = await axios.post(
        "http://localhost:3007/api/userlogin/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      alert(`User created successfully: ${response.data.user.user_id}`);

      // Mark the row as Registered in UI
      const updatedData = [...data];
      updatedData[index].status = "Registered";
      setData(updatedData);
    } catch (error) {
      console.error("Error creating user:", error);
      alert(
        error.response?.data?.error || "Failed to create user. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadUpdatedExcel = () => {
    // Use the final category (row.category) without re-mapping
    const updatedData = data.map((row) => ({
      "User ID": row.user_id,
      Password: row.password,
      "Registration No": row.registration_no,
      "Startup Name": row.company_name,
      "Startup Since": row.startup_since,
      About: row.about,
      "Founder Name": row.founder_name,
      "Email Id": row.email,
      Mobile: row.mobile,
      Category: row.category, // Use the final category already stored

      "District ROC": row.districtRoc, 
      "Date of Incorporation": row.dateOfIncorporation, 
      "Address": row.address, 
      "CIN": row.cin, 
    
  

      "Top Startup": row.topStartup ? "Yes" : "No",

   

      "First Instalment Released": row.seedFundAmount,
      "2nd/Last Instalment Released": row.secondTrancheAmount,
      "Post Seed Fund": row.postSeedAmount,
      "Matching Loan (In Lakhs)": row.matchingLoanAmount,

      Status: row.status || "Pending",
    }));

    const worksheet = XLSX.utils.json_to_sheet(updatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Data");
    XLSX.writeFile(workbook, "Updated_Startup_Data.xlsx");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Register Startups</h1>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {data.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">User ID</th>
                  <th className="border px-4 py-2">Password</th>
                  <th className="border px-4 py-2">Registration No</th>
                  <th className="border px-4 py-2">Company Name</th>
                  <th className="border px-4 py-2">Startup Since</th>
                  <th className="border px-4 py-2">About</th>
                  <th className="border px-4 py-2">Founder Name</th>
                  <th className="border px-4 py-2">Mobile</th>
                  <th className="border px-4 py-2">Email Id</th>
                  <th className="border px-4 py-2">Category</th>

                  <th className="border px-4 py-2">District ROC</th>
                  <th className="border px-4 py-2">Date of Incorporation</th>
                  <th className="border px-4 py-2">Address</th>
                  <th className="border px-4 py-2">CIN</th>
              

                  <th className="border px-4 py-2">Top Startup</th>
                  <th className="border px-4 py-2">First Instalment</th>
                  <th className="border px-4 py-2">2nd/Last Instalment</th>
                  <th className="border px-4 py-2">Post Seed Fund</th>
                  <th className="border px-4 py-2">Matching Loan (Lakhs)</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{row.user_id}</td>
                    <td className="border px-4 py-2">{row.password}</td>
                    <td className="border px-4 py-2">{row.registration_no}</td>
                    <td className="border px-4 py-2">{row.company_name}</td>
                    <td className="border px-4 py-2">{row.startup_since}</td>
                    <td className="border px-4 py-2">{row.about}</td>
                    <td className="border px-4 py-2">{row.founder_name}</td>
                    <td className="border px-4 py-2">{row.mobile}</td>
                    <td className="border px-4 py-2">{row.email}</td>
                    <td className="border px-4 py-2">{row.category}</td>
                    <th className="border px-4 py-2">{row.districtRoc}</th>
                  <th className="border px-4 py-2">{row.dateOfIncorporation}</th>
                  <th className="border px-4 py-2">{row.address}</th>
                  <th className="border px-4 py-2">{row.cin}</th>
              
                    <td className="border px-4 py-2">
                      {row.topStartup ? "Yes" : "No"}
                    </td>
                    <td className="border px-4 py-2">{row.seedFundAmount}</td>
                    <td className="border px-4 py-2">
                      {row.secondTrancheAmount}
                    </td>
                    <td className="border px-4 py-2">{row.postSeedAmount}</td>
                    <td className="border px-4 py-2">
                      {row.matchingLoanAmount}
                    </td>
                    <td className="border px-4 py-2">
                      {row.status || "Pending"}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={() => handleRegisterUser(row, index)}
                        disabled={row.status === "Registered" || loading}
                      >
                        Register User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            onClick={downloadUpdatedExcel}
          >
            Download Updated Excel
          </button>
        </>
      )}
    </div>
  );
};

export default RegisterStartup;
