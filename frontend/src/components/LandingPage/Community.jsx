/* eslint-disable no-unused-vars */
import { Row, Col } from "antd";
import { motion } from "framer-motion";
import "../../styles/Community.css";
import { useTranslation } from "react-i18next";

const Community = () => {
  const { t } = useTranslation();

  return (
    <section id="community" className="py-25 raleway-300">
      <Row
        justify="center"
        align="middle"
        className="container mx-auto text-center w-full"
      >
        <Col xs={24} md={22}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="community-card"
          >
            <h2 className="community-title raleway-600 text-4xl md:text-5xl font-semibold mb-6 tracking-wide">
              {t("community.title")}
            </h2>

            <p className="community-paragraph mb-8">
              {t("community.p1")}
            </p>

            <Row
              gutter={[16, 16]}
              justify="center"
              className="community-images"
            >
              <Col xs={24} md={8}>
                <img className="w-full rounded-2xl" src="/Images/2.webp" alt="" />
              </Col>
              <Col xs={24} md={8}>
                <img className="w-full rounded-2xl" src="/Images/3.webp" alt="" />
              </Col>
              <Col xs={24} md={8}>
                <img className="w-full rounded-2xl" src="/Images/4.webp" alt="" />
              </Col>
            </Row>

            <p className="community-paragraph mt-8">
              {t("community.p2", {
                email: "contact@coworkonnectivity.com"
              })}{" "}
              <span className="highlight">contact@coworkonnectivity.com</span>.
            </p>
          </motion.div>
        </Col>
      </Row>
    </section>
  );
};

export default Community;
