/* eslint-disable no-unused-vars */
import {
  Monitor,
  Clock2,
  MapPinCheck,
  Wifi,
  MicOff,
  Coffee,
} from "lucide-react";
import { motion } from "framer-motion";
import "../../styles/Features.css";
import { Row, Col } from "antd";

const features = [
  {
    icon: <Monitor className="w-10 h-10 feature-icon" />,
    text: "Designated Desk",
  },
  { icon: <Clock2 className="w-10 h-10 feature-icon" />, text: "24/h Access" },
  {
    icon: <MapPinCheck className="w-10 h-10 feature-icon" />,
    text: "Central Location",
  },
  { icon: <Wifi className="w-10 h-10 feature-icon" />, text: "Fiber Internet" },
  {
    icon: <MicOff className="w-10 h-10 feature-icon" />,
    text: "Quiet Room for Calls",
  },
  {
    icon: <Coffee className="w-10 h-10 feature-icon" />,
    text: "Complimentary Coffee",
  },
];

const Features = () => {
  return (
    <section id="features" className=" py-5 raleway-300">
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
            className="features-card"
          >
            <h2 className="features-title text-4xl md:text-5xl font-semibold mb-12 tracking-wide raleway-600">
              OUR FEATURES
            </h2>

            <Row
              justify={"center"}
              gutter={[16, 16]} // replaces gap-x-8 (32px) and gap-y-12 (48px)
              className="features-grid mx-auto "
            >
              {features.map((feature, index) => (
                <Col
                  key={index}
                  xs={24} // 1 column on mobile
                  sm={12} // 2 columns on small screens
                  md={8} // 3 columns on medium and up
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="feature-card flex flex-col items-center justify-center gap-4 p-6"
                  >
                    {feature.icon}
                    <p className="feature-text">{feature.text}</p>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Col>
      </Row>
    </section>
  );
};

export default Features;
