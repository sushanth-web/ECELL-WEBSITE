import InfoSlider from "./InfoSlider";
import Intro from "./Intro";
import EventSection from "./EventSection";
import SuccessStories from "./SuccessStories";
import Testimonial from "./Testimonial";

const Home = () => {
  
  return (
    <div className="bg-slate-50">
        <Intro />
        <InfoSlider/>
        <EventSection />
        <SuccessStories />
        <Testimonial/>
    </div>
  );
};

export default Home;
