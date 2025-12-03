import React from "react";
import Marquee from "react-fast-marquee";
import {
  Monitor,
  Clock2,
  MapPinCheck,
  Wifi,
  MicOff,
  Coffee
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Slider = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Monitor className="w-10 h-10 feature-icon text-primary" />,
      text: t("slider.designatedDesk")
    },
    {
      icon: <Clock2 className="w-10 h-10 feature-icon text-primary" />,
      text: t("slider.access24")
    },
    {
      icon: <MapPinCheck className="w-10 h-10 feature-icon text-primary" />,
      text: t("slider.centralLocation")
    },
    {
      icon: <Wifi className="w-10 h-10 feature-icon text-primary" />,
      text: t("slider.fiberInternet")
    },
    {
      icon: <MicOff className="w-10 h-10 feature-icon text-primary" />,
      text: t("slider.quietRoom")
    },
    {
      icon: <Coffee className="w-10 h-10 feature-icon text-primary" />,
      text: t("slider.freeCoffee")
    }
  ];

  return (
    <div className="py-10 bg-gray-50">
      <Marquee gradient={false} speed={100} pauseOnHover={true} className="gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center justify-center mx-8 space-x-3"
          >
            {feature.icon}
            <span className="text-lg font-medium text-gray-800">
              {feature.text}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default Slider;
