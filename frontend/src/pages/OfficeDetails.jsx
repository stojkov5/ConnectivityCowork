import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import TypeOfBooking from "../components/Offices/TypeOfBooking";
import "../styles/OfficeDetails.css";
import { useTranslation } from "react-i18next";

const OfficeDetails = () => {
  const { t } = useTranslation();

  return (
    <Row
      gutter={[16, 16]}
      justify="center"
      align="middle"
      className="office-details-container mx-auto py-20"
    >
      <Col span={24} className="office-header">
        <h2 className="office-title my-3">{t("officeDetails.title")}</h2>
        <span className="text-gray-400">{t("officeDetails.subtitle")}</span>
      </Col>

      <Col md={12} className="office-image-wrapper justify-end">
        <Link to="/kiselavoda" className="office-image-link">
          <img
            className="office-image"
            src="/Images/Location/KiselaVoda.webp"
            alt={t("officeDetails.kiselaAlt")}
          />
          <p className="office-image-text">{t("officeDetails.kisela")}</p>
        </Link>
      </Col>

      <Col md={12} className="office-image-wrapper justify-baseline">
        <Link to="/center" className="office-image-link">
          <img
            className="office-image"
            src="/Images/Location/Centar.webp"
            alt={t("officeDetails.centarAlt")}
          />
          <p className="office-image-text">{t("officeDetails.centar")}</p>
        </Link>
      </Col>

      <TypeOfBooking />
    </Row>
  );
};

export default OfficeDetails;
