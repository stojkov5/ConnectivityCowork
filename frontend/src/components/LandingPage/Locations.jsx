import { Row, Col } from "antd";
import "../../styles/Locations.css";
import { Link } from "react-router-dom";
const Locations = () => {
  return (
    <div className="py-5 location-section relative mx-auto">
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      <Row
        gutter={[16, 16]}
        justify="center"
        align="middle"
        className="text-center"
      >
        <Col span={24} className="text-white raleway-600">
          <h2 className="text-3xl raleway-600 mb-6">LOCATIONS</h2>
          <p className="raleway-300 text-2xl location-text inline-block px-3 py-2 rounded-2xl">
            Two locations, tailored for any professional's needs
          </p>
        </Col>
        <Col md={12} className="text-white z-10 w-full location-image">
          <Link to="/officedetails" className="relative inline-block w-96 h-60">
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
          <Link to="/officedetails" className="relative inline-block w-96 h-60">
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
    </div>
  );
};
export default Locations;
