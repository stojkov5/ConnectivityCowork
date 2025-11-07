import { Row, Col } from "antd";
import "../../styles/LandingJumbo.css";

const LandingJumbo = () => {
  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Background Video - Fixed/Static */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        crossOrigin="anonymous"
      >
        <source src="/Videos/LandingVideo.mp4" type="video/mp4" />
      </video>

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

              <p className="raleway-300 sub-header text-base sm:text-lg lg:text-xl mb-8 animate-fadeUp delay-200 raleway-300">
                Your cozy workplace: Affordable, Quiet, and Surrounded by
                Downtown Delights
              </p>

              <button className="landing-btn px-8 py-3 rounded-full font-semibold text-lg animate-fadeUp delay-300">
                BOOK NOW
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LandingJumbo;