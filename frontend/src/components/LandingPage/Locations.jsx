/* eslint-disable no-unused-vars */
import { Row, Col } from "antd";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../../styles/Locations.css";
import { useTranslation } from "react-i18next";

const Locations = () => {
  const { t } = useTranslation();

  return (
    <section id="locations" className="location-section relative py-5">
      {/* soft dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-0 backdrop-blur-sm"></div>

      <div className="relative z-10 container mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="location-title text-4xl md:text-5xl font-semibold mb-4 tracking-wide raleway-600"
        >
          {t("locations.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="location-subtitle text-xl md:text-2xl text-white/90 mb-12 inline-block px-6 py-3 rounded-2xl backdrop-blur-md bg-orange-500/85 font-medium"
        >
          {t("locations.subtitle")}
        </motion.p>

        <Row gutter={[32, 32]} justify="center" align="middle">
          {/* Kisela Voda */}
          <Col xs={24} md={10} className="location-col">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="location-card"
            >
              <Link to="/officedetails" className="location-link">
                <img
                  src="/Images/Location/KiselaVoda.webp"
                  alt={t("locations.kiselaAlt")}
                  className="location-img"
                />
                <div className="location-label">
                  <span>{t("locations.kiselaVoda")}</span>
                </div>
              </Link>
            </motion.div>
          </Col>

          {/* Centar */}
          <Col xs={24} md={10} className="location-col">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              className="location-card"
            >
              <Link to="/officedetails" className="location-link">
                <img
                  src="/Images/Location/Centar.webp"
                  alt={t("locations.centarAlt")}
                  className="location-img"
                />
                <div className="location-label">
                  <span>{t("locations.centar")}</span>
                </div>
              </Link>
            </motion.div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Locations;
