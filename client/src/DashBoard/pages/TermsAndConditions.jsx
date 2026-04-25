import React from "react";
import { Link } from "react-router-dom";

function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-10 flex justify-center text-white">

      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Terms & Conditions
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Please read carefully before using Best Loan App
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-6 text-sm text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              1. Account Registration
            </h2>
            <p>
              Users must provide accurate and valid information during registration.
              Any false information may lead to account suspension or rejection.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              2. Loan Applications
            </h2>
            <p>
              All loan applications are subject to approval. Submission of an application
              does not guarantee loan approval.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              3. Repayment Terms
            </h2>
            <p>
              Users must repay loans within the agreed duration. Failure to repay may
              result in penalties or restricted access.
            </p>
          </section>

          {/* 🔥 NEW SECTION ADDED */}
          <section>
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              4. Processing Fee Policy
            </h2>
            <p>
              The processing fee is strictly <b>non-refundable</b>. This means that once
              paid, the fee will not be refunded regardless of whether the loan is
              approved, rejected, or canceled for any reason.
            </p>
            <p className="mt-2">
              By submitting a loan application, you acknowledge and agree that the
              processing fee is used for administrative, verification, and system
              processing costs.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              5. Fees & Charges
            </h2>
            <p>
              All applicable fees must be paid as required before loan processing and approval.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              6. User Conduct
            </h2>
            <p>
              Users must not misuse the platform, attempt fraud, or engage in unauthorized activities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              7. Privacy & Security
            </h2>
            <p>
              All user data is securely stored and protected. We do not share personal data without consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-green-400 mb-2">
              8. Updates to Terms
            </h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of the platform
              means acceptance of changes.
            </p>
          </section>

        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center border-t border-white/10 pt-6">

          <p className="text-gray-400 text-sm mb-3">
            By using this app, you agree to these terms.
          </p>

          <Link
            to="/register"
            className="inline-block px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          >
            Back to Register
          </Link>

        </div>

      </div>
    </div>
  );
}

export default TermsAndConditions;