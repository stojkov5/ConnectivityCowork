import LandingJumbo from "../components/LandingPage/LandingJumbo";
import Intro from "../components/LandingPage/Intro";
import Community from "../components/LandingPage/Community";
import Locations from "../components/LandingPage/Locations";
import Features from "../components/LandingPage/Features";
import PhotoSlider from "../components/PhotoSlider";
import SocialProof from "../components/LandingPage/SocialProof";
import Coffee from "../components/LandingPage/Coffee";
const Landing = () => {
  return (
    <>
      <div>
        <LandingJumbo />
      </div>
      <div>
        <SocialProof />
      </div>
      <div>
        <Intro />
      </div>
      {/* <div className="py-12 bg-gray-100">
        <PhotoSlider />
      </div> */}
      <div className="py-12 bg-gray-100">
        <Community />
      </div>
      <div>
        <Coffee />
      </div>
      <div>
        <Features />
      </div>
      <div className="mb-5">
        <Locations />
      </div>
    </>
  );
};

export default Landing;
