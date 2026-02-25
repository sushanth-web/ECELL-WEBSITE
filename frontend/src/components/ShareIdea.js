import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function ShareIdea() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ideaTitle: "",
    problem: "",
    solution: "",
    market: "",
    stage: "",
    team: "",
    link: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        "service_gxgvfmm",   // Replace with your EmailJS Service ID
        "template_sap0ccr",  // Replace with your EmailJS Template ID
        formData,            // Form data will populate template variables
        "QkGFvoS6GYfFWpQw3"    // Replace with your EmailJS Public Key
      );

      // Clear form & show submitted message
      setFormData({
        name: "",
        email: "",
        phone: "",
        ideaTitle: "",
        problem: "",
        solution: "",
        market: "",
        stage: "",
        team: "",
        link: "",
      });
      setSubmitted(true);

      // Hide submitted message after 3s
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Email send error:", err);
      alert("Failed to submit idea. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 min-h-screen pt-10 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            Share Your Startup Idea
          </h1>
          <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mt-3 mb-4" />
          <p className="text-slate-600 text-sm sm:text-base">
            Have an idea? Let us help you validate and build it.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-slate-200
                     p-6 sm:p-8 md:p-10 space-y-5"
        >
          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
            <Input label="Idea Title" name="ideaTitle" value={formData.ideaTitle} onChange={handleChange} required />
          </div>

          <Textarea label="Problem Statement" name="problem" rows={3} value={formData.problem} onChange={handleChange} required />
          <Textarea label="Proposed Solution" name="solution" rows={3} value={formData.solution} onChange={handleChange} required />

          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Target Market" name="market" value={formData.market} onChange={handleChange} />
            <Select
              label="Current Stage"
              name="stage"
              value={formData.stage}
              required
              options={["Idea Stage", "Prototype Built", "Early Users", "Revenue Generating"]}
              onChange={handleChange}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Team Members (optional)" name="team" value={formData.team} onChange={handleChange} />
            <Input label="Pitch Deck / Drive Link" name="link" type="url" value={formData.link} onChange={handleChange} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-full
                       font-semibold text-sm sm:text-base
                       hover:bg-blue-700 active:scale-[0.98] transition
                       flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
                ></path>
              </svg>
            ) : submitted ? (
              "Submitted"
            ) : (
              "Submit Idea"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ===== Reusable Inputs ===== */
function Input({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium mb-1 text-slate-700">{label}</label>
      <input
        type={type}
        {...props}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium mb-1 text-slate-700">{label}</label>
      <textarea
        {...props}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm resize-none
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium mb-1 text-slate-700">{label}</label>
      <select
        {...props}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
