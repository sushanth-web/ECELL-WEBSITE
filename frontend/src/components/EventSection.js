import { useEffect, useState } from "react";
import api from "../services/api"; // Axios instance

const EventSection = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const res = await api.get("/events");
      const upcoming = res.data.upcoming || [];

      // Sort by createdAt descending and take first 3
      const latestThree = upcoming
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      setEvents(latestThree);
    } catch (err) {
      console.error(
        "Failed to fetch events:",
        err.response?.data || err.message
      );
    }
  };

  // ✅ Do not render section if no upcoming events
  if (events.length === 0) return null;

  return (
    <section className="bg-white py-6 md:py-8">
      <div className="mx-auto max-w-6xl px-4 ">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-blue-900">
            Our Events
          </h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-orange-500" />
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-3 ">
          {events.map((e) => (
            <div
              key={e._id}
              className="group shadow-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={e.imageUrl}
                  alt={e.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg md:text-xl font-extrabold text-[#0B2E5F]">
                  {e.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{e.date}</p>
                <p className="mt-4 text-slate-600 leading-7">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventSection;