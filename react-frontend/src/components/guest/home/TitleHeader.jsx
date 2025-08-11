import { Link } from "react-router";

const TitleHeader = ({ title, subtitle, text, hasButton = false }) => {
  return (
    <div className="mt-10 max-w-7xl mx-auto flex flex-col justify-center items-center gap-1 text-center">
      {subtitle && (
        <p className="font-semibold tracking-tight text-black">{subtitle}</p>
      )}
      <h1 className="text-6xl font-black uppercase text-black tracking-tighter">
        {title}
      </h1>
      <p className="text-black mt-3">{text}</p>
      {hasButton && (
        <Link
          to={"/shops"}
          className="mt-5 bg-black px-5 py-2 font-bold text-white rounded-full transition duration-300 hover:bg-gray-500"
        >
          Shop
        </Link>
      )}
    </div>
  );
};

export default TitleHeader;
