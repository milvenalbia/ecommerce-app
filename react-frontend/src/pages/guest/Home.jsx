import { useEffect } from "react";
import { AdvancedImage } from "@cloudinary/react";
import Hero from "../../components/guest/Hero";
import { useCartStore } from "../../store/cartStore";
import TitleHeader from "../../components/guest/home/TitleHeader";
import Section from "../../components/guest/home/Section";
import {
  bagOneImg,
  bagThreeImg,
  bagTwoImg,
  boySkateImg,
  cameraImg,
  girlBagImg,
  girlBgImg,
  girlBikeImg,
  shoesImg,
  suitImg,
} from "../../utils/cloudinary";

const Home = () => {
  const { fetchCartItems } = useCartStore();
  useEffect(() => {
    const controller = new AbortController();
    fetchCartItems(controller);

    return () => controller.abort();
  }, []);

  return (
    <>
      <Hero />

      {/* Main Content */}
      <main className="pt-12">
        {/* Title Header */}
        <TitleHeader
          title={"Make it Simple, Make it Pretty"}
          subtitle={"Fashion Thing"}
          text={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non minimanatus suscipit doloremque ea dolorem corrupti."
          }
          hasButton
        />

        {/* Flexbox full width */}
        <Section title={"Featured"}>
          <div className="flex flex-wrap w-full">
            <div className="flex-2 aspect-[2/1]">
              <AdvancedImage
                cldImg={cameraImg}
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="flex-1 aspect-[2/1]">
              <AdvancedImage
                cldImg={suitImg}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>
          <div className="flex flex-wrap w-full">
            <div className="flex-1 aspect-[2/1]">
              <AdvancedImage
                cldImg={shoesImg}
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="flex-2 aspect-[2/1]">
              <AdvancedImage
                cldImg={girlBagImg}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>
        </Section>

        <TitleHeader
          title={"Choose the Best, Make it Yours"}
          subtitle={""}
          text={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non minimanatus suscipit doloremque ea dolorem corrupti."
          }
        />

        <Section title={"Popular"}>
          <div className="flex flex-wrap w-full">
            <div className="flex-1 aspect-square">
              <AdvancedImage
                cldImg={bagOneImg}
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="flex-1 aspect-square">
              <AdvancedImage
                cldImg={bagTwoImg}
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="flex-1 aspect-square">
              <AdvancedImage
                cldImg={bagThreeImg}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>
        </Section>

        <Section title={"The Latest"}>
          <div className="flex flex-wrap w-full">
            <div className="w-full">
              <AdvancedImage
                cldImg={girlBgImg}
                className="w-full h-full object-top object-cover"
              />
            </div>
          </div>

          <div className="flex flex-wrap w-full">
            <div className="flex-1 aspect-[1/1]">
              <AdvancedImage
                cldImg={girlBikeImg}
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="flex-1 aspect-[1/1]">
              <AdvancedImage
                cldImg={boySkateImg}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>
        </Section>
      </main>
    </>
  );
};

export default Home;
