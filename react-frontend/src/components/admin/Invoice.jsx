const Invoice = () => {
  return (
    <div className="bg-white rounded-2xl w-full max-w-2xl px-2 py-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div>
          <h2 className="text-xl font-bold">Invoice #8763</h2>
          <p className="text-gray-500 text-sm">Due On: 15/03/2025</p>
        </div>
        {/* <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" /> Pending
          </span> */}
      </div>

      {/* Payment Details */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-gray-500 text-sm">Payment to</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="bg-orange-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
              B
            </div>
            <div>
              <p className="font-semibold">Bytewave Electronics</p>
              <p className="text-sm text-gray-500">bytewave@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Payment from</p>
          <div className="flex items-center gap-2 justify-end mt-1">
            <div className="bg-red-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center">
              G
            </div>
            <div>
              <p className="font-semibold">Gordon Ramsey</p>
              <p className="text-sm text-gray-500">ramseygordon@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div>
        <div className="flex justify-between mb-2 text-gray-500 text-sm">
          <span>Invoice Items</span>
          <span>4 Total Items</span>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="text-left py-2">Items</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Logitech MX Master 3S Mouse</td>
              <td className="text-center">5x</td>
              <td className="text-right">€495</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Dell UltraSharp 27” Monitor</td>
              <td className="text-center">3x</td>
              <td className="text-right">€1,110</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">MacBook Pro 14” M3</td>
              <td className="text-center">2x</td>
              <td className="text-right">€4,000</td>
            </tr>
            <tr>
              <td className="py-2">Anker USB-C Hubs</td>
              <td className="text-center">10x</td>
              <td className="text-right">€350</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Logitech MX Master 3S Mouse</td>
              <td className="text-center">5x</td>
              <td className="text-right">€495</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Dell UltraSharp 27” Monitor</td>
              <td className="text-center">3x</td>
              <td className="text-right">€1,110</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">MacBook Pro 14” M3</td>
              <td className="text-center">2x</td>
              <td className="text-right">€4,000</td>
            </tr>
            <tr>
              <td className="py-2">Anker USB-C Hubs</td>
              <td className="text-center">10x</td>
              <td className="text-right">€350</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>€5,855</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (19%)</span>
          <span>€1,062</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Discount</span>
          <span>+€0</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total Payment</span>
          <span>€6,917</span>
        </div>
      </div>

      {/* Footer Buttons */}
      {/* <div className="flex justify-between mt-6">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition">
            <Download className="w-4 h-4" /> Download Invoice
          </button>
          <button className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-green-600 transition">
            Pay €6,917
          </button>
        </div> */}
    </div>
  );
};

export default Invoice;
