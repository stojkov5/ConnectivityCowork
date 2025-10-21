import Marquee from "react-fast-marquee";

const sliderImages = [
  `/Images/Slider/1.webp`,
  `/Images/Slider/2.webp`,
  `/Images/Slider/3.webp`,
  `/Images/Slider/4.webp`,
  `/Images/Slider/5.webp`,
  `/Images/Slider/6.webp`,
  `/Images/Slider/7.webp`,
  `/Images/Slider/8.webp`,
  `/Images/Slider/9.webp`,
  `/Images/Slider/10.webp`,
];

const PhotoSlider = () => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <Marquee pauseOnHover={true} gradient={false} speed={50}>
        {sliderImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slider ${index + 1}`}
            className="h-50 w-auto mx-4 object-contain"
          />
        ))}
      </Marquee>
    </div>
  );
};

export default PhotoSlider;
