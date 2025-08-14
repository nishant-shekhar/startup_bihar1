import React, { useState } from "react";
import Questions from "./Questions";
import UserSignup from "./UserSignup";
import StartupDetailsForm from "./StartupDetailsForm";

const StartupRegistrationMain = () => {
	const [quizPassed, setQuizPassed] = useState(false);

	return (
		<div>
			{!quizPassed && <Questions onQuizComplete={() => setQuizPassed(true)} />}
			{quizPassed && <UserSignup />}
		</div>
	);
};

export default StartupRegistrationMain;
