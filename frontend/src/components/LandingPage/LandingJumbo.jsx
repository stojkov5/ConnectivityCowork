import { Row, Col } from "antd";
import "../../styles/LandingJumbo.css";
import { Link } from "react-router-dom";
import Slider from "../Slider";
const LandingJumbo = () => {
  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Background Image */}
      <div className="background-div"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-6 sm:px-12 h-full">
        <Row justify="center" className="w-full">
          <Col xs={24} sm={20} md={16} lg={10}>
            <div className="text-center">
              <h1 className="raleway-600 text-white font-bold leading-tight text-[32px] sm:text-[48px] lg:text-[64px] mb-4 tracking-tight animate-fadeUp">
                Co-Working in the
                <br />
                <span className="text-[#ff8c00]">heart of Skopje</span>
              </h1>

              <p className="raleway-300 sub-header text-base sm:text-lg lg:text-xl mb-8 animate-fadeUp delay-200">
                Your cozy workplace: Affordable, Quiet, and Surrounded by
                Downtown Delights
              </p>

              <Link to={"/officedetails"}>
                <button className="landing-btn px-8 py-3 rounded-full font-semibold text-lg animate-fadeUp delay-300">
                  BOOK NOW
                </button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>
      <div className="absolute bottom-0 w-full">
        <Slider />
      </div>
    </div>
  );
};

export default LandingJumbo;
