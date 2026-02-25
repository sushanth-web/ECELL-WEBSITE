import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Trash2, Check, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function Events() {

  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

const [registerData, setRegisterData] = useState({
  name: "",
  email: "",
  phone: "",
  department: "",
  year: "",
  section: "",
});

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
    fetchEvents();
  }, []);

  const fetchEvents = async () => {

    try {

      setLoading(true);

      const res = await api.get("/events");

      setUpcomingEvents(res.data.upcoming || []);
      setPastEvents(res.data.past || []);

      setLoading(false);

    } catch (err) {

      console.error("Fetch events error:", err);
      setLoading(false);

    }

  };

  const handleLogout = () => {

    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    navigate("/");

  };

  const handleRegisterChange = (e) => {

    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });

  };

  const openRegisterModal = (event) => {

    setSelectedEvent(event);
    setShowRegisterModal(true);

  };

  const handleRegisterSubmit = async (e) => {

    e.preventDefault();

    try {

      setSubmitLoading(true);

      const templateParams = {
        ...registerData,
        eventName: selectedEvent.title,
        message: `${registerData.name} has registered for ${selectedEvent.title}`,
      };

      await emailjs.send(
        "service_gxgvfmm",
        "template_3y2k7xd",
        templateParams,
        "QkGFvoS6GYfFWpQw3"
      );

      setSubmitted(true);

      setTimeout(() => {

        setSubmitted(false);
        setShowRegisterModal(false);

       setRegisterData({
  name: "",
  email: "",
  phone: "",
  department: "",
  year: "",
  section: "",
});

      }, 2000);

    } catch (err) {

      console.error("Email error:", err);
      alert("Failed to send registration");

    }

    setSubmitLoading(false);

  };

  const handleAddEvent = async (e) => {

    e.preventDefault();

    const form = e.target;
    const file = form.image.files[0];

    if (!file) return alert("Please select an image");

    const formData = new FormData();

    formData.append("title", form.title.value);
    formData.append("date", form.date.value);
    formData.append("desc", form.desc.value);
    formData.append("image", file);

    try {

      setLoading(true);

      const res = await api.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUpcomingEvents([res.data, ...upcomingEvents]);

      setShowAddEvent(false);
      form.reset();

      setLoading(false);

    } catch (err) {

      console.error(err);
      alert("Failed to add event");

      setLoading(false);

    }

  };

  const handleDeleteEvent = async (id, type) => {

    if (!window.confirm("Delete this event?")) return;

    try {

      await api.delete(`/events/${id}`);

      if (type === "upcoming")
        setUpcomingEvents(upcomingEvents.filter(e => e._id !== id));
      else
        setPastEvents(pastEvents.filter(e => e._id !== id));

    } catch (err) {

      console.error(err);
      alert("Delete failed");

    }

  };

  const handleMarkAsDone = async (event) => {

    try {

      const res = await api.put(`/events/markdone/${event._id}`);

      setUpcomingEvents(upcomingEvents.filter(e => e._id !== event._id));
      setPastEvents([res.data.event, ...pastEvents]);

    } catch (err) {

      console.error(err);
      alert("Failed");

    }

  };

  return (
    

    <section className="bg-slate-50 pt-8 pb-20">

      {/* HEADER */}

      <div className={`max-w-7xl mx-auto px-6 mb-10 ${isAdmin ? "flex justify-between items-center" : "text-center"}`}>

        <div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-blue-900">
            Our Events
          </h1>
          <div className="w-12 sm:w-16 h-1 bg-orange-500 mx-auto mt-3 mb-4 rounded-full" />

          <p className="text-slate-600 text-base sm:text-lg md:text-xl">
            Explore upcoming and past events
          </p>

        </div>

        {isAdmin && (

          <div className="flex gap-3">

            <button
              onClick={() => setShowAddEvent(true)}
              className="bg-blue-900 text-white px-5 py-2 rounded-xl"
            >
              + Add Event
            </button>

            <button
              onClick={handleLogout}
              className="bg-orange-500 text-white px-5 py-2 rounded-xl"
            >
              Logout
            </button>

          </div>

        )}

      </div>

      {/* TABS */}

      <div className="flex justify-center mb-10">

        {["upcoming", "past"].map(tab => (

          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 mx-2 rounded-full font-semibold
            ${activeTab === tab
                ? "bg-blue-900 text-white"
                : "bg-white text-slate-700"}`}
          >

            {tab === "upcoming"
              ? "Upcoming Events"
              : "Past Events"}

          </button>

        ))}

      </div>

      {/* EVENTS GRID */}

      <div className="max-w-7xl mx-auto px-6 grid gap-6 md:grid-cols-3">

        {(activeTab === "upcoming" ? upcomingEvents : pastEvents).map(event => (

          <div
            key={event._id}
            className="bg-white rounded-2xl shadow hover:shadow-xl overflow-hidden relative"
          >

            {isAdmin && (

              <div className="absolute top-3 right-3 flex gap-2">

                {activeTab === "upcoming" && (

                  <button
                    onClick={() => handleMarkAsDone(event)}
                    className="bg-white p-2 rounded shadow"
                  >

                    <Check className="w-5 h-5 text-green-500" />

                  </button>

                )}

                <button
                  onClick={() => handleDeleteEvent(event._id, activeTab)}
                  className="bg-white p-2 rounded shadow"
                >

                  <Trash2 className="w-5 h-5 text-red-500" />

                </button>

              </div>

            )}

            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-44 w-full object-cover"
            />

            <div className="p-5">

              <h3 className="font-semibold text-lg">
                {event.title}
              </h3>

              <p className="text-sm text-slate-500">
                {event.date}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {event.desc}
              </p>

              {activeTab === "upcoming" && (

                <button
                  onClick={() => openRegisterModal(event)}
                  className="mt-4 px-5 py-2 rounded-full text-white bg-blue-900"
                >
                  Register
                </button>

              )}

            </div>

          </div>

        ))}

      </div>

      {/* REGISTER MODAL */}

      {showRegisterModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <form
            onSubmit={handleRegisterSubmit}
            className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4"
          >

            <h2 className="text-xl font-bold">
              Register for {selectedEvent?.title}
            </h2>

            <input name="name" placeholder="Full Name" required onChange={handleRegisterChange} className="input" />
            <input name="email" type="email" placeholder="Email" required onChange={handleRegisterChange} className="input" />
            <input name="phone" placeholder="Phone Number" required onChange={handleRegisterChange} className="input" />
            <input
  name="department"
  placeholder="Department (CSE / ECE / Mechanical)"
  required
  onChange={handleRegisterChange}
  className="input"
/>
            <input name="year" placeholder="Year" required onChange={handleRegisterChange} className="input" />
            <input name="section" placeholder="Section" required onChange={handleRegisterChange} className="input" />

            <div className="flex justify-end gap-3">

              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
              >
                Cancel
              </button>

              <button className="bg-blue-900 text-white px-4 py-2 rounded flex items-center gap-2">

                {submitLoading && (
                  <Loader2 className="animate-spin w-5 h-5" />
                )}

                {submitLoading
                  ? "Submitting"
                  : submitted
                  ? "Submitted"
                  : "Submit"}

              </button>

            </div>

          </form>

        </div>

      )}
      {/* ADD EVENT MODAL */}

{showAddEvent && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <form
      onSubmit={handleAddEvent}
      className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4"
    >

      <h2 className="text-xl font-bold">
        Add New Event
      </h2>

      <input
        name="title"
        placeholder="Event Title"
        required
        className="input w-full border p-2 rounded"
      />

      <input
        name="date"
        placeholder="Event Date"
        required
        className="input w-full border p-2 rounded"
      />

      <textarea
        name="desc"
        placeholder="Event Description"
        required
        className="input w-full border p-2 rounded"
      />

      <input
        type="file"
        name="image"
        accept="image/*"
        required
        className="input w-full"
      />

      <div className="flex justify-end gap-3">

        <button
          type="button"
          onClick={() => setShowAddEvent(false)}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-blue-900 text-white px-4 py-2 rounded flex items-center gap-2"
        >

          {loading && (
            <Loader2 className="animate-spin w-5 h-5" />
          )}

          {loading ? "Adding..." : "Add Event"}

        </button>

      </div>

    </form>

  </div>

)}

    </section>

  );

}