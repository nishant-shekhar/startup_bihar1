import React from 'react';

import topImage from "/Users/nishantshekhar/Documents/GitHub/startup_bihar1/Frontend/src/assets/top_right.png"
import bottomImage from "/Users/nishantshekhar/Documents/GitHub/startup_bihar1/Frontend/src/assets/bottom_left.png"
import NavBarNew from './NavBarNew';
import Footer from './footer';

const StartupIncubationCell = () => {
    const data = [
        {
            id: 1,
            college: "Shri Phanishwar Nath Renu Engineering College, Araria",
            district: "Araria",
            facultyIncharge: "Dr Ritesh Kumar, startupspnrec@gmail.com, 9031185434",
            email: "startupspnrec@gmail.com",
            contactNumber: "9031185434",
            coordinator: "Harsh Kumar Bharati, 7050561526",
        },
        {
            id: 2,
            college: "Government Engineering College, Arwal",
            district: "Arwal",
            facultyIncharge:
                "Anant Kumar, TPO and Startup Cell Incharge, Contact No-9448752350, Email-id: anant6295@gmail.com",
            email: "anant6295@gmail.com",
            contactNumber: "9448752350",
            coordinator: "Manish Bibhu",
        },
        {
            id: 3,
            college: "Government Engineering College, Aurangabad",
            district: "Aurangabad",
            facultyIncharge:
                "Prof Anand Raj, startupcellgecaurangabad@gmail.com, 9431052432",
            email: "startupcellgecaurangabad@gmail.com",
            contactNumber: "9431052432",
            coordinator: "Atul Kumar, 6205695667",
        },
        {
            id: 4,
            college: "Government Engineering College, Banka",
            district: "Banka",
            facultyIncharge:
                "Prof. Shudhanshu Shekhar, startupcellgecb@gmail.com, 7611894603",
            email: "startupcellgecb@gmail.com",
            contactNumber: "7611894603",
            coordinator: "Manikant Singh, 8340250635",
        },
        {
            id: 5,
            college: "Rashtrakavi RSD College of Engineering, Begusarai",
            district: "Begusarai",
            facultyIncharge:
                "Ravi Kumar, Assistant Professor, CSE, Contact No-8789634010, Email-id: rrsdce@gmail.com",
            email: "startup@rrsdcebgs.ac.in",
            contactNumber: "8789634010",
            coordinator: "Juli Kumari, 9123460389",
        },
        {
            id: 6,
            college: "IIIT Bhagalpur",
            district: "Bhagalpur",
            facultyIncharge: "Dr. Sandeep Raj, 9386199102, sraj.ece@iiitbh.ac.in",
            email: "sraj.ece@iiitbh.ac.in",
            contactNumber: "9386199102",
            coordinator: "Vikash Kumar Ray",
        },
        {
            id: 7,
            college: "Bihar Agriculture University, Sabour",
            district: "Bhagalpur",
            facultyIncharge: "Dr. SK Mahidur Rahaman, 7763077353, sabagris@gmail.com",
            email: "sabagris@gmail.com",
            contactNumber: "7763077353",
            coordinator: "Megha Kumari, 6206750089",
        },
        {
            id: 8,
            college: "Bhagalpur College of Engineering Bhagalpur",
            district: "Bhagalpur",
            facultyIncharge: "Prabhakar, aavidasin@gmail.com, 7970965314",
            email: "aavidasin@gmail.com",
            contactNumber: "7970965314",
            coordinator: "Sakshi Gaurav",
        },
        {
            id: 9,
            college: "Darbhanga College Of Engineering, Darbhanga",
            district: "Darbhanga",
            facultyIncharge: "Ankit Kumar, 7250840578, ankitkr606@gmail.com",
            email: "ankitkr606@gmail.com",
            contactNumber: "7250840578",
            coordinator: "Surya Prakash, 700490223",
        },
        {
            id: 10,
            college: "Gaya College Of Engineering, Gaya",
            district: "Gaya",
            facultyIncharge:
                "Prof. Lavkush Gupta, guptalavkush1990@gmail.com, 8879179429, 7992230374",
            email: "guptalavkush1990@gmail.com",
            contactNumber: "8879179429, 7992230374",
            coordinator: "Sushant Kumar, 8503900740, 7903396256",
        },
        {
            id: 11,
            college: "Government Engineering College, Gopalganj",
            district: "Gopalganj",
            facultyIncharge: "Mr. Aaditya Amber, gecgopalganj@gmail.com",
            email: "gecgopalganj@gmail.com",
            contactNumber: "7992230374",
            coordinator: "Amit Pratap Singh, 9534266100, 6200139802",
        },
        {
            id: 12,
            college: "Government Engineering College, Jamui",
            district: "Jamui",
            facultyIncharge:
                "Rahul Kumar Ranjan, principalgecjamui@gmail.com, 7050740663",
            email: "principalgecjamui@gmail.com;gecjamuistartupcell@gmail.com",
            contactNumber: "7050740663",
            coordinator: "Mithun Kumar Singh",
        },
        {
            id: 13,
            college: "Government Engineering College, Jehanabad",
            district: "Jehanabad",
            facultyIncharge:
                "Prof. Shashank Prakash, Contact No- 7070704228, tpo@jehanabad.ac.in",
            email: "tpo@gecjehanabad.ac.in",
            contactNumber: "7070704228",
            coordinator: "Shalini Kumari, 6206620463",
        },
        {
            id: 14,
            college: "Government Engineering College, Kaimur",
            district: "Kaimur",
            facultyIncharge:
                "Prof. Rishi Nigam, Contact No- 8958320239, Email-id: geckaimur@gmail.com",
            email: "geckaimur@gmail.com",
            contactNumber: "8958320239",
            coordinator: "Nihal Singh, 9608683055",
        },
        {
            id: 15,
            college: "Katihar Engineering College, Katihar",
            district: "Katihar",
            facultyIncharge: "N/A",
            email: "principal@keck.ac.in",
            contactNumber: "N/A",
            coordinator: "Dilip Kumar, 9905224111",
        },
        {
            id: 16,
            college: "Government Engineering College, Khagaria",
            district: "Khagaria",
            facultyIncharge:
                "Vishal Kumar Chaudhary, 8058180383, vishal_cbp23@gmail.com",
            email: "vishal_cbp23@gmail.com, startup-khagaria@geckhagaria.org.in",
            contactNumber: "8058180383",
            coordinator: "Ravi Kumar, 9981786226",
        },
        {
            id: 17,
            college: "Government Engineering College, Kishanganj",
            district: "Kishanganj",
            facultyIncharge: "Dev Anand",
            email: "geckishanganj@gmail.com;geck.startupcell@gmail.com",
            contactNumber: "9170124920",
            coordinator: "Nisha Kumari, 7970563200",
        },
        {
            id: 18,
            college: "Government Engineering College Lakhisarai",
            district: "Lakhisarai",
            facultyIncharge:
                "Mr. Randhir Kumar, 7004769996, principalgeclakhisarai@gmail.com",
            email: "principalgeclakhisarai@gmail.com",
            contactNumber: "7004769996",
            coordinator: "Chandan Kumar, 9990966293",
        },
        {
            id: 19,
            college: "B.P. Mandal College Of Engineering Madhepura",
            district: "Madhepura",
            facultyIncharge:
                "Prof. Murlidhar Prasad Singh, Contact No- 9074687528, singhmurlidhar@gmail.com",
            email: "singhmurlidhar@gmail.com",
            contactNumber: "9074687528",
            coordinator: "Md Sadique Azmi, 7549783375",
        },
        {
            id: 20,
            college: "Government Engineering College Madhubani",
            district: "Madhubani",
            facultyIncharge:
                "Shashank Saurabh, 7004778431, mce.madhubani@gmail.com",
            email: "mce.madhubani@gmail.com / startup.gecm@gmail.com",
            contactNumber: "7004778431",
            coordinator: "Kumar Hardik, 8709192147",
        },
        {
            id: 21,
            college: "Motihari College Of Engineering, Motihari",
            district: "E Champaran",
            facultyIncharge:
                "Ravi Kumar,7979098267,ravi_cbp23@cimp.ac.in",
            email: "ravi_cbp23@cimp.ac.in",
            contactNumber: 7979098267,
            coordinator: "Navin Kumar",
        },
        {
            id: 21,
            college: "Motihari College Of Engineering, Motihari",
            district: "E Champaran",
            facultyIncharge: "Ravi Kumar, 7979098267, ravi_cbp23@cimp.ac.in",
            email: "ravi_cbp23@cimp.ac.in",
            contactNumber: "7979098267",
            coordinator: "Navin Kumar, 8521662223",
        },
        {
            id: 22,
            college: "Government Engineering College Munger",
            district: "Munger",
            facultyIncharge: "Dr. Govind Kumar Jha, gvnd.jha@gmail.com, 8544079464",
            email: "gvnd.jha@gmail.com; startupcellgecmunger@gmail.com",
            contactNumber: "8544079464",
            coordinator: "Ashutosh Anand, 7808720025",
        },
        {
            id: 23,
            college: "Muzaffarpur Institute Of Technology, Muzaffarpur",
            district: "Muzaffarpur",
            facultyIncharge: "Dr. Akash Priyadarshee, Mob: 9914353124",
            email: "i.akashpriyadarshee1@gmail.com; akashce@mitmuzaffarpur.org",
            contactNumber: "9914353124",
            coordinator: "Rakesh Kumar Sah, 7352430650",
        },
        {
            id: 24,
            college: "Nalanda College Of Engineering, Chandi",
            district: "Nalanda",
            facultyIncharge: "Rajeev Kumar, 8318049737, startupncechandi@gmail.com",
            email: "startupncechandi@gmail.com",
            contactNumber: "8318049737",
            coordinator: "Raunak Kumari, 9142746214",
        },
        {
            id: 25,
            college: "Government Engineering College, Nawada",
            district: "Nawada",
            facultyIncharge: "Shubhendu Amit, Contact No-8126262316",
            email: "gecprincipalnawada2022@gmail.com",
            contactNumber: "8126262316",
            coordinator: "Santosh Kumar Suman, 8597160735",
        },
        {
            id: 26,
            college: "A.N College, Patna",
            district: "Patna",
            facultyIncharge: "Dr. Ratna Amrit, abhishekaarabh@gmail.com, 8873114929",
            email: "abhishekaarabh@gmail.com; ancpatnastartupcell@gmail.com",
            contactNumber: "8873114929; 8789629210",
            coordinator: "Ankita Sinha, 7808641041",
        },
        {
            id: 27,
            college: "Chanakya National Law University, Patna",
            district: "Patna",
            facultyIncharge: "Dr Md Safiullah, 8969767406, safiullah@cnlu.ac.in",
            email: "safiullah@cnlu.ac.in",
            contactNumber: "8969767406",
            coordinator: "Mushir Reyaz",
        },
        {
            id: 28,
            college: "LNMI Patna",
            district: "Patna",
            facultyIncharge: "Ritu Narayan, lnmipat@gmail.com, 9304026344",
            email: "lnmipat@gmail.com",
            contactNumber: "9304026344",
            coordinator: "Jyotish Shankar",
        },
        {
            id: 29,
            college: "Purnea College of Engineering, Purnea",
            district: "Purnea",
            facultyIncharge: "Dr. Parimal, principal.pcep@gmail.com, 7358209468",
            email: "principal.pcep@gmail.com; startupcellpce.p@gmail.com",
            contactNumber: "7358209468",
            coordinator: "Aditya Singh, 9801000608",
        },
        {
            id: 30,
            college: "Shershah Engineering College, Sasaram",
            district: "Rohtas",
            facultyIncharge: "Vikash Kumar Singh, principalscesasaram@gmail.com, 7903766692",
            email: "principalscesasaram@gmail.com",
            contactNumber: "7903766692",
            coordinator: "N/A",
        },
        {
            id: 31,
            college: "Saharsa College of Engineering, Saharsa",
            district: "Saharsa",
            facultyIncharge: "Dr. Ankur Priyadarshi, 8789772251, startupcell@scesaharsa.org",
            email: "startupcell@scesaharsa.org",
            contactNumber: "8789772251, 9176259166",
            coordinator: "Kumar Saurabh, 9483844940",
        },
        {
            id: 32,
            college: "Government Engineering College, Samastipur",
            district: "Samastipur",
            facultyIncharge: "Tanmay Kumar, tpo.gecsamastipur2019@gmail.com, 9512535201",
            email: "tpo.gecsamastipur2019@gmail.com",
            contactNumber: "9512535201",
            coordinator: "Kumar Saurabh, 9483844940",
        },
        {
            id: 33,
            college: "RPCAU, Pusa Samastipur",
            district: "Samastipur",
            facultyIncharge: "Dr. Ram Datt",
            email: "ramdatt@rpcau.ac.in; aiic.pusa@rpcau.ac.in",
            contactNumber: "6287797119",
            coordinator: "Rajshekhar Singh, 8936823946",
        },
        {
            id: 34,
            college: "LNJPIT Chhapra",
            district: "Saran",
            facultyIncharge: "Abhishek Kumar Paswan",
            email: "ravi005kmr@gmail.com",
            contactNumber: "9123185449",
            coordinator: "Surbhi Singh, 7237892462",
        },
        {
            id: 35,
            college: "Government Engineering College, Sheikhpura",
            district: "Sheikhpura",
            facultyIncharge: "Sandeep Kumar, gecprincipalsheikhpura@gmail.com, 7015592720",
            email: "gecprincipalsheikhpura@gmail.com",
            contactNumber: "7015592720",
            coordinator: "Sanjeet Kumar, 8804538987",
        },
        {
            id: 36,
            college: "Government Engineering College, Sheohar",
            district: "Sheohar",
            facultyIncharge: "Brij Mohan Kumar, startup@gecsheohar.ac.in, 9782436752",
            email: "startup@gecsheohar.ac.in",
            contactNumber: "9782436752",
            coordinator: "Shreya Shah",
        },
        {
            id: 37,
            college: "Sitamarhi Institute Of Technology",
            district: "Sitamarhi",
            facultyIncharge: "Mr. Nishant Kumar, 8010546984, nishant.cse@sitsitamarhi.ac.in",
            email: "nishant.cse@sitsitamarhi.ac.in",
            contactNumber: "8010546984",
            coordinator: "Ankit Raj, 8102704334",
        },
        {
            id: 38,
            college: "Government Engineering College, Siwan",
            district: "Siwan",
            facultyIncharge: "Prof. Som Dutt, 7488689746, gecsiwan@gmail.com",
            email: "startupcellsiwan@gmail.com",
            contactNumber: "7488689746",
            coordinator: "Kumar Aditya Chandra, 8699465613",
        },
        {
            id: 39,
            college: "Supaul College of Engineering, Supaul",
            district: "Supaul",
            facultyIncharge: "Mr. Shadab Azam Siddique, 9604343617",
            email: "scesupaul.startupcell@gmail.com",
            contactNumber: "9604343617",
            coordinator: "Pradeep, 6200191820",
        },
        {
            id: 40,
            college: "Government Engineering College, Vaishali",
            district: "Vaishali",
            facultyIncharge: "Alok, 7004836434, alok_cbp23@cimp.ac.in",
            email: "alok_cbp23@cimp.ac.in",
            contactNumber: "7004836434",
            coordinator: "Devasish Kumar, 9798736095",
        },
        {
            id: 41,
            college: "Government Engineering College, Bettiah, West Champaran",
            district: "West Champaran",
            facultyIncharge: "Om Prakash Ram, 9870286621, startupcellgecwc@gmail.com",
            email: "startupcellgecwc@gmail.com",
            contactNumber: "9870286621",
            coordinator: "MD Haidar Ali, 8340286571",
        },
        {
            id: 42,
            college: "Jagjiwan College, Ara, Bhojpur",
            district: "Bhojpur",
            facultyIncharge: "Md Aslam Parwez",
            email: "jagjiwancollegeara@gmail.com",
            contactNumber: "8294000059",
            coordinator: "Divyendu Shekhar Singh",
        },
        {
            id: 43,
            college: "V.K.S. College of Agriculture, Dumraon",
            district: "Buxar",
            facultyIncharge: "Chandrasekhar Prabhakar",
            email: "prcoa2010@gmail.com",
            contactNumber: "8002062841",
            coordinator: "Vishnu Singh",
        },
        {
            id: 44,
            college: "New Government Polytechnic",
            district: "Patna",
            facultyIncharge: "N/A",
            email: "ngppat13@gmail.com",
            contactNumber: "N/A",
            coordinator: "N/A",
        },
        {
            id: 45,
            college: "St. Xavier’s College of Management & Technology",
            district: "Patna",
            facultyIncharge: "N/A",
            email: "info@sxcpatna.edu.in; deanacademics@sxcpatna.edu.in",
            contactNumber: "N/A",
            coordinator: "N/A",
        },
        {
            id: 46,
            college: "L.N. Mishra College of Business Management",
            district: "Muzaffarpur",
            facultyIncharge: "N/A",
            email: "lnmipat@gmail.com",
            contactNumber: "N/A",
            coordinator: "N/A",
        },
    ];

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
                        List of Startup Cell
                    </h2>

                </div>
                <div style={{ paddingTop: '20px',paddingBottom: '120px',paddingLeft: '100px',paddingRight: '100px', fontFamily: 'Arial, sans-serif' }}>
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
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Engineering College</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>District</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Faculty Incharge</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Contact Number</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Startup Cell Coordinator</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                        {item.id}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.college}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.district}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.facultyIncharge}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.email}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.contactNumber}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.coordinator}</td>
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

export default StartupIncubationCell;
