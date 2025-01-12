import React, { useEffect, useState } from "react";
import StatusDialog from "../../../UserForm/StatusDialog";
import { set } from "date-fns";
import { use } from "react";
import axios from "axios";

const EmployeeDetails = ({ onClose }) => {
	const [employees, setEmployees] = useState([]);
	const id = localStorage.getItem("user_id");
	const fetchData = async () => {
		try {
			const response = await axios.get(
				`https://startupbihar.in/api/userlogin/getEmployees?startupId=${id}`,
			);
			setEmployees(response.data.employees);
			console.log(response.data);
		}
		catch (error) {
			console.log(`error :${error}`);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	const employeess = [
		{
			employeeName: "John Doe",
			designation: "Software Engineer",
			qualification: "B.Tech in Computer Science",
			imgUrl: "https://via.placeholder.com/150",
		},
		{
			employeeName: "Jane Smith",
			designation: "UI/UX Designer",
			qualification: "B.Des in Design",
			imgUrl: "https://via.placeholder.com/150",
		},
		{
			employeeName: "Emily Johnson",
			designation: "Project Manager",
			qualification: "MBA in Project Management",
			imgUrl: "https://via.placeholder.com/150",
		},
		{
			employeeName: "Michael Brown",
			designation: "Data Analyst",
			qualification: "M.Sc in Data Science",
			imgUrl: "https://via.placeholder.com/150",
		},
		{
			employeeName: "Sarah Williams",
			designation: "HR Manager",
			qualification: "MBA in Human Resources",
			imgUrl: "https://via.placeholder.com/150",
		},
		{
			employeeName: "David Wilson",
			designation: "DevOps Engineer",
			qualification: "B.Tech in Information Technology",
			imgUrl: "https://via.placeholder.com/150",
		},
		{
			employeeName: "Sophia Davis",
			designation: "Content Writer",
			qualification: "BA in English Literature",
			imgUrl: "https://via.placeholder.com/150",
		},
		{
			employeeName: "James Taylor",
			designation: "Cybersecurity Specialist",
			qualification: "M.Tech in Cybersecurity",
			imgUrl: "https://via.placeholder.com/150",
		},
	];

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 rounded-lg shadow-xl p-6 relative w-full max-w-4xl max-h-[80vh] overflow-y-auto my-8">
				<button
					type="button"
					onClick={onClose}
					className="absolute top-2 right-2 text-[#3B82F6] hover:text-blue-600"
				>
							✕
				</button>
				<h2 className="text-2xl font-semibold mb-4 text-center">
					Employee Details
				</h2>
				<table className="w-full text-left border-collapse border border-gray-300">
					<thead>
						<tr>
							<th className="font-semibold border border-gray-300 p-2">Employee Name</th>
							<th className="font-semibold border border-gray-300 p-2">Designation</th>
							<th className="font-semibold border border-gray-300 p-2">Qualification</th>
							<th className="font-semibold border border-gray-300 p-2">Profile Image</th>
						</tr>
					</thead>
					<tbody>
						{employees.map((employee, index) => (
							<tr key={index}>
									<td className="border border-gray-300 p-2">{employee.name}</td>
									<td className="border border-gray-300 p-2">{employee.designation}</td>
									<td className="border border-gray-300 p-2">{employee.qualification}</td>
									<td className="border border-gray-300 p-2">
										<img src={employee.dp} alt="Profile" className="w-16 h-16 rounded-full" />
									</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="z-60">
				<StatusDialog
					isVisible={false}
					title=""
					subtitle=""
					buttonVisible={false}
					onClose={() => {}}
					status=""
				/>
			</div>
		</div>
	);
};

export default EmployeeDetails;
