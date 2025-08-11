const Section = ({ title, children }) => {
  return (
    <section className="mt-20">
      <h3 className="px-10 text-2xl font-medium mb-5">{title}</h3>
      {children}
    </section>
  );
};

export default Section;
