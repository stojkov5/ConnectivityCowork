const LandingJumbo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden raleway-400">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        crossOrigin="anonymous"
      >
        <source src="/Videos/LandingVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay (optional: for contrast) */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-5 h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold">
          Co-working in the heart of Skopje
        </h1>
        <h2>
          Your cozy workplace: Affordable, Quiet, and Surrounded by Downtown
          Delights
        </h2>
        <div className="flex flex-col sm:flex-row ">
          <button className="landing-btn px-4 py-2 rounded-full text-lg transition">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingJumbo;
