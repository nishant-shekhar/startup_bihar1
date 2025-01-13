import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import StatusDialog from "../../../UserForm/StatusDialog";

const UpdateSocialMediaURL = ({ startup, onPlatformSelect, onUpdate }) => {
	const [dialogStatus, setDialogStatus] = useState({
		isVisible: false,
		title: "",
		subtitle: "",
		buttonVisible: false,
		status: "",
	});

	const handleUpdate = async (field, value) => {
		try {
			setDialogStatus({
				isVisible: true,
				title: "Updating user Fields",
				subtitle: "Wait while we update your user data!",
				buttonVisible: false,
				status: "checking",
			});

			await axios.put(
				"http://localhost:3007/api/userlogin/update-user-field",
				{ [field]: value },
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
					},
				},
			);

			setDialogStatus({
				isVisible: true,
				title: "User Field Updated",
				subtitle: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`,
				buttonVisible: true,
				status: "success",
			});
		} catch (error) {
			console.error(`Error updating ${field}:`, error);
			setDialogStatus({
				isVisible: true,
				title: "User Field Update Failed",
				subtitle: "Error updating user data",
				buttonVisible: true,
				status: "failed",
			});
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 rounded-lg shadow-xl w-11/12 max-w-4xl p-6 relative">
				<button
					onClick={() => onPlatformSelect(false)}
					className="absolute top-2 right-2 text-[#3B82F6] hover:text-blue-600"
				>
					✕
				</button>
				<div className="grid grid-cols-1">

					<h2 className="text-2xl font-semibold mb-4 text-center">
						Update Social Media Links & About
					</h2>
					<Formik
						initialValues={{
							twitter: startup.twitter,
							facebook: startup.facebook,
							instagram: startup.instagram,
							linkedin: startup.linkedin,
							website: startup.website,
							moto: startup.moto,
							about: startup.about,
						}}
						onSubmit={async (values, { resetForm }) => {
							for (const [field, value] of Object.entries(values)) {
								if (value) {
									await handleUpdate(field, value);
								}
							}
							resetForm();
							onUpdate();
						}}
					>
						{() => (
							<Form className="grid grid-cols-2">


								{/* Links Section */}
								<div className="col-span-1 p-4">
									<h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
									<div className="mb-4">
										<label className="block text-gray-700 mb-2">Twitter URL</label>
										<Field
											type="url"
											name="twitter"
											placeholder="Enter Twitter URL"
											className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div className="mb-4">
										<label className="block text-gray-700 mb-2">Facebook URL</label>
										<Field
											type="url"
											name="facebook"
											placeholder="Enter Facebook URL"
											className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div className="mb-4">
										<label className="block text-gray-700 mb-2">Instagram URL</label>
										<Field
											type="url"
											name="instagram"
											placeholder="Enter Instagram URL"
											className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div className="mb-4">
										<label className="block text-gray-700 mb-2">LinkedIn URL</label>
										<Field
											type="url"
											name="linkedin"
											placeholder="Enter LinkedIn URL"
											className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div className="mb-4">
										<label className="block text-gray-700 mb-2">Website URL</label>
										<Field
											type="url"
											name="website"
											placeholder="Enter Website URL"
											className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>

								{/* About Section */}
								<div className="col-span-1 p-4">
									<h3 className="text-lg font-semibold mb-4">About Your Startup</h3>
									<div className="mb-4">
										<label className="block text-gray-700 mb-2">Moto</label>
										<Field
											type="text"
											name="moto"
											placeholder="Enter Moto"
											className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
											maxLength={80}
										/>
									</div>

									<div className="mb-4">
										<label className="block text-gray-700 mb-2">About</label>
										<Field
  as="textarea"
  name="about"
  placeholder="Enter About"
  className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
  rows={4}
/>

									</div>
								</div>



								{/* Submit Button */}
								<div className="col-span-2 text-center w-full mt-6">
									<button
										type="submit"
										className="bg-[#3B82F6] text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition w-full sm:w-auto"
									>
										Update Links & About
									</button>
								</div>


							</Form>
						)}
					</Formik>
				</div>

			</div>
			<div className="z-60">
				<StatusDialog
					isVisible={dialogStatus.isVisible}
					title={dialogStatus.title}
					subtitle={dialogStatus.subtitle}
					buttonVisible={dialogStatus.buttonVisible}
					onClose={() => {
						setDialogStatus({ ...dialogStatus, isVisible: false });
						onPlatformSelect(false);
					}}
					status={dialogStatus.status}
				/>
			</div>
		</div>
	);
};

export default UpdateSocialMediaURL;
