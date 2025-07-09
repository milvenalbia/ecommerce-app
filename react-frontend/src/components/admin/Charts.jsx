import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "January",
    order: 500,
    user: 200,
    amt: 2400,
  },
  {
    name: "Febraury",
    order: 300,
    user: 100,
    amt: 2210,
  },
  {
    name: "March",
    order: 250,
    user: 180,
    amt: 2290,
  },
  {
    name: "April",
    order: 317,
    user: 210,
    amt: 2000,
  },
  {
    name: "May",
    order: 423,
    user: 367,
    amt: 2181,
  },
  {
    name: "June",
    order: 387,
    user: 289,
    amt: 2500,
  },
  {
    name: "July",
    order: 199,
    user: 108,
    amt: 2100,
  },
];

export default function Charts() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="user"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="order" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
