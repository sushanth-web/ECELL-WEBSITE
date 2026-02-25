import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    team: "",
    motivation: "",
    experience: "",
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
      // EmailJS send
      await emailjs.send(
        "service_gxgvfmm",   // Replace with your EmailJS Service ID
        "template_3y2k7xd",  // Replace with your EmailJS Template ID
        formData,            // Form data will populate template variables
        "QkGFvoS6GYfFWpQw3"    // Replace with your EmailJS Public Key
      );

      // Clear form & show submitted message
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        year: "",
        team: "",
        motivation: "",
        experience: "",
      });
      setSubmitted(true);

      // Hide submitted after 3s
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Email send error:", err);
      alert("Failed to send application. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 min-h-screen pt-10 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* ===== Heading ===== */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            Join E-Cell as a Member
          </h1>
          <div className="w-12 h-1 bg-orange-500 rounded-full mx-auto mt-3 mb-4" />
          <p className="text-slate-600 text-sm sm:text-base">
            Be a part of RGUKT Ongole’s entrepreneurial ecosystem
          </p>
        </div>

        {/* ===== Form Card ===== */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 md:p-10 space-y-5"
        >
          {/* ===== Name & Email ===== */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* ===== Phone & Department ===== */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="Phone Number"
              name="phone"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Department / Branch"
              name="department"
              placeholder="CSE, ECE, Mechanical, etc."
              value={formData.department}
              onChange={handleChange}
            />
          </div>

          {/* ===== Year & Team ===== */}
          <div className="grid sm:grid-cols-2 gap-5">
            <Select
              label="Year of Study"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
            />
            <Select
              label="Preferred Team"
              name="team"
              value={formData.team}
              onChange={handleChange}
              required
              options={[
                "Core Team",
                "Technical Team",
                "Marketing & Outreach",
                "Events & Operations",
                "Design & Media",
              ]}
            />
          </div>

          {/* ===== Motivation ===== */}
          <Textarea
            label="Why do you want to join E-Cell?"
            name="motivation"
            rows={4}
            placeholder="Tell us about your interest in entrepreneurship..."
            value={formData.motivation}
            onChange={handleChange}
            required
          />

          {/* ===== Experience ===== */}
          <Textarea
            label="Prior Experience (optional)"
            name="experience"
            rows={3}
            placeholder="Clubs, startups, projects, internships, etc."
            value={formData.experience}
            onChange={handleChange}
          />

          {/* ===== Submit Button ===== */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-full
                       font-semibold text-sm sm:text-base
                       hover:bg-orange-600 active:scale-[0.98]
                       transition duration-200 flex justify-center items-center gap-2"
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
              "Submit Application"
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
      <label className="block text-xs sm:text-sm font-medium mb-1 text-slate-700">
        {label}
      </label>
      <input
        type={type}
        {...props}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium mb-1 text-slate-700">
        {label}
      </label>
      <select
        {...props}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option value="">Select</option>
        {options.map((opt, i) => (
          <option key={i}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium mb-1 text-slate-700">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm resize-none
                   focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}
