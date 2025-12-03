import { Row, Col, Carousel } from "antd";
import "../styles/Contact.css";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation();

  return (
    <>
      <div className="contact-container py-40 px-6 raleway-600">
        <Row gutter={[32, 32]} align="middle">
          {/* Left: Contact Info */}
          <Col xs={24} md={12}>
            <div className="contact-box bg-white p-10 shadow-lg rounded-xl raleway-300">
              <h2 className="text-3xl f mb-6 raleway-600">
                {t("contact.title")}
              </h2>

              <div className="contact-item mb-5">
                <p className="contact-label">{t("contact.emailLabel")}</p>
                <p className="contact-info">{t("contact.emailValue")}</p>
              </div>

              <div className="contact-item mb-5">
                <p className="contact-label">{t("contact.phoneLabel")}</p>
                <p className="contact-info">{t("contact.phoneValue")}</p>
              </div>

              <div className="contact-item">
                <p className="contact-label">{t("contact.locationLabel")}</p>
                <p className="contact-info">{t("contact.location1")}</p>
                <p className="contact-info">{t("contact.location2")}</p>
              </div>
            </div>
          </Col>

          {/* Right: Carousel */}
          <Col xs={24} md={12}>
            <div className="carousel-box shadow-lg rounded-xl overflow-hidden">
              <Carousel autoplay>
                <div className="carousel-slide">
                  <div className="carousel-placeholder">
                    <img
                      src="/Images/Carousel/1.webp"
                      alt={t("contact.carouselAlt")}
                    />
                  </div>
                </div>
                <div className="carousel-slide">
                  <div className="carousel-placeholder">
                    <img
                      src="/Images/Carousel/2.webp"
                      alt={t("contact.carouselAlt")}
                    />
                  </div>
                </div>
                <div className="carousel-slide">
                  <div className="carousel-placeholder">
                    <img
                      src="/Images/Carousel/3.webp"
                      alt={t("contact.carouselAlt")}
                    />
                  </div>
                </div>
                <div className="carousel-slide">
                  <div className="carousel-placeholder">
                    <img
                      src="/Images/Carousel/4.webp"
                      alt={t("contact.carouselAlt")}
                    />
                  </div>
                </div>
                <div className="carousel-slide">
                  <div className="carousel-placeholder">
                    <img
                      src="/Images/Carousel/5.webp"
                      alt={t("contact.carouselAlt")}
                    />
                  </div>
                </div>
              </Carousel>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Contact;
