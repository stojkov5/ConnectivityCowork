/* eslint-disable no-unused-vars */
import { Row, Col } from "antd";
import { motion } from "framer-motion";
import "../../styles/Intro.css";
import { useTranslation } from "react-i18next";

const Intro = () => {
  const { t } = useTranslation();

  return (
    <section className="py-5">
      <Row
        justify="center"
        align="middle"
        className="container mx-auto raleway-300"
      >
        <Col xs={24} md={24} lg={24}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-10 text-center relative overflow-hidden"
          >
            <h1 className="intro-title text-4xl md:text-5xl raleway-600 mb-6 tracking-wide">
              {t("intro.title")}
            </h1>

            <p className="intro-paragraph mb-5 text-gray-700">
              {t("intro.p1", {
                brand: t("intro.brand")
              })}
            </p>

            <p className="intro-paragraph mb-5 text-gray-700 leading-relaxed">
              {t("intro.p2", {
                brand: t("intro.brand")
              })}
            </p>

            <p className="intro-paragraph text-gray-700 leading-relaxed">
              {t("intro.p3")}
            </p>
          </motion.div>
        </Col>
      </Row>
    </section>
  );
};

export default Intro;
