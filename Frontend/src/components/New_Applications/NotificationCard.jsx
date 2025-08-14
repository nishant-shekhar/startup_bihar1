import React from "react";

const NotificationCard = ({ title, link, date }) => {
	return (
		<div className="bg-white shadow-md rounded-lg p-4 w-96 justify-between">
			<h2 className="text-lg font-semibold">{title}</h2>
			<div className="flex justify-between items-end mt-4 ">
				<div>
					<p className="text-sm text-gray-600">{date}</p>
					<a
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline"
					>
						View Notification
					</a>
				</div>
				<div className="">
					<button className="bg-indigo-600 px-1 py-2 rounded-md text-white">
						Delete
					</button>
					<button className="border border-indigo-600 px-1 py-2 rounded-md text-indigo-600 hover:text-black ml-2">
						Archive
					</button>
 				</div>
			</div>
		</div>
	);
};

export default NotificationCard;
