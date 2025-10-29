import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import TypeOfBooking from "../components/Offices/TypeOfBooking";
import "../styles/OfficeDetails.css";

const OfficeDetails = () => {
  return (
    <Row
      gutter={[16, 16]}
      justify="center"
      align="middle"
      className="office-details-container mx-auto"
    >
      <Col span={24} className="office-header">
        <h2 className="office-title my-3">OFFICE DETAILS</h2>
      </Col>

      <Col md={12} className="office-image-wrapper">
        <Link to="/kiselavoda" className="office-image-link">
          <img
            className="office-image"
            src="/Images/Location/KiselaVoda.webp"
            alt="Kisela Voda"
          />
          <p className="office-image-text">KISELA VODA</p>
        </Link>
      </Col>

      <Col md={12} className="office-image-wrapper">
        <Link to="/center" className="office-image-link">
          <img
            className="office-image"
            src="/Images/Location/Centar.webp"
            alt="CENTAR"
          />
          <p className="office-image-text">CENTAR</p>
        </Link>
      </Col>
      <TypeOfBooking />
    </Row>
  );
};

export default OfficeDetails;
