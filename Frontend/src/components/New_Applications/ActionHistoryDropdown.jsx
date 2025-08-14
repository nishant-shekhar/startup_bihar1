import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ActionHistoryDropdown = ({ actions }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="border border-gray-300 rounded-md p-2 w-full   bg-white shadow-md mt-2">
			{/* Header */}
			<div
				className="flex justify-between items-center cursor-pointer"
				onClick={() => setIsOpen(!isOpen)}
			>
				<h2 className="text-sm font-medium text-gray-600 pl-2">Action History</h2>
				{isOpen ? (
					<ChevronUp className="h-5 w-5" />
				) : (
					<ChevronDown className="h-5 w-5" />
				)}
			</div>

			{/* Content */}
			{isOpen && (
				<ul className="mt-4 space-y-2 font-medium text-gray-600 text-sm">
					{actions && actions.length > 0 ? (
						actions.map((item, index) => (
							<li key={index} className="pl-1 mb-2">
								<div className="flex items-center space-x-3">
									<span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
										{item.date}
									</span>
									<span className="text-sm text-gray-800">
										{item.description}
									</span>
								</div>
							</li>
						))
					) : (
						<li>No actions yet.</li>
					)}
				</ul>
			)}
		</div>
	);
};

export default ActionHistoryDropdown;
