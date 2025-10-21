import {
  Monitor,
  Clock2,
  MapPinCheck,
  Wifi,
  MicOff,
  Coffee,
} from "lucide-react";

const features = [
  {
    icon: <Monitor className="w-10 h-10 text-gray-600" />,
    text: "Designated Desk",
  },
  {
    icon: <Clock2 className="w-10 h-10 text-gray-600" />,
    text: "24/h access",
  },
  {
    icon: <MapPinCheck className="w-10 h-10 text-gray-600" />,
    text: "Central Location",
  },
  {
    icon: <Wifi className="w-10 h-10 text-gray-600" />,
    text: "Fiber Internet",
  },
  {
    icon: <MicOff className="w-10 h-10 text-gray-600" />,
    text: "Quiet room for your phone calls",
  },
  {
    icon: <Coffee className="w-10 h-10 text-gray-600" />,
    text: "Complimentary Coffee",
  },
];

const Features = () => {
  return (
    <section className="py-12 px-6 md:px-12 features-section">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8 text-center">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-4 text-gray-700"
          >
            {feature.icon}
            <p className="text-lg leading-snug max-w-xs">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
