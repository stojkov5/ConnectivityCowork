import React from "react";
import Marquee from "react-fast-marquee";
import { Monitor, Clock2, MapPinCheck, Wifi, MicOff, Coffee } from "lucide-react";

const features = [
  {
    icon: <Monitor className="w-10 h-10 feature-icon text-primary" />,
    text: "Designated Desk",
  },
  {
    icon: <Clock2 className="w-10 h-10 feature-icon text-primary" />,
    text: "24/h Access",
  },
  {
    icon: <MapPinCheck className="w-10 h-10 feature-icon text-primary" />,
    text: "Central Location",
  },
  {
    icon: <Wifi className="w-10 h-10 feature-icon text-primary" />,
    text: "Fiber Internet",
  },
  {
    icon: <MicOff className="w-10 h-10 feature-icon text-primary" />,
    text: "Quiet Room for Calls",
  },
  {
    icon: <Coffee className="w-10 h-10 feature-icon text-primary" />,
    text: "Complimentary Coffee",
  },
];

const Slider = () => {
  return (
    <div className="py-10 bg-gray-50">
      <Marquee
        gradient={false}
        speed={100}
        pauseOnHover={true}
        className="gap-10"
      >
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center justify-center mx-8 space-x-3"
          >
            {feature.icon}
            <span className="text-lg font-medium text-gray-800">{feature.text}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Slider;
