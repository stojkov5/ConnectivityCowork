import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import TypeOfBooking from "../components/Offices/TypeOfBooking";
const About = () => {
  return (
    <Row
      gutter={[16, 16]}
      justify="center"
      align="middle"
      className="text-center mb-5"
    >
      <Col span={24} className="text-white raleway-600">
        <h2 className="text-3xl raleway-600 mb-6">LOCATIONS</h2>
        <p className="raleway-300 text-2xl location-text inline-block px-3 py-2 rounded-2xl">
          Office Details
        </p>
        <TypeOfBooking />
      </Col>
      <Col md={12} className="text-white z-10 w-full location-image">
        <Link to="/kiselavoda" className="relative inline-block w-96 h-60">
          <img
            className="w-full h-full rounded-2xl object-cover"
            src="/Images/Location/KiselaVoda.webp"
            alt="Kisela Voda"
          />
          <p
            className="absolute inset-0 flex items-center justify-center 
               text-2xl font-semibold location-text
               rounded-2xl px-4 py-2 w-fit h-fit m-auto z-10"
          >
            KISELA VODA
          </p>
        </Link>
      </Col>
      <Col md={12} className="text-white  z-10 w-full location-image">
        <Link to="/center" className="relative inline-block w-96 h-60">
          <img
            className="w-full h-full rounded-2xl object-cover"
            src="/Images/Location/Centar.webp"
            alt="CENTAR "
          />
          <p
            className="absolute inset-0 flex items-center justify-center 
               text-2xl font-semibold location-text
               rounded-2xl px-4 py-2 w-fit h-fit m-auto z-10"
          >
            CENTAR
          </p>
        </Link>
      </Col>
    </Row>
  );
};

export default About;
