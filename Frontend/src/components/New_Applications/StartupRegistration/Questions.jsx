import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema for the quiz
const quizValidationSchema = Yup.object({
	question1: Yup.string().required("Please select an answer"),
	question2: Yup.string().required("Please select an answer"),
	question3: Yup.string().required("Please select an answer"),
	question4: Yup.string().required("Please select an answer"),
	question5: Yup.string().required("Please select an answer"),
	question6: Yup.string().required("Please select an answer"),
	question7: Yup.string().required("Please select an answer"),
	question8: Yup.string().required("Please select an answer"),
	question9: Yup.string().required("Please select an answer"),
	question10: Yup.string().required("Please select an answer"),
});

// Initial values for the form
const initialValues = {
	question1: "",
	question2: "",
	question3: "",
	question4: "",
	question5: "",
	question6: "",
	question7: "",
	question8: "",
	question9: "",
	question10: "",
};

// Questions in English and Hindi
const questions = {
	english: [
		"Which of the following is a startup?",
		"Novelty and creativity are very essential for a startup.",
		"Skilled people are needed for technological development, business development, and management in a startup.",
		"The growth rate of a startup is lower compared to a traditional business.",
		"A business that operates using traditional methods, primarily focusing on product production and marketing, is called a traditional business.",
		"Innovation and creativity are very important for the growth of a startup.",
		"In the beginning, the growth rate of a traditional business is lower than that of a startup.",
		"Traditional businesses have limited sources of income.",
		"A startup does not need to do planning and strategy from the beginning.",
		"Are Cyber Cafés, Bakery Factories, and Clothing Shops considered startups?",
	],
	hindi: [
		"इनमें से कौन स्टार्टअप है?",
		"स्टार्टअप के लिए नयापन और क्रिएटिविटी बहुत आवश्यक होता है?",
		"स्टार्टअप में तकनीकी विकास, बिजनेस डेवलपमेंट, और मैनेजमेंट के लिए स्किल्ड लोगों की जरूरत पड़ती है?",
		"स्टार्टअप की वृद्धि की दर पारंपरिक व्यवसाय की तुलना में कम होती है?",
		"पुराने तरीकों से चलने वाले व्यवसाय जिसका मूल उद्देश्य उत्पाद का उत्पादन और उसकी मार्केटिंग करना है, पारंपरिक व्यवसाय कहलाता है?",
		"स्टार्टअप में आगे बढ़ने के लिए इनोवेशन और क्रिएटिविटी बहुत जरूरी है?",
		"शुरुआत में पारंपरिक व्यवसाय की वृद्धि की दर स्टार्टअप की तुलना में कम होती है?",
		"पारंपरिक व्यवसाय में आय के सीमित स्रोत होते हैं?",
		"स्टार्टअप को शुरुआत से ही प्लानिंग व स्ट्रेटेजी नहीं बनानी पड़ती है?",
		"क्या साइबर कैफ़े, बेकरी फैक्ट्री, और कपड़ा दुकान स्टार्टअप हैं?",
	],
};

// Options for dropdown answers based on language
const getOptions = (questionId, language) => {
	// For question 1, we have special options
	if (questionId === "question1") {
		return [
			{
				value: "",
				label: language === "english" ? "Select your answer" : "अपना उत्तर चुनें",
			},
			{
				value: "option1",
				label: language === "english" ? "Papad Industry" : "पापड़ उद्योग",
			},
			{
				value: "option2",
				label: language === "english" ? "Pickle Industry" : "अचार उद्योग",
			},
			{
				value: "option3",
				label: language === "english" ? "Grocery Store" : "किराना स्टोर",
			},
			{
				value: "option4",
				label: language === "english" ? "Ola Cab" : "ओला कैब",
			},
		];
	}

	// For yes/no questions
	return [
		{
			value: "",
			label: language === "english" ? "Select your answer" : "अपना उत्तर चुनें",
		},
		{
			value: "true",
			label: language === "english" ? "Yes" : "हाँ",
		},
		{
			value: "false",
			label: language === "english" ? "No" : "नहीं",
		},
	];
};

// Correct answers for each question
const correctAnswers = {
	question1: "option4",
	question2: "true",
	question3: "true",
	question4: "false",
	question5: "true",
	question6: "true",
	question7: "true",
	question8: "true",
	question9: "false",
	question10: "false",
};

