import Navbar from "../../components/guest/Navbar";
import Hero from "../../components/guest/Hero";
import ProductList from "../../components/guest/ProductList";

const Home = () => {
  return (
    <>
      <Hero />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-40">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProductList />
        </div>
      </div>
    </>
  );
};

export default Home;
