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

const features = [
  { icon: <Monitor className="w-10 h-10 feature-icon" />, text: "Designated Desk" },
  { icon: <Clock2 className="w-10 h-10 feature-icon" />, text: "24/h Access" },
  { icon: <MapPinCheck className="w-10 h-10 feature-icon" />, text: "Central Location" },
  { icon: <Wifi className="w-10 h-10 feature-icon" />, text: "Fiber Internet" },
  { icon: <MicOff className="w-10 h-10 feature-icon" />, text: "Quiet Room for Calls" },
  { icon: <Coffee className="w-10 h-10 feature-icon" />, text: "Complimentary Coffee" },
];

const Features = () => {
  return (
    <section id="features" className="features-wrapper py-5">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto text-center"
      >
        <h2 className="features-title text-4xl md:text-5xl font-semibold mb-12 tracking-wide">
          OUR FEATURES
        </h2>

        <div className="features-grid max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="feature-card flex flex-col items-center justify-center gap-4 p-6"
            >
              {feature.icon}
              <p className="feature-text">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Features;
