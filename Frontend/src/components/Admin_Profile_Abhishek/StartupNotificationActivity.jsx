import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { X } from 'lucide-react'; // Optional: modern icon

const NotificationActivity = ({ userId, startupName, onClose }) => {
	const [mergedData, setMergedData] = useState([]);
	const token = localStorage.getItem('token');
const [filter, setFilter] = useState('All');
const [loading, setLoading] = useState(true);

const filteredData = mergedData.filter((item) => {
	if (filter === 'All') return true;
	if (filter === 'Notification') return item.type === 'notification';
	if (filter === 'Activity') return item.type === 'activity';
	return false;
});

	useEffect(() => {
	const fetchData = async () => {
	try {
		setLoading(true);
		const [notifRes, activityRes] = await Promise.all([
			axios.get(`https://startupbihar.in/api/notifications/userNotificationAdmin/${userId}`, {
				headers: { Authorization: `${token}` },
			}),
			axios.get(`https://startupbihar.in/api/activity/userActivitiesAdmin/${userId}`, {
				headers: { Authorization: `${token}` },
			}),
		]);

		const notifications = notifRes?.data?.notifications || [];
		const activities = activityRes?.data?.activities || [];

		const combined = [
			...notifications.map((n) => ({ ...n, type: 'notification' })),
			...activities.map((a) => ({ ...a, type: 'activity' })),
		].sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));

		setMergedData(combined);
	} catch (err) {
		console.error('Error fetching data:', err);
	} finally {
		setLoading(false);
	}
};

	if (userId) fetchData();
}, [userId]);


	const formatDateTime = (date) => format(new Date(date), 'dd/MM/yyyy, HH:mm:ss');

	const renderDocLinks = (docLink) => {
		if (!docLink) return null;
		return docLink.split(', ').map((link, index) => {
			const [url, name] = link.split('^');
			return (
				<a
					key={index}
					href={url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm text-blue-600 underline mr-2"
				>
					{name || 'View Document'}
				</a>
			);
		});
	};

	return (
		<div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
			<div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
				>
					<X size={20} />
				</button>

				{/* Header */}
				<div className="px-6 pt-6 pb-2 border-b">
					<h2 className="text-lg sm:text-xl font-semibold text-gray-800">
						{startupName} — Notification & Action History
					</h2>
                    <div className=" pt-2 text-sm text-gray-500 italic">
	This includes all notifications and activities as seen by the startup itself.
</div>
				</div>
                <div className="px-6 mt-2 flex flex-wrap gap-3">
	{['All', 'Notification', 'Activity'].map((type) => (
		<button
			key={type}
			className={`px-3 py-1 text-sm rounded-full border transition font-medium ${
				filter === type
					? 'bg-gray-900 text-white'
					: 'border-gray-300 text-gray-600 hover:bg-gray-100'
			}`}
			onClick={() => setFilter(type)}
		>
			{type}
		</button>
	))}
</div>


				{/* Scrollable Content */}
				<div className="scrollbox px-6 py-4 space-y-4 overflow-y-auto max-h-[70vh]">
	{loading ? (
	<p className="text-sm text-center text-gray-500">Fetching data...</p>
) : filteredData.length === 0 ? (
	<p className="text-sm text-center text-gray-500">No matching records found.</p>

	) : (
		filteredData.map((item, idx) => {
			const isNotification = item.type === 'notification';
			const date = formatDateTime(item.createdAt || item.timestamp);
			return (
				<div
					key={idx}
					className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
				>
					<span
						className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${
							isNotification
								? 'bg-blue-100 text-blue-700 border border-blue-300'
								: 'bg-green-100 text-green-700 border border-green-300'
						}`}
					>
						{isNotification ? 'Notification' : 'Activity'}
					</span>

					<p className="text-sm font-medium text-gray-900 mb-1">
						{isNotification ? item.notification : item.action}
					</p>
					{item.subtitle && (
						<p className="text-sm text-gray-700 mb-2">{item.subtitle}</p>
					)}
					{item.docLink && (
						<div className="mb-2 flex flex-wrap items-center gap-2">
							{renderDocLinks(item.docLink)}
						</div>
					)}
					<p className="text-xs text-gray-500">
						{date} | {item.admin_id ? `Sent by: ${item.admin_id}` : 'System Log'}
					</p>
				</div>
			);
		})
	)}
</div>
</div>
            

			{/* Scrollbar styles */}
			<style jsx="true">{`
				.scrollbox::-webkit-scrollbar {
					width: 6px;
				}
				.scrollbox::-webkit-scrollbar-track {
					background: transparent;
				}
				.scrollbox::-webkit-scrollbar-thumb {
					background-color: rgba(0, 0, 0, 0.2);
					border-radius: 10px;
				}
				.scrollbox:hover::-webkit-scrollbar-thumb {
					background-color: rgba(0, 0, 0, 0.4);
				}
			`}</style>
		</div>
	);
};

export default NotificationActivity;
