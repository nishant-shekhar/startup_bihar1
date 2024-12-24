import React from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

const StatusDialog = ({
	isVisible,
	title,
	subtitle,
	buttonVisible,
	onClose,
	status,
	actionButton,
	cancelButton,
	onCancel,
}) => {
	if (!isVisible) return null; // Render nothing if the dialog is not visible

	// Dynamically set colors based on success or failure
	const textColor =
		status === "success"
			? "text-green-600"
			: status === "failed"
				? "text-red-600"
				: "text-black";
	const buttonColor =
		status === "success"
			? "bg-green-600 hover:bg-green-500"
			: status === "failed"
				? "bg-red-600 hover:bg-red-500"
				: "bg-black hover:bg-gray-800";

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
			<div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
				<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
					<div className="sm:flex sm:items-start">
						<div
							className={`mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 ${textColor}`}
						>
							<AiOutlineCloudUpload className="text-xl" />
						</div>
						<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
							<h3
								className={`text-base font-semibold ${textColor}`}
								id="modal-title"
							>
								{title}
							</h3>
							<div className="mt-2">
								<p className={`text-md ${textColor}`}>{subtitle}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">{buttonVisible && (
						<button
							type="button"
							className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${buttonColor}`}
							onClick={onClose}
						>
							{actionButton || "Ok"}
						</button>
					)}
					{cancelButton && (
						<button
							type="button"
							className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${buttonColor}`}
							onClick={onCancel}
              
						>
							{cancelButton || "Cancel"}
						</button>
					)}
					
				</div>
			</div>
		</div>
	);
};

export default StatusDialog;
