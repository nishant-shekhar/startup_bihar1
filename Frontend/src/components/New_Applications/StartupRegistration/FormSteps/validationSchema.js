import * as Yup from "yup";

// Define file size and type validation helpers
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = [
	"image/jpg",
	"image/jpeg",
	"image/png",
	"application/pdf",
];

const fileValidation = Yup.mixed()
	.test("fileSize", "File is too large (max 5MB)", (value) => {
		return !value || value.size <= MAX_FILE_SIZE;
	})
	.test("fileType", "Unsupported file format", (value) => {
		return !value || SUPPORTED_FORMATS.includes(value.type);
	});

// Step 1: Basic Details Validation
export const step1ValidationSchema = Yup.object({
	firstName: Yup.string().required("First Name is required"),
	lastName: Yup.string().required("Last Name is required"),
	email: Yup.string()
		.email("Invalid email format")
		.required("Email is required"),
	phoneNumber: Yup.string()
		.matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
		.required("Phone Number is required"),
	gender: Yup.string().required("Gender is required"),
	category: Yup.string().required("Category is required"),
	dateOfBirth: Yup.date().required("Date of Birth is required"),
	qualification: Yup.string().required("Qualification is required"),
	profilePhoto: fileValidation,
});

// Step 2: Entity Details Validation
export const step2ValidationSchema = Yup.object({
	entityName: Yup.string().required("Entity Name is required"),
	entityType: Yup.string().required("Entity Type is required"),
	entityRegistrationNumber: Yup.string().required(
		"Registration Number is required",
	),
	dateOfRegistration: Yup.date().required("Date of Registration is required"),
	logo: fileValidation,
	certificate: fileValidation,
	sector: Yup.string().required("Sector is required"),
	stage: Yup.string().required("Stage is required"),
});

// Step 3: Startup Details Validation
export const step3ValidationSchema = Yup.object({
	teamSize: Yup.number()
		.required("Team Size is required")
		.min(1, "Team size must be at least 1"),
	website: Yup.string().url("Must be a valid URL"),
	registeredAddress: Yup.string().required("Registered Address is required"),
	city: Yup.string().required("City is required"),
	state: Yup.string().required("State is required"),
	pincode: Yup.string()
		.matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
		.required("Pincode is required"),
	auditedBalanceSheet: fileValidation,
	gstReturn: fileValidation,
});

// Step 4: Co-Founder Details Validation
export const step4ValidationSchema = Yup.object({
	coFounders: Yup.array().of(
		Yup.object().shape({
			name: Yup.string().required("Name is required"),
			email: Yup.string()
				.email("Invalid email format")
				.required("Email is required"),
			phoneNumber: Yup.string()
				.matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
				.required("Phone Number is required"),
			qualification: Yup.string().required("Qualification is required"),
			linkedinProfile: Yup.string().url("Must be a valid LinkedIn URL"),
		}),
	),
});

// Step 5: Business Idea Validation
export const step5ValidationSchema = Yup.object({
	problemStatement: Yup.string().required("Problem Statement is required"),
	solution: Yup.string().required("Solution is required"),
	targetMarket: Yup.string().required("Target Market is required"),
	revenueModel: Yup.string().required("Revenue Model is required"),
	fundingRequired: Yup.number().required("Funding Required is required"),
	fundingReason: Yup.string().required("Reason for Funding is required"),
	expenditurePlan: fileValidation,
	bankStatement: fileValidation,
	expenditureInvoice: fileValidation,
	geoTaggedPhotos: fileValidation,
});

// Combine all validation schemas
export const validationSchema = Yup.object({
	...step1ValidationSchema.fields,
	...step2ValidationSchema.fields,
	...step3ValidationSchema.fields,
	...step4ValidationSchema.fields,
	...step5ValidationSchema.fields,
});

// Initial form values
export const initialValues = {
	// Step 1: Basic Details
	firstName: "",
	lastName: "",
	email: "",
	phoneNumber: "",
	gender: "",
	category: "",
	dateOfBirth: "",
	qualification: "",
	profilePhoto: null,

	// Step 2: Entity Details
	entityName: "",
	entityType: "",
	entityRegistrationNumber: "",
	dateOfRegistration: "",
	logo: null,
	certificate: null,
	sector: "",
	stage: "",

	// Step 3: Startup Details
	teamSize: "",
	website: "",
	registeredAddress: "",
	city: "",
	state: "",
	pincode: "",
	auditedBalanceSheet: null,
	gstReturn: null,

	// Step 4: Co-Founder Details
	coFounders: [
		{
			name: "",
			email: "",
			phoneNumber: "",
			qualification: "",
			linkedinProfile: "",
		},
	],

	// Step 5: Business Idea
	problemStatement: "",
	solution: "",
	targetMarket: "",
	revenueModel: "",
	fundingRequired: "",
	fundingReason: "",
	expenditurePlan: null,
	bankStatement: null,
	expenditureInvoice: null,
	geoTaggedPhotos: null,
};
