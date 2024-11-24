import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const SixthPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formError, setFormError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        // Basic email and phone validation
        const email = form.email.value;
        const phone = form.phone.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if (!emailRegex.test(email)) {
            setFormError("Please enter a valid email address.");
            return;
        }

        if (!phoneRegex.test(phone)) {
            setFormError("Please enter a valid 10-digit phone number.");
            return;
        }

        // If all validations pass
        setFormError("");

        // Web3Forms API - Mock submit without redirection
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: new FormData(form),
        })
            .then((response) => {
                if (response.ok) {
                    setIsSubmitted(true);
                    setTimeout(() => setIsSubmitted(false), 3010); // Hide success message after 3 seconds
                }
            })
            .catch(() => {
                setFormError("Submission failed. Please try again later.");
            });
    };

    return (
        <div className="contact flex flex-col md:flex-row p-6 md:p-12 w-screen overflow-hidden bg-indigo-50 gap-8">
            {/* Left Section: Form */}
            <div className="flex-1 space-y-6">
                <h2 className="text-4xl font-semibold text-indigo-600">Contact us!</h2>

                <div className='flex rounded-lg bg-[#f3ece4] gap-6'>

                    <div className='flex flex-col flex-1 p-6'>
                    <h2 className="text-xl font-semibold text-indigo-600">Say Hello!</h2>
                        <p className=" text-gray-700">
                            Have questions? Fill the form, and we will get back to you!
                        </p>
                        <form onSubmit={handleSubmit} method="POST" className="mt-6 space-y-4">
                            <input type="hidden" name="access_key" value="d6295a64-037f-47f0-adb4-cf487d753a74" />

                            {/* Row for Name and Email */}
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="block text-gray-700 font-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        className="border-2 border-indigo-600 p-3 rounded-md w-full"
                                        required
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="block text-gray-700 font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="border-2 border-indigo-600 p-3 rounded-md w-full"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row for Phone and Topic */}
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="block text-gray-700 font-medium">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone"
                                        className="border-2 border-indigo-600 p-3 rounded-md w-full"
                                        required
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="block text-gray-700 font-medium">Topic</label>
                                    <select
                                        name="topic"
                                        className="border-2 border-indigo-600 p-3 rounded-md w-full"
                                        required
                                    >
                                        <option value="">Choose topic</option>
                                        <option>Startup</option>
                                        <option>Partner</option>
                                        <option>Office</option>
                                        <option>Funding</option>
                                    </select>
                                </div>
                            </div>

                            {/* Message Field */}
                            <div className="space-y-2">
                                <label className="block text-gray-700 font-medium">Message</label>
                                <textarea
                                    name="message"
                                    placeholder="Message"
                                    className="border-2 border-indigo-600 p-3 rounded-md w-full h-32 resize-none"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="bg-indigo-600 text-white p-3 rounded-md w-full flex items-center justify-center gap-2 hover:bg-indigo-500"
                            >
                                {isSubmitted ? "Sent successfully!" : "Send"}
                                <FontAwesomeIcon icon={faPaperPlane} className="ml-2" />
                            </button>

                            {/* Success/Error Message */}
                            {isSubmitted && (
                                <p className="mt-4 text-green-600 animate-pulse">Sent successfully! We will contact you shortly.</p>
                            )}
                            {formError && (
                                <p className="mt-4 text-red-600">{formError}</p>
                            )}
                        </form>
                    </div>


                    {/* Right Section: Image and Contact Details */}
                    <div className="flex-1 flex items-center justify-center relative">
                        <img
                            src="https://picsum.photos/740/570/?blur" // Placeholder image source
                            alt="Contact Background"
                            className="object-cover w-full h-full md:w-80 lg:w-full"
                            style={{ maxHeight: '570px', maxWidth: '740px' }}
                        />

                        <div className="absolute bottom-40 left-0 w-full text-white text-center">
                            <p className="flex items-center justify-center gap-2 text-lg font-medium">
                                📞 Phone: 957234XXXX / 957234XXXX
                            </p>
                            <p className="mt-2 text-lg font-medium">
                                📍 Address: Mauryalok Complex B-hub 5th floor, Patna <br />
                                Pincode: 800001
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SixthPage;
