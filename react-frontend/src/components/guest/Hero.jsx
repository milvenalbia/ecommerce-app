import HeroBg from "../../assets/hero-bg.jpg";
import HeroBg1 from "../../assets/hero-bg-1.webp";
import HeroBg2 from "../../assets/hero-bg-2.webp";
import { ArrowRight } from "lucide-react";
import { heroBgImg } from "../../utils/cloudinary";

const Hero = () => {
  return (
    <section
      className="w-full py-20 relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroBgImg.publicID})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >
      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 bg-black opacity-20"></div> */}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full min-h-[60vh] px-4 sm:px-6 lg:px-8">
        <div className="text-center relative w-full">
          {/* Shadow Layer */}
          <div
            className="absolute left-16 -top-40 w-[475px] text-left"
            aria-hidden="true"
          >
            <h5 className="ml-2 text-2xl text-white font-black uppercase tracking-wider w-full">
              Simple is
            </h5>
            <h1 className="-mt-10 text-[120px] font-black tracking-tight text-white uppercase">
              More
            </h1>
            <p className="-mt-8 ml-2 text-lg tracking-tight text-gray-100">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
              iure culpa atque iusto dolores omnis corrupti facere, aliquam quo
              aspernatur repellendus. Ipsam nam totam rem velit eos odit,
              doloremque deserunt!
            </p>
            <button className="mt-8 bg-white text-black font-bold uppercase tracking-wide px-10 py-2 text-center rounded-full hover:bg-gray-100 flex justify-center items-center gap-2">
              Explore <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
