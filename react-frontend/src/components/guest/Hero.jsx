import HeroBg from "../../assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section
      className="w-full py-20 relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${HeroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full min-h-[60vh] px-4 sm:px-6 lg:px-8">
        <div className="text-center relative w-full">
          {/* Shadow Layer */}
          <h1
            className="absolute inset-0 text-[116px] font-extrabold leading-tight text-white opacity-40 blur-sm select-none"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
            }}
            aria-hidden="true"
          >
            Simple is More
          </h1>

          {/* Foreground Clipped Text */}
          <h1
            className="relative text-[116px] font-extrabold leading-tight bg-clip-text text-transparent w-full"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              backgroundImage: `url(${HeroBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Simple is More
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
