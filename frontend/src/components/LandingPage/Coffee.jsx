/* eslint-disable no-unused-vars */
import React from "react";
import { Row, Col } from "antd";
import { motion } from "framer-motion";
import "../../styles/Coffee.css";
import { useTranslation } from "react-i18next";

const Coffee = () => {
  const { t } = useTranslation();

  return (
    <section id="coffee" className="coffee-section py-5 raleway-300">
      <Row
        justify="center"
        align="middle"
        className="container mx-auto text-center"
      >
        <Col xs={24} md={22}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="coffee-card"
          >
            <h2 className="coffee-title text-4xl md:text-5xl font-semibold mb-6 tracking-wide raleway-600">
              {t("coffee.title")}
            </h2>

            <Row justify="center" gutter={[32, 32]} align="middle">
              <Col md={12} className="w-full h-full">
                <p className="coffee-paragraph py-auto">
                  {t("coffee.p1")}
                </p>
              </Col>

              <Col md={12}>
                <div className="coffee-image-wrapper">
                  <img
                    src="/Images/Coffee.webp"
                    alt={t("coffee.alt")}
                    className="coffee-image rounded-2xl"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </Col>
            </Row>
          </motion.div>
        </Col>
      </Row>
    </section>
  );
};

export default Coffee;