const Questions = ({ onQuizComplete }) => {
	const [quizSubmitted, setQuizSubmitted] = useState(false);
	const [score, setScore] = useState(0);
	const [passed, setPassed] = useState(false);
	const [language, setLanguage] = useState("english"); // Default language is English
	const [currentQuestion, setCurrentQuestion] = useState(1);
	const [selectedAnswers, setSelectedAnswers] = useState({
		question1: "",
		question2: "",
		question3: "",
		question4: "",
		question5: "",
		question6: "",
		question7: "",
		question8: "",
		question9: "",
		question10: "",
	});

	// Language Tab Selection Component
	const LanguageSelector = () => (
		<div className="bg-[#6b5be2] pt-4">
			<div className="mx-5 lg:mx-12 justify-center">
				<div className="bg-transparent flex justify-center text-xl">
					<nav className="flex justify-center space-x-2 border border-white rounded-lg px-4 py-2">
						<button
							type="button"
							onClick={() => setLanguage("english")}
							className={`py-1 px-4 transition-all duration-300 transform ${
								language === "english"
									? "bg-gray-600 text-white font-semibold rounded-md"
									: "text-white font-medium hover:text-opacity-70 hover:bg-gray-200 hover:text-[#0E0C22] rounded-md"
							}`}
						>
							English
						</button>
						<button
							type="button"
							onClick={() => setLanguage("hindi")}
							className={`py-1 px-5 pt-2 transition-all duration-300 transform ${
								language === "hindi"
									? "bg-gray-600 text-white font-semibold rounded-md"
									: "text-white font-medium hover:text-opacity-70 hover:bg-gray-200 hover:text-[#0E0C22] rounded-md"
							}`}
						>
							हिंदी
						</button>
					</nav>
				</div>
			</div>
		</div>
	);

	const handleSubmit = (values, { setSubmitting }) => {
		// Calculate the score
		let correctCount = 0;
		Object.keys(correctAnswers).forEach((question) => {
			if (values[question] === correctAnswers[question]) {
				correctCount++;
			}
		});

		setScore(correctCount);
		setPassed(correctCount >= 8); // Pass if 8 or more questions are correct
		setQuizSubmitted(true);
		setSubmitting(false);
	};

	const nextQuestion = () => {
		if (currentQuestion < 10) {
			setCurrentQuestion(currentQuestion + 1);
		}
	};

	const prevQuestion = () => {
		if (currentQuestion > 1) {
			setCurrentQuestion(currentQuestion - 1);
		}
	};

	const handleAnswerSelect = (questionNum, answer) => {
		setSelectedAnswers({
			...selectedAnswers,
			[`question${questionNum}`]: answer,
		});
	};

	// Function to determine option class based on selection
	const getOptionClass = (questionNum, optionValue) => {
		const baseClass =
			"mt-2 items-center justify-center px-6 py-2 rounded-xl shadow-sm border text-gray-800 font-medium text-sm w-1/2 cursor-pointer";

		if (selectedAnswers[`question${questionNum}`] === optionValue) {
			return `${baseClass} bg-purple-200 border-purple-300`;
		}
		return `${baseClass} bg-white border-gray-200`;
	};

	// Quiz display component
	const QuizDisplay = () => {
		// Get the label for the currently selected option for question 1
		const getSelectedOptionLabel = () => {
			const questionKey = `question${currentQuestion}`;
			const selectedValue = selectedAnswers[questionKey];

			if (currentQuestion === 1) {
				// For question 1 with multiple choices
				switch (selectedValue) {
					case "option1":
						return language === "english" ? "Papad Industry" : "पापड़ उद्योग";
					case "option2":
						return language === "english" ? "Pickle Industry" : "अचार उद्योग";
					case "option3":
						return language === "english" ? "Grocery Store" : "किराना स्टोर";
					case "option4":
						return language === "english" ? "Ola Cab" : "ओला कैब";
					default:
						return language === "english" ? "Select an answer" : "अपना उत्तर चुनें";
				}
			} else {
				// For yes/no questions
				switch (selectedValue) {
					case "true":
						return language === "english" ? "Yes" : "हाँ";
					case "false":
						return language === "english" ? "No" : "नहीं";
					default:
						return language === "english" ? "Select an answer" : "अपना उत्तर चुनें";
				}
			}
		};

		// Get the appropriate image for the current question
		const getQuestionImage = () => {
			// Use the correct file extension based on what we found in the public folder
			const imageExtension = [2, 3, 5, 6].includes(currentQuestion)
				? ".png"
				: ".webp";
			return `/Question_${currentQuestion}${imageExtension}`;
		};

		return (
			<div className="bg-[#6b5be2] min-h-screen">
				<div className="pb-8 pt-5">
					<div className="bg-white mx-96 rounded-2xl pb-10">
						<div className="p-5">
							<img
								src={getQuestionImage()}
								alt={`Question ${currentQuestion} illustration`}
								className="rounded-2xl "
							/>
						</div>
						<div className="ml-10 mr-10">
							<h1 className="text-lg text-gray-600">
								QUESTION {currentQuestion} OF 10
							</h1>
							<h1 className="text-3xl text-gray-700 font-semibold">
								{language === "english"
									? questions.english[currentQuestion - 1]
									: questions.hindi[currentQuestion - 1]}
							</h1>

							{/* Preview box showing selected answer */}
							<div className="mt-2 items-center justify-center px-6 py-2 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-800 font-medium mb-2 w-[680px] text-xl">
								{getSelectedOptionLabel()}
							</div>

							{currentQuestion === 1 && (
								<div>
									<div className="flex gap-4">
										<div
											className={getOptionClass(1, "option1")}
											onClick={() => handleAnswerSelect(1, "option1")}
										>
											{language === "english" ? "Papad Industry" : "पापड़ उद्योग"}
										</div>
										<div
											className={getOptionClass(1, "option2")}
											onClick={() => handleAnswerSelect(1, "option2")}
										>
											{language === "english"
												? "Pickle Industry"
												: "अचार उद्योग"}
										</div>
									</div>
									<div className="flex gap-4">
										<div
											className={getOptionClass(1, "option3")}
											onClick={() => handleAnswerSelect(1, "option3")}
										>
											{language === "english" ? "Grocery Store" : "किराना स्टोर"}
										</div>
										<div
											className={getOptionClass(1, "option4")}
											onClick={() => handleAnswerSelect(1, "option4")}
										>
											{language === "english" ? "Ola Cab" : "ओला कैब"}
										</div>
									</div>
								</div>
							)}

							{currentQuestion !== 1 && (
								<div className="flex gap-4">
									<div
										className={getOptionClass(currentQuestion, "true")}
										onClick={() => handleAnswerSelect(currentQuestion, "true")}
									>
										{language === "english" ? "Yes" : "हाँ"}
									</div>
									<div
										className={getOptionClass(currentQuestion, "false")}
										onClick={() => handleAnswerSelect(currentQuestion, "false")}
									>
										{language === "english" ? "No" : "नहीं"}
									</div>
								</div>
							)}

							<div className="flex justify-between mt-10">
								<button
									type="button"
									onClick={prevQuestion}
									className={`bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 ${
										currentQuestion === 1
											? "cursor-not-allowed"
											: "cursor-pointer"
									}`}
									disabled={currentQuestion === 1}
								>
									{language === "english" ? "Previous" : "पिछला"}
								</button>
								{currentQuestion < 10 ? (
									<button
										type="button"
										onClick={nextQuestion}
										className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
									>
										{language === "english" ? "Next" : "अगला"}
									</button>
								) : (
									<button
										type="button"
										onClick={() => {
											// Calculate the score when the user completes the quiz
											let correctCount = 0;
											Object.keys(correctAnswers).forEach((question) => {
												if (
													selectedAnswers[question] === correctAnswers[question]
												) {
													correctCount++;
												}
											});

											setScore(correctCount);
											setPassed(correctCount >= 8); // Pass if 8 or more questions are correct
											setQuizSubmitted(true);
										}}
										className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
									>
										{language === "english" ? "Submit Quiz" : "क्विज़ जमा करें"}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	// Result display component
	const QuizResult = () => (
		<div className="min-w-screen min-h-screen bg-[#6b5be2] flex items-center justify-center px-5 py-5">
			<div className="w-full max-w-2xl">
				<div className="rounded-2xl p-8 bg-white shadow-lg">
					<div className="text-center">
						<div
							className={`text-2xl font-bold mb-4 ${passed ? "text-green-600" : "text-red-600"}`}
						>
							{passed
								? language === "english"
									? "Congratulations! You've passed the quiz."
									: "बधाई हो! आपने क्विज़ पास कर ली है।"
								: language === "english"
									? "Sorry, you need at least 8 correct answers."
									: "क्षमा करें, आपको कम से कम 8 सही उत्तर की आवश्यकता है।"}
						</div>
						<p className="text-xl mb-6">
							{language === "english" ? "Your score: " : "आपका स्कोर: "} {score}
							/10
						</p>
						{passed ? (
							<button
								onClick={() => onQuizComplete(true)}
								className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
								type="button"
							>
								{language === "english"
									? "Proceed to Registration"
									: "पंजीकरण पर जाएं"}
							</button>
						) : (
							<button
								onClick={() => setQuizSubmitted(false)}
								className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
								type="button"
							>
								{language === "english" ? "Try Again" : "पुनः प्रयास करें"}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<>
			{/* Language selector at the top */}
			<LanguageSelector />

			{/* Quiz UI with question by question display or results */}
			{!quizSubmitted ? <QuizDisplay /> : <QuizResult />}
		</>
	);
};

export default Questions;
