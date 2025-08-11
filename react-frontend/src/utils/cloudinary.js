import { Cloudinary } from "@cloudinary/url-gen";
import { scale } from "@cloudinary/url-gen/actions/resize";

const cld = new Cloudinary({
  cloud: { cloudName: import.meta.env.VITE_CLOUD_NAME },
});

const suit = "suit_zxd0tu";
const camera = "camera_kqfsw4";
const shoes = "shoes_ybfdph";
const girl_bag = "bag_bmacrf";

const bag1 = "bag1_wbyyrb";
const bag2 = "bag2_jk4wnh";
const bag3 = "bag3_rk074f";

const girlBg = "girl_lcbunk";
const girlBike = "g-bike_ojn70k";
const boySkate = "b-skate_e9qhhj";

const heroBg =
  "https://res.cloudinary.com/dwewghaw7/image/upload/v1754897843/hero-bg-2_ra1w36.webp";

export const heroBgImg = cld
  .image(heroBg)
  .format("auto")
  .quality("auto")
  .resize(scale().width(1920));

export const suitImg = cld
  .image(suit)
  .format("auto")
  .quality("auto")
  .resize(scale().width(500));

export const cameraImg = cld
  .image(camera)
  .format("auto")
  .quality("auto")
  .resize(scale().width(800));

export const shoesImg = cld
  .image(shoes)
  .format("auto")
  .quality("auto")
  .resize(scale().width(500));

export const girlBagImg = cld
  .image(girl_bag)
  .format("auto")
  .quality("auto")
  .resize(scale().width(800));

export const bagOneImg = cld
  .image(bag1)
  .format("auto")
  .quality("auto")
  .resize(scale().width(500));

export const bagTwoImg = cld
  .image(bag2)
  .format("auto")
  .quality("auto")
  .resize(scale().width(500));

export const bagThreeImg = cld
  .image(bag3)
  .format("auto")
  .quality("auto")
  .resize(scale().width(500));

export const girlBgImg = cld
  .image(girlBg)
  .format("auto")
  .quality("auto")
  .resize(scale().width(1920));

export const girlBikeImg = cld
  .image(girlBike)
  .format("auto")
  .quality("auto")
  .resize(scale().width(800));

export const boySkateImg = cld
  .image(boySkate)
  .format("auto")
  .quality("auto")
  .resize(scale().width(800));
