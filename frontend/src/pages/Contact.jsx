import { Row, Col, Carousel } from "antd";
import "../styles/Contact.css";

function Contact() {
  return (
    <>
      <div className="contact-container py-12 px-6 raleway-600">
        <Row gutter={[32, 32]} align="middle">
          {/* Left: Contact Info */}
          <Col xs={24} md={12}>
            <div className="contact-box bg-white p-10 shadow-lg rounded-xl raleway-300">
              <h2 className="text-3xl f mb-6 raleway-600">
                Contact Us
              </h2>

              <div className="contact-item mb-5">
                <p className="contact-label">Email:</p>
                <p className="contact-info">info@coworkconnectivity.com</p>
              </div>

              <div className="contact-item mb-5">
                <p className="contact-label">Phone Number:</p>
                <p className="contact-info">+389 70 123 456</p>
              </div>

              <div className="contact-item">
                <p className="contact-label">Location:</p>
                <p className="contact-info">Centar - Skopje</p>
                <p className="contact-info">Kisela Voda - Skopje</p>
              </div>
            </div>
          </Col>

          {/* Right: Carousel space */}
          <Col xs={24} md={12}>
            <div className="carousel-box shadow-lg rounded-xl overflow-hidden">
              <Carousel autoplay>
                <div className="carousel-slide">
                  <div className="carousel-placeholder">
                    <img src="/Images/Carousel/1.webp" alt="" />
                  </div>
                </div>
                <div className="carousel-slide">
                  <div className="carousel-placeholder">
                    <img src="/Images/Carousel/2.webp" alt="" />
                  </div>
                </div>
                <div className="carousel-slide">
                  <div className="carousel-placeholder">
                    <img src="/Images/Carousel/3.webp" alt="" />
                  </div>
                </div>
                <div className="carousel-slide">
                  <div className="carousel-placeholder">
                    <img src="/Images/Carousel/4.webp" alt="" />
                  </div>
                </div>
                <div className="carousel-slide">
                  <div className="carousel-placeholder">
                    <img src="/Images/Carousel/5.webp" alt="" />
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
