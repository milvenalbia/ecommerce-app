const DashboardCard = ({ title, total, icon, text }) => {
  return (
    <div className="bg-white border border-gray-300 p-6 rounded-2xl shadow">
      <div className="flex items-center gap-5">
        <div className="bg-purple-500 text-white p-6 rounded-xl">{icon}</div>
        <div className="flex flex-col gap-1">
          <p className="text-lg text-gray-600">{title}</p>
          <p className="text-4xl font-semibold">{total}</p>
        </div>
      </div>
      <p className="mt-8 text-gray-600 w-10/12">{text}</p>
    </div>
  );
};

export default DashboardCard;
