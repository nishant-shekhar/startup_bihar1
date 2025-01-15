import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const RegisterStartup = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryData = e.target.result;
      const workbook = XLSX.read(binaryData, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Map the Excel data with necessary fields

      const formattedData = sheetData.map((row) => {
        if (!row["User ID"] || !row["Password"] || !row["Registration No"] || !row["Startup Name"]) {
          console.error("Invalid row data:", row); // Log invalid rows for debugging
        }
      
        return {
          user_id: row["User ID"],
          password: row["Password"],
          registration_no: row["Registration No"] || "",
          company_name: row["Startup Name"] || "",
          startup_since: row["Startup Since"] || "2022",
          about: row["About"] || "",
          founder_name: row["Founder Name"] || "",
          email: row["Email Id"] || "",
          mobile: String(row["Mobile"] || ""),
          category: row["Category"] || "General",
          topStartup: row["Top Startup"] === "Yes",
        };
      }).filter((row) => row.user_id && row.password && row.registration_no && row.company_name); // Filter valid rows only
      
 

      setData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  const handleRegisterUser = async (userData, index) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://startupbihar.in/api/userlogin/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );

      alert(`User created successfully: ${response.data.user.user_id}`);
      
      // Update the row in the table
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
    const updatedData = data.map((row) => ({
      "User ID": row.user_id,
      Password: row.password,
      "Registration No": row.registration_no,
      "Startup Name": row.company_name,
      "Startup Since": row.startup_since,
      About: row.about,
      "Founder Name": row.founder_name,
      "Mobile": row.mobile,
      "Email Id": row.email,
      "Category": row.category,
      "Top Startup": row.topStartup ? "Yes" : "No",
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
        <div>
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
                <th className="border px-4 py-2">Top Startup</th>
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
                  <td className="border px-4 py-2">
                    {row.topStartup ? "Yes" : "No"}
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
          <button
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            onClick={downloadUpdatedExcel}
          >
            Download Updated Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterStartup;
