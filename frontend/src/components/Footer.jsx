import { Row, Col } from "antd";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer-container py-4 px-6">
      <Row
        className="items-center text-center"
        justify="space-between"
        align="middle"
      >
        {/* Left: Logo */}
        <Col xs={24} sm={8} className="footer-logo-col  mb-2 sm:mb-0">
          <img
            src="/Images/Logo2.png"
            alt="Logo"
            className="footer-logo text-center"
          />
        </Col>

        {/* Center: Text */}
        <Col xs={24} sm={8} className="footer-center-text mb-2 sm:mb-0">
          <p className="footer-title text-gray-800 font-bold text-lg tracking-wide">
            COWORK KONNECTIVITY
          </p>
        </Col>

        {/* Right: Social Icons */}
        <Col xs={24} sm={8} className="footer-socials flex gap-4">
          <a
            href="https://www.instagram.com/cowork_konnectivity/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="footer-icon" />
          </a>
          <a
            href="https://x.com/ckonnectiv81867?s=21"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="footer-icon" />
          </a>
          <a
            href="https://www.linkedin.com/company/konnectivity-coworking-space/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="footer-icon" />
          </a>
          <a
            href="https://www.facebook.com/coworkonnectivity"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="footer-icon" />
          </a>
        </Col>
      </Row>
    </footer>
  );
}

export default Footer;
