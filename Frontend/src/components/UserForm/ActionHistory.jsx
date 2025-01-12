import React from "react";
import { SiGooglemessages } from "react-icons/si";
import { FiBell } from "react-icons/fi";
import documentReject from "../../assets/document_reject.svg";
import documentAccept from "../../assets/document_accept.svg";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useState, useEffect } from "react";

import axios from "axios";

const sampleData = [
	{
		id: "uuid1",
		user_id: "user123",
		admin_id: "admin456",
		notification: "Your Post Seed Fund form has been rejected",
		subtitle: "Reason: invalid certificate provided",
		related_to: "form_submission",
		docLink: "https://example.com/details",
		createdAt: "2024-12-19T08:23:24.977Z",
		updatedAt: "2024-12-17T07:53:24.977Z",
	},
	{
		id: "uuid2",
		user_id: "user123",
		admin_id: "admin456",
		notification: "Congratulations! Your application has been approved",
		subtitle: "You are now eligible for the next round",
		related_to: "application",
		docLink: "https://example.com/next-steps",
		createdAt: "2024-12-10T00:00:00.000Z",
		updatedAt: "2024-12-10T00:00:00.000Z",
	},
	{
		id: "uuid3",
		user_id: "user123",
		admin_id: "admin456",
		notification: "Reminder: Update your profile information",
		subtitle: "Your profile is missing some details",
		related_to: "profile_update",
		docLink: "https://example.com/update-profile",
		createdAt: "2024-12-05T00:00:00.000Z",
		updatedAt: "2024-12-05T00:00:00.000Z",
	},
	{
		id: "uuid4",
		user_id: "user123",
		admin_id: "admin456",
		notification: "Payment Confirmation Received",
		subtitle: "Your transaction ID: 12345ABC",
		related_to: "payment",
		docLink: "https://example.com/payment-details",
		createdAt: "2024-12-01T00:00:00.000Z",
		updatedAt: "2024-12-01T00:00:00.000Z",
	},
	{
		id: "uuid5",
		user_id: "user123",
		admin_id: "ITadmin",
		notification: "Your Application is Under Review",
		subtitle: "We are currently processing your submission",
		related_to: "application",
		docLink: "https://example.com/review-status",
		createdAt: "2024-11-30T00:00:00.000Z",
		updatedAt: "2024-11-30T00:00:00.000Z",
	},
];

const ActionHistory = () => {
	const [notifications, setNotifications] = useState([]);
	const token = localStorage.getItem("token");
	const id = localStorage.getItem("user_id");

	const fetchUserNotifications = async () => {
		try {
			const response = await axios.get(
				`https://startupbihar.in/api/notifications/userNotification/${id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `${token}`,
					},
				},
			);
			setNotifications(response.data.notifications);
			console.log(response.data.notifications);
		} catch (error) {
			console.error("Error fetching user notifications:", error);
		}
	};

	useEffect(() => {
		fetchUserNotifications();
	}, []);

	const getIcon = (notification) => {
		switch (true) {
			case /accepted|approved/i.test(notification):
				return (
					<img
						src={documentAccept}
						alt="Accepted"
						className="size-12 flex-none rounded-full py-2 px-1 border-2 border-gray-500"
					/>
				);
			case /rejected|partially rejected/i.test(notification):
				return (
					<img
						src={documentReject}
						alt="Rejected"
						className="size-12 flex-none rounded-full py-2 px-1 border-2 border-gray-500"
					/>
				);
			default:
				return (
					<FiBell className="size-12 flex-none py-2 px-1 border-2 border-gray-500 rounded-full " />
				);
		}
	};

	const getRelativeTime = (date) => {
		return formatDistanceToNow(parseISO(date), { addSuffix: true });
	};

	return (
		<ul role="list" className="divide-y divide-gray-100">
			{notifications.map((data, index) => (
				<li key={index} className="flex justify-between gap-x-6 py-5">
					<div className="flex min-w-0 gap-x-4">
						{getIcon(data.notification)}
						<div className="min-w-0 flex-auto">
							<p className="text-sm/6 font-semibold text-gray-800">
								{data.notification}
							</p>
							<p className="mt-1 truncate text-xs/5 text-gray-500">
								{data.subtitle}
							</p>
						</div>
					</div>
					<div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
						<span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
							{data.admin_id}
						</span>

						<div className="flex items-end gap-3  ">
							{data.docLink && (
								<a
									href={data.docLink}
									className="text-sm/6 text-blue-500 underline"
								>
									document
								</a>
							)}{" "}
							<p className="mt-1 text-sm/6 ">
								{getRelativeTime(data.createdAt)}
							</p>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
};

export default ActionHistory;
