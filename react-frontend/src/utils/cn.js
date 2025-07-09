import { twMegre } from "tailwind-merge";
import clsx from "clsx";
const cn = (...args) => {
  return twMegre(clsx(...args));
};

export default cn;
