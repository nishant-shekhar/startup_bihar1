import React, { useState, useEffect } from "react";
import axios from "axios";
import AddNotificationCard from "../AddNotificationCard";
import NotificationCard from "../NotificationCard";

const AddNotification = () => {
	const [notifications, setNotifications] = useState([]);
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [newNotification, setNewNotification] = useState({
		title: "",
		link: "",
		date: "",
	});

	const notif = [
		{
			title: "Startup Evaluation Test Result Held on 07th August 2024",
			link: "http://example.com/sample1.pdf",
			date: "2023-10-01",
		},
		{
			title: "Startup Evaluation Test Result Held on 13th September 2024",
			link: "http://example.com/sample2.pdf",
			date: "2023-10-02",
		},
		{
			title: "New Startup Evaluation Test Result Held on 13th November 2024",
			link: "http://example.com/sample1.pdf",
			date: "2023-10-01",
		},
		{
			title:
				"Bihar Purchase Preference Policy updated, 2024Bihar Purchase Preference Policy updated, 2024",
			link: "http://example.com/sample2.pdf",
			date: "2023-10-02",
		},
		{
			title: "Startup Evaluation Test Result Held on 13th September 2024",
			link: "http://example.com/sample1.pdf",
			date: "2023-10-01",
		},
		{
			title: "New Startup Evaluation Test Result Held on 15th November 2024",
			link: "http://example.com/sample2.pdf",
			date: "2023-10-02",
		},
	];

	// useEffect(() => {
	//   fetchNotifications();
	// }, []);

	const fetchNotifications = async () => {
		try {
			const response = await axios.get(
				"http://localhost:3007/api/notifications",
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
					},
				},
			);
			setNotifications(response.data.notifications);
		} catch (error) {
			console.error("Error fetching notifications:", error);
			// Sample notifications in case of error
			setNotifications([
				{
					title: "Sample Notification 1",
					link: "http://example.com/sample1.pdf",
					date: "2023-10-01",
				},
				{
					title: "Sample Notification 2",
					link: "http://example.com/sample2.pdf",
					date: "2023-10-02",
				},
			]);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewNotification({ ...newNotification, [name]: value });
	};

	const handleAddNotification = () => {
		// Logic to add the new notification
		setNotifications([...notifications, newNotification]);
		setIsPopupVisible(false);
	};

	console.log(notifications.title);
	return (
		<div className="flex flex-col justify-center min-h-screen bg-gray-100 px-5 ">
			<h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
				Notifications
			</h1>
			<hr className="mb-6 border-gray-500/30" />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
				<div className="">
					<div className="bg-gray-200 shadow-md rounded-lg  w-96  animate-pulse h-36 pt-1 ">
						<div className="ml-4  ">
							<div>
								<div className="bg-gray-300 h-5 rounded w-3/4 mt-2 "></div>
								<div className="bg-gray-300 h-5 rounded w-1/5 mt-2"></div>
								<div className="bg-gray-300 h-5 rounded w-2/5 mt-2"></div>
							</div>
							<div>
								<button
									type="button"
									className="bg-blue-600 py-1 px-5 rounded-md mt-3 text-white mb-3 text-sm  "
									style={{ animation: "none !important" }}
									onClick={() => setIsPopupVisible(true)}
								>
									Add New
								</button>
							</div>
						</div>
					</div>
				</div>

				{notif.map((notif, index) => (
					<NotificationCard
						key={index}
						title={notif.title}
						link={notif.link}
						date={notif.date}
					/>
				))}
			</div>
			{isPopupVisible && (
				<AddNotificationCard
					title={newNotification.title}
					link={newNotification.link}
					date={newNotification.date}
					onChange={handleInputChange}
					onSubmit={handleAddNotification}
					onClose={() => setIsPopupVisible(false)}
				/>
			)}
		</div>
	);
};

export default AddNotification;
