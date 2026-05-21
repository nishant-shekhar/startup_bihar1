
import React from "react";
import NavBarNew from "../HomePage/NavBarNew";
import Footer from "../HomePage/Footer";

const RefundPolicy = () => {
  return (
    <div className="bg-[#f8f9ff] text-slate-900">
      <NavBarNew />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top Hero Section */}
        <section className="overflow-hidden rounded-[32px] mt-20 bg-white shadow-2xl ring-1 ring-slate-200">
          <div className="grid gap-8 px-6 py-10 lg:grid-cols-[1.4fr_0.8fr] lg:px-12 lg:py-14">
            <div>
              <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                Policy Overview
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Refund & Cancellation Policy
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Startup Bihar is committed to clear, fair service terms for all users. Please review our policies regarding cancellations and refunds below.
              </p>
            </div>

            {/* Support Information Box */}
            <div className="rounded-[28px] bg-slate-900 p-8">
              <div className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300">
                Need help?
              </div>
              <div className="mt-6 space-y-4 text-base text-slate-300">
                <p>
                  Email:{" "}
                  <a href="mailto:support@startupbihar.gov.in" className="text-indigo-300 hover:text-indigo-100">
                    support@startupbihar.gov.in
                  </a>
                </p>
                <p>
                  Phone: <span className="font-medium">1800 345 6214</span>
                </p>
                <p>Support hours: Mon–Fri, 10:00 AM – 6:00 PM</p>
              </div>
              <div className="mt-8 rounded-3xl bg-slate-800 p-6 text-slate-300">
                <p className="text-sm uppercase tracking-[0.18em] text-indigo-300">Processing Times</p>
                <ul className="mt-4 space-y-3 text-sm leading-7">
                  <li>UPI: 7–15 business days</li>
                  <li>Cards: 10–20 business days</li>
                  <li>Net Banking: 15–30 business days</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Policy Details Grid */}
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Cancellation Policy Article */}
          <article className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              Cancellations
            </span>
            <h2 className="mt-6 text-2xl font-semibold text-slate-950">Cancellation Policy</h2>
            
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900">User Cancellation</h3>
                <p className="mt-2 text-slate-600">
                  Users can request cancellation within <strong>7 days</strong> provided the application or service process has not already begun.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Non-Cancellable Services</h3>
                <ul className="mt-3 space-y-2 text-slate-600">
                  <li className="list-disc pl-5">Startup verification process</li>
                  <li className="list-disc pl-5">Incubation onboarding</li>
                  <li className="list-disc pl-5">Mentorship sessions</li>
                  <li className="list-disc pl-5">Government scheme applications</li>
                  <li className="list-disc pl-5">Workshops already attended</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Administration Cancellation</h3>
                <p className="mt-2 text-slate-600">
                  Applications may be cancelled by the administration if false, misleading, or incomplete information is provided by the user.
                </p>
              </div>
            </div>
          </article>

          {/* Refund Policy Article */}
          <article className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              Refunds
            </span>
            <h2 className="mt-6 text-2xl font-semibold text-slate-950">Refund Policy</h2>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900">Eligible Scenarios</h3>
                <ul className="mt-3 space-y-2 text-slate-600">
                  <li className="list-disc pl-5">Duplicate payment</li>
                  <li className="list-disc pl-5">Technical payment failure</li>
                  <li className="list-disc pl-5">Service unavailable</li>
                  <li className="list-disc pl-5">Event cancelled by platform</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Non-Refundable Cases</h3>
                <ul className="mt-3 space-y-2 text-slate-600">
                  <li className="list-disc pl-5">Application already processed</li>
                  <li className="list-disc pl-5">Incorrect information provided</li>
                  <li className="list-disc pl-5">User becomes ineligible</li>
                  <li className="list-disc pl-5">Missing documents from user</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Partial Refunds</h3>
                <p className="mt-2 text-slate-600">
                  Partial refunds may be issued after deducting administrative and processing charges at the discretion of the platform.
                </p>
              </div>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicy;

