import React from 'react';

import topImage from "/Users/nishantshekhar/Documents/GitHub/startup_bihar1/Frontend/src/assets/top_right.png";
import bottomImage from "/Users/nishantshekhar/Documents/GitHub/startup_bihar1/Frontend/src/assets/bottom_left.png";
import NavBarNew from '../HomePage/NavBarNew';
import Footer from '../HomePage/footer';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const IncubationNodalList = () => {
    const data = [
        {
            id: 1,
            centerName: "Chandragupt Institute of Management (CIMP) Patna",
            district: "Patna",
            email: ["director@cimp.ac.in", "ceo.startup@cimp.ac.in", "Startup@cimp.ac.in", "StartupHelpline@cimp.ac.in"],
            contactNo: ["9334076225", "9128912345"],
            contactPerson: ["Mr. Kumod Kumar"],
            designation: ["CAO, CIMP", "CEO, CIMP BIIF"],
            facilities: [
                "Grooming by Skilled Trainers",
                "2-month Orientation Programme",
                "Incubation, and Mentorship (from Domain Experts)",
                "Market Linkage",
                "Co-working space",
                "Resource Pool (Domain-specific)",
                "Network Access & Funding Support",
                "PGDM-IEV (AICTE-approved)"
            ]
        },
        {
            id: 2,
            centerName: "Indian Institute of Technology (IIT), Patna",
            district: "Patna",
            email: ["director@iitp.ac.in", "manager_ic@iitp.ac.in", "deepak_ic@iitp.ac.in"],
            contactNo: "9946060007",
            contactPerson: "Mr. Joseph Paul Arackalan",
            designation: "General Manager, IC-IITP",
            facilities: [
                "Electronics System Design and Prototyping",
                "PCB Designing and Manufacturing",
                "Electronic System Testing, Measurement and Calibration",
                "Mechanical Packaging and Product Prototyping",
                "MEMS Fabrication facility/Clean room"
            ]
        },
        {
            id: 3,
            centerName: "Birla Institute of Technology (BIT), Patna",
            district: "Patna",
            email: ["bitpatna@bitmesra.ac.in", "sskumar@bitmesra.ac.in"],
            contactNo: "9006960159",
            contactPerson: "Mr. Upendra",
            designation: "Assistant Professor",
            facilities: [
                "CADD Lab",
                "Concrete Technology Lab",
                "DDHS Lab",
                "Geology Engineering Lab",
                "Geotechnical Engineering Lab",
                "Environment Engineering Lab",
                "Structural Engineering Lab",
                "Survey Lab",
                "Transportation Engineering Lab",
                "Internal Combustion Engine Laboratory",
                "Automobile Engineering Laboratory",
                "Heat Transfer Laboratory",
                "Fluid and Hydraulics Machine Laboratory",
                "Apparatus of RAC Laboratory",
                "Strength of Material Laboratory"
            ]
        },
        {
            id: 4,
            centerName: "Bihar Agricultural University (BAU), SABOUR, Bhagalpur",
            district: "Bhagalpur",
            email: [
                "registrar.bau.sabour@gmail.com",
                "baustartupcellsabour@gmail.com",
                "richthakur61@gmail.com",
                "incubationcentrebau@gmail.com"
            ],
            contactNo: "7020165790",
            contactPerson: "Dr. Richa Kumari",
            designation: "Assistant Professor",
            facilities: [
                "Idea to Prototype (Focus area of agripreneurship)",
                "Focus Area of Agri-Startups (Prototype to Minimum Viable Product)",
                "2 months orientation programme",
                "Grooming by skilled trainers",
                "Mentorship from domain experts",
                "Network access"
            ]
        },

        {
            id: 5,
            centerName: "Central Institute of Petrochemicals Engineering & Technology (CIPET), Hajipur",
            district: "Hajipur",
            email: ["cipetpatna@gmail.com", "hajipur@cipet.gov.in"],
            contactNo: ["9437124606", "7470784301", "8709870822"],
            contactPerson: ["Mr. Sanjay Kumar Chaudhary", "Ram Swaroop Singh"],
            designation: ["Director and Head", "Senior Technical Officer"],
            facilities: [
                "Lab Facilities",
                "Automotive components/job work/mould work manufacturing through CNC machines",
                "Mould design through CAD/Unigraphics/CATIA design software",
                "Plastic components manufacturing through injection moulding machines/blow moulding machines/extrusion machines",
                "Testing facilities for plastic components"
            ]
        },
        {
            id: 6,
            centerName: "Tool Room & Training Centre (TRTC)",
            district: "Patna",
            email: ["trtcpatna14@gmail.com"],
            contactNo: "9931179926",
            contactPerson: "Mr. Vinod Kumar",
            designation: "Faculty",
            facilities: [
                "Design & Development",
                "Pre-Tooling",
                "Surface Grinding",
                "Cylindrical Grinding",
                "Consultancy Services",
                "Development Services",
                "Assembly/Fitting/Bench"
            ]
        },
        {
            id: 7,
            centerName: "Dr. Rajendra Prasad Central Agricultural University (PUSA), Samastipur",
            district: "Samastipur",
            email: ["vc@rpcau.ac.in", "aiic.pusa@rpcau.ac.in", "ramdatt@rpcau.ac.in"],
            contactNo: ["9549034035", "8800098813"],
            contactPerson: "Mr. Mohit Sharma, Dr. Sammer",
            designation: "Assistant Professor",
            facilities: [
                "Infrastructure facilities like space, electricity, water, communication facility, auditorium, seminar halls, guest houses, etc.",
                "Know-how in terms of publications, technology, patents",
                "Access to facilities for product quality checks",
                "Consultancy for processing, packaging, and labelling of products",
                "Opportunity to develop technology through licensing",
                "Platform to network with funding agencies",
                "Facility to seek inputs on IPR issues",
                "Mentoring",
                "Professional consultancy and other related services",
                "Pool of mentors, experts in technology, legal, financial, and related matters",
                "Training and workshops",
                "Organizing networking events for showcasing technologies",
                "Formulation of DPR"
            ]
        },
        {
            id: 8,
            centerName: "Amity University (AMITY), Patna",
            district: "Patna",
            email: [
                "admissions@ptn.amity.edu",
                "rshekhar1@ptn.amity.edu",
                "aiic@ptn.amity.edu",
                "vpandey@ptn.amity.edu"
            ],
            contactNo: "9334977772",
            contactPerson: "Mr. Ravi Shekhar",
            designation: "In Charge (Amity Innovation and Incubation Centre)",
            facilities: [
                "Air Conditioned Space",
                "Personal Computers with latest configurations",
                "Internet Connection (100 Mbps)",
                "Conference Room",
                "Standard Furniture",
                "Laser Printers",
                "PCB Prototyping Labs",
                "Testing and Calibration Labs"
            ]
        },
        {
            id: 9,
            centerName: "Muzaffarpur Institute of Technology (MIT), Muzaffarpur",
            district: "Muzaffarpur",
            email: ["tpo@mitmuzaffarpur.org", "startup@mitmuzaffarpur.org"],
            contactNo: "8755093083",
            contactPerson: "Dr. Sanjay Kumar",
            designation: "Assistant Professor",
            facilities: [
                "Electronics and Communication Engineering Labs",
                "Mechanical Engineering Labs",
                "Central Workshops for Metal Work",
                "Research Computing Facility"
            ]
        },
        {
            id: 10,
            centerName: "Development Management Institute (DMI), Patna",
            district: "Patna",
            email: ["support@dmi.ac.in", "shivamkr@dmi.ac.in", "incubation@dmi.ac.in"],
            contactNo: "7091496205",
            contactPerson: "Prof. Rajeswaran",
            designation: "Professor",
            facilities: ["Training Programmes on Agriculture and Animal Husbandry"]
        },
        {
            id: 11,
            centerName: "National Institute of Electronics & Information Technology (NIELIT), Patna",
            district: "Patna",
            email: ["patna@nielit.gov.in"],
            contactNo: "9074841785",
            contactPerson: "Ankit Kumar",
            designation: "Scientist C",
            facilities: [
                "Computer Labs",
                "High-End Server",
                "Electronics Design Lab",
                "Printed Circuit Board Design Lab",
                "Solar Lab",
                "Embedded Systems Lab",
                "Software Development Lab",
                "Cyber Security Lab"
            ]
        },
        {
            id: 12,
            centerName: "Chanakya National Law University (CNLU), Patna",
            district: "Patna",
            email: ["safiullah@cnlu.ac.in"],
            contactNo: "8969767406",
            contactPerson: "Dr. Md Safiullah",
            designation: "Convener, CIILE",
            facilities: [
                "10,000 sq.ft space with approx. 2,000 sq.ft built-up area",
                "Internet facility",
                "Library facility",
                "Mentoring support",
                "Meeting and conference room",
                "Printing facility"
            ]
        },
        {
            id: 13,
            centerName: "National Institute of Technology (NIT), Patna",
            district: "Patna",
            email: ["director@nitp.ac.in", "bharat@nitp.ac.in"],
            contactNo: "9331406964",
            contactPerson: "Prof. Bharat Gupta",
            designation: "Professor",
            facilities: [
                "Shared & Private Cabin",
                "Meeting Room",
                "Conference Hall",
                "Mentorship",
                "Lab use for Testing – Electronics, Computer, Civil, and Mechanical domains"
            ]
        },
        {
            id: 14,
            centerName: "Footwear Design and Development Institute (FDDI), Patna",
            district: "Patna",
            email: [
                "patnacampus@fddiindia.com",
                "contact@fddiindia.com",
                "sanjeevmishra@fddiindia.com",
                "rupa.shree@fddiindia.com"
            ],
            contactNo: "8210234857",
            contactPerson: "Rupa Shree",
            designation: "Assistant Manager",
            facilities: [
                "CAD-CAM lab",
                "Cutting Lab",
                "Closing Lab",
                "Component Lab",
                "Lasting lab",
                "Finishing lab",
                "IT lab",
                "Library"
            ]
        },
        {
            id: 15,
            centerName: "Upendra Maharathi Shilp Anusandhan Sansthan (UMSAS), Patna",
            district: "Patna",
            email: ["uminstitute@gmail.com"],
            contactNo: "9818102108",
            contactPerson: "Sri. VivekRanjan Maitery, IAS",
            designation: "Director, UMSAS and PMFME",
            facilities: [
                "Infrastructure Facilities",
                "Training Facilities",
                "Marketing Facilities",
                "Photography Support"
            ]
        },
        {
            id: 16,
            centerName: "Indian Institute of Information Technology (IIIT), Bhagalpur",
            district: "Bhagalpur",
            email: ["director@iiitbh.ac.in", "sraj.ece@iiitbh.ac.in"],
            contactNo: ["7632995210", "9386199102"],
            contactPerson: "Prof. Arvind Choubey, Sandeep (Professor)",
            designation: "Director",
            facilities: [
                "Mentoring support",
                "Training programs"
            ]
        },
        {
            id: 17,
            centerName: "Darbhanga College of Engineering (DCE), Darbhanga",
            district: "Darbhanga",
            email: ["ankitkr606@gmail.com"],
            contactNo: "7250840578",
            contactPerson: "Prof. Ankit Kumar (HOD, Mechanical Department)",
            designation: "Assistant Professor",
            facilities: [
                "Co-working space",
                "Internet facility",
                "Training programs",
                "Mentorship sessions"
            ]
        },
        {
            id: 18,
            centerName: "Indian Institute of Management (IIM), Gaya",
            district: "Gaya",
            email: [
                "director_office@iimbg.ac.in",
                "director@iimbg.ac.in",
                "chairpersonecell@iimbg.ac.in"
            ],
            contactNo: "9739426789",
            contactPerson: "Dr. Srividya Raghavan",
            designation: "Chairperson (E-Cell), IIM BG",
            facilities: [
                "Host Institution Status for incubation by MSME",
                "Business mentoring support",
                "Promotion of Entrepreneurship & Innovation activities"
            ]
        },
        {
            id: 19,
            centerName: "Software Technology Park of India (STPI), Patna",
            district: "Patna",
            email: [
                "surya.pattanayak@stpi.in",
                "rajeeva.kumar@stpi.in",
                "samrat.chakraborty@stpi.in",
                "bhawesh.kumar@stpi.in"
            ],
            contactNo: "9886507083",
            contactPerson: "Mr. Rajeeva",
            designation: "OIC",
            facilities: [
                "Incubation Sectors: IoT, Blockchain, AI, Machine Learning, Robotics",
                "Incubation Infrastructure: 20,000 sq.ft G+1 Incubation facility",
                "Market connect and mentorship programs",
                "Patent filing support"
            ]
        },
        {
            id: 20,
            centerName: "Aryabhatt Knowledge University (AKU), Patna",
            district: "Patna",
            email: ["manishaprakash@live.com", "akuniv10@gmail.com"],
            contactNo: "9431025029",
            contactPerson: "Dr. Manisha Prakash",
            designation: "Assistant Professor, SJMC, AKU, Patna - Coordinator/Director",
            facilities: ["Mentorship and incubation support"]
        },
        {
            id: 21,
            centerName: "Loknayak Jai Prakash Institute of Technology",
            district: "Chhapra",
            email: [
                "principallnjpitchapra@gmail.com",
                "startupcelllnjpitchapra@gmail.com"
            ],
            contactNo: "9123185449",
            contactPerson: "Abhishek Kumar",
            designation: "Assistant Professor",
            facilities: ["Incubation and training facilities"]
        },
        {
            id: 22,
            centerName: "TBI, IIT Patna",
            district: "Patna",
            email: [
                "info_tbi@iitp.ac.in",
                "ceo_tbi@iitp.ac.in"
            ],
            contactNo: "916204595415",
            contactPerson: "Dr. Praveen CEO",
            designation: "CEO",
            facilities: [
                "Aims to foster innovation and entrepreneurship, particularly in Electronic System Design and Manufacturing and Medical Electronics, offering infrastructure, technical expertise, and networking support for startups."
            ]
        }
    ];

    const handleDownloadExcel = () => {
        const sheetData = data.map((item, index) => ({
            "Sl. No.": index + 1,
            "Incubation Center": item.centerName,
            "District": item.district,
            "Email": Array.isArray(item.email) ? item.email.join("\n") : item.email,
            "Contact No": Array.isArray(item.contactNo) ? item.contactNo.join("\n") : item.contactNo,
            "Contact Person": Array.isArray(item.contactPerson) ? item.contactPerson.join("\n") : item.contactPerson,
            "Designation": Array.isArray(item.designation) ? item.designation.join("\n") : item.designation,
            "Facilities": item.facilities.join("\n")
        }));

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'IncubationCenters');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'Incubation_Centers.xlsx');
    };

    return (
        <div className="grid grid-cols-1">

            <div className="min-h-screen bg-white bg-no-repeat"
                style={{
                    backgroundImage: `url(${topImage}), url(${bottomImage})`,
                    backgroundPosition: "top right, bottom left",
                }}
            >
                <div className="grid grid-cols-1">
                    <NavBarNew />
                    <div className="text-center mb-8 px-4">
                        <p className="text-xl md:text-md font-bold text-[#303462] data-aos=fade-up pt-32">
                            Startup Bihar
                        </p>
                        <h2 className="pt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-[#303462]">
                            List of Incubation Centers
                        </h2>
                    </div>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleDownloadExcel}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mr-20"
                        >
                            Download Excel
                        </button>
                    </div>
                    <div style={{ paddingTop: '20px', paddingBottom: '120px', paddingLeft: '100px', paddingRight: '100px', fontFamily: 'Arial, sans-serif' }}>
                        <table
                            style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                margin: 'auto',
                                backgroundColor: '#f9f9f906',
                            }}
                        >


                            <thead>
                                <tr style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #ccc' }}>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Sl. No.</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name of Incubation Center</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>District</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Contact No</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name of Contact Person</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Designation</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd', width: '30%' }}>Details of Facilities</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                            {item.id}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.centerName}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.district}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', whiteSpace: 'pre-wrap' }}>
                                            {item.email.map((email, index) => (
                                                <div key={index}>{email}</div>
                                            ))}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', whiteSpace: 'pre-wrap' }}>
                                            {Array.isArray(item.contactNo) ? (
                                                item.contactNo.map((contact, index) => (
                                                    <div key={index}>{contact}</div>
                                                ))
                                            ) : (
                                                <div>{item.contactNo}</div>
                                            )}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', whiteSpace: 'pre-wrap' }}>
                                            {Array.isArray(item.contactPerson) ? (
                                                item.contactPerson.map((person, index) => (
                                                    <div key={index}>{person}</div>
                                                ))
                                            ) : (
                                                <div>{item.contactPerson}</div>
                                            )}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                            {Array.isArray(item.designation) ? (
                                                item.designation.map((designation, index) => (
                                                    <div key={index}>- {designation}</div>
                                                ))
                                            ) : (
                                                <div>- {item.designation}</div>
                                            )}
                                        </td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', whiteSpace: 'pre-wrap' }}>
                                            {item.facilities.map((facility, index) => (
                                                <div key={index}>- {facility}</div>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>
                </div>
            </div>
            <Footer />

        </div>
    );
};

export default IncubationNodalList;
