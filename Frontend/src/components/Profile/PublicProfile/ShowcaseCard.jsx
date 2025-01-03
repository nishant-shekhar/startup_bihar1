import React from "react";
import { useState } from "react";
import StatusDialog from "../../UserForm/StatusDialog";

const ShowcaseCard = ({
	imgurl,
	dateandtime,
	title,
	subtitle,
	tag,
	projectLink,
	id,
	delhidden
}) => {
	const [dialogStatus, setDialogStatus] = useState({
		isVisible: false,
		title: "",
		subtitle: "",
		buttonVisible: false,
		status: "",
		cancelButton: "",
		actionButton: "",
	});

	const handleDeleteClick = () => {
		setDialogStatus({
			title: "Delete Showcase",
			subtitle: "Are you sure you want to delete this showcase?",
			isVisible: true,
			buttonVisible: true,
			status: "delete",
			actionButton: "Yes",
			cancelButton: "No",
		});
		console.log("Delete Clicked", id);
	};

	return (
		<div>
			<div className="overflow-hidden rounded-lg shadow-lg flex-1 min-w-0 bg-slate-50 mt-1">
				<div className="mx-5 mt-5 h-40 overflow-hidden rounded-lg">
					<img src={imgurl} alt="" className="w-full h-full object-cover" />
				</div>
				<div className="p-6">
					<div className="text-md text-green-500 font-light mb-2">
						{dateandtime}
					</div>
					<h3 className="text-xl font-semibold mb-2 truncate">{title}</h3>
					<div className="text-sm text-gray-600 truncate">
						{tag} • {subtitle}
					</div>

					<hr className="mt-3" />

					<button
						type="button"
						className="bg-blue-600 py-2 w-3/6 px-1 rounded-md mt-3 text-white"
						onClick={() => {
							const url =
								projectLink.startsWith("http://") ||
								projectLink.startsWith("https://")
									? projectLink
									: `https://${projectLink}`;
							window.open(url, "_blank");
						}}
					>
						Project Link
					</button>
					{!delhidden && (
						<button
							className="bg-blue-600 py-2 px-4 rounded-md mt-3 text-white ml-3"
							type="button"
							onClick={handleDeleteClick}
						>
							Delete
						</button>
					)}
				</div>
			</div>

			<StatusDialog
				isVisible={dialogStatus.isVisible}
				title={dialogStatus.title}
				subtitle={dialogStatus.subtitle}
				buttonVisible={dialogStatus.buttonVisible}
				cancelButton={dialogStatus.cancelButton}
				actionButton={dialogStatus.actionButton}
				onClose={() => setDialogStatus({ ...dialogStatus, isVisible: false })}
				onCancel={() => setDialogStatus({ ...dialogStatus, isVisible: false })}
				status={dialogStatus.status}
			/>
		</div>
	);
};

export default ShowcaseCard;
