import React, { useState } from "react";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill } from "react-icons/ri";


const UpdateStartup = () => {

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


    const excelDateToJSDate = (serial) => {
        const utcDays = Math.floor(serial - 25569); // Excel epoch starts from 1900
        const utcValue = utcDays * 86400; // Convert days to seconds
        const dateInfo = new Date(utcValue * 1000); // Convert seconds to milliseconds
      
        // Extract day, month, and year, then format as dd-mm-yyyy
        const day = String(dateInfo.getUTCDate()).padStart(2, "0");
        const month = String(dateInfo.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
        const year = dateInfo.getUTCFullYear();
      
        return `${day}-${month}-${year}`; // Format as dd-mm-yyyy
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
              if (
                !row["User ID"] ||
                !row["Password"] ||
                !row["Registration No"] ||
                !row["Startup Name"]
              ) {
                console.error("Invalid row data:", row); // Log invalid rows for debugging
                return null; // Skip invalid rows
              }
          
              const originalCategory = row["Category"]?.trim() || "";
              const mappedCategory = categoryMapping[originalCategory]
                ? categoryMapping[originalCategory]
                : originalCategory;
          
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
                // Check if dateOfIncorporation is an integer (Excel serial date) and convert it
                dateOfIncorporation: Number.isInteger(row["Date of Incorporation"])
                  ? excelDateToJSDate(row["Date of Incorporation"])
                  : row["Date of Incorporation"] || "",
                address: row["Address"] || "",
                cin: row["CIN"] || "",
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
      

    const handleSearchButtonClick = (e) => {
        e.preventDefault();
        // Handle search button click
    }

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

      const [editIndex, setEditIndex] = useState(null);
      const [editedRow, setEditedRow] = useState({});
      const [dateStamps, setDateStamps] = useState({});

    const handleEditClick = (index) => {
    setEditIndex(index);
    setEditedRow({ ...data[index] }); // clone current row
  };

  const handleInputChange = (e, field) => {
    setEditedRow({ ...editedRow, [field]: e.target.value });
  };

  const handleSaveClick = () => {
    const updatedData = [...data];
    updatedData[editIndex] = editedRow;
    setData(updatedData);
    setEditIndex(null);
  };
    
  const handleCancelClick = () => {
    setEditIndex(null);
    setEditedRow({});
  };



    return (
        <div className="relative h-screen overflow-y-auto bg-white">
            <div className="pt-4">
                <div className="text-center mb-2 px-4">
                    <p className="text-xl md:text-md font-bold text-black pt-8">
                    </p>
                    <h2 className="pt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-black">
                        Update Startup
                    </h2>
                    <p className="text-sm font-semibold text-gray-400 max-w-4xl mx-auto py-4">
                        Update the startup details here.
                    </p>
                </div>
                {/* Add your update form or content here */}
            </div>
            <div className="">
                {/* Add your startup update cards or components here */}
                {/* Example card */}

            {/*  serch bar */}

            <div className="flex items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center">
             <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-white border border-gray-300 rounded-2xl shadow hover:shadow-lg transition-all mt-4">
      <form className="flex items-center max-w-lg mx-auto">
        <label className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.75432 1.81954C7.59742 1.72682 7.4025 1.72682 7.24559 1.81954L1.74559 5.06954C1.59336 5.15949 1.49996 5.32317 1.49996 5.5C1.49996 5.67683 1.59336 5.84051 1.74559 5.93046L7.24559 9.18046C7.4025 9.27318 7.59742 9.27318 7.75432 9.18046L13.2543 5.93046C13.4066 5.84051 13.5 5.67683 13.5 5.5C13.5 5.32317 13.4066 5.15949 13.2543 5.06954L7.75432 1.81954ZM7.49996 8.16923L2.9828 5.5L7.49996 2.83077L12.0171 5.5L7.49996 8.16923ZM2.25432 8.31954C2.01658 8.17906 1.70998 8.2579 1.56949 8.49564C1.42901 8.73337 1.50785 9.03998 1.74559 9.18046L7.24559 12.4305C7.4025 12.5232 7.59742 12.5232 7.75432 12.4305L13.2543 9.18046C13.4921 9.03998 13.5709 8.73337 13.4304 8.49564C13.2899 8.2579 12.9833 8.17906 12.7456 8.31954L7.49996 11.4192L2.25432 8.31954Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
          </div>
          <input
            required=""
            placeholder="Search User ID"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="voice-search"
            type="text"
          />
          <button className="absolute inset-y-0 end-0 flex items-center pe-3" type="button"></button>
        </div>
        <button
          onClick={handleSearchButtonClick}
          className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-indigo-600 rounded-lg border border-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="submit"
        >
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-4 h-4 me-2">
            <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor"></path>
          </svg>
          Search
        </button>
      </form>
    </div>

    <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-white border border-gray-300 rounded-2xl shadow hover:shadow-lg transition-all mt-4">
      <div className="flex items-center gap-3 mb-4"></div>
      <label
        htmlFor="upload"
        className="w-full flex items-center justify-center px-4 py-3 bg-green-100 text-green-700 border-2 border-dashed border-green-400 rounded-lg cursor-pointer hover:bg-green-200 transition-all"
      >
        <RiFileExcel2Fill className="text-2xl mr-2" />
        Upload Excel File
      </label>
      <input
        id="upload"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  </div>
</div>

</div>

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
          {Object.keys(row).map((field, i) => (
            <td key={i} className="border px-4 py-2">
              {editIndex === index ? (
                <input
                  value={editedRow[field]}
                  onChange={(e) => handleInputChange(e, field)}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                row[field]?.toString()
              )}
            </td>
          ))}

          <td className="border px-4 py-2">
            {editIndex === index ? (
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  onClick={handleCancelClick}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => handleEditClick(index)}
              >
                Edit
              </button>
            )}
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
            <RiFileExcel2Fill className="inline-block mr-2" />
            Download Updated Excel
          </button>
        </>
      )}



          
            
        </div>
    )
}

export default UpdateStartup
