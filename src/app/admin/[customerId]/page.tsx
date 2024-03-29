'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Bill from "@/components/Bill";
import { ProductType } from "../../../../type";
import supabase from "@/supabase/config";
import Orders from "@/components/customer/orders";
import OrderModel from "@/components/orderModel";

const CustomerPage = () => {
  const searchPar = useSearchParams();
  const customerId = searchPar?.get("id");

  const [customerData, setCustomerData] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentBillId, setCurrentBillId] = useState(0);
  const [billData, setBillData] = useState<any>([]);
  const [showBill, setShowBill] = useState(false);
  const [showPlaceOrderModel, setShowPlaceOrderModel] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showOrderModel, setShowOrderModel] = useState(false);
  const [currentBill, setCurrentBill] = useState<BillType>();

  interface BillType {
    data: ProductType[];
    customerData: any;
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await supabase.from('customers_duplicate').select("*").eq('id', customerId).single()
        return data!
      } catch (error) {
        console.error('Error fetching customer courses:', error);
      }
    }
    fetchData().then(data => setCustomerData(data!));
  }, []);

  const tabs = [
    {
      content: <Orders customerId={customerId} />,
      label: "Orders",
    },
    {
      content: "Placeholder 2",
      label: "Some Label",
    },
  ];

  const printBill = async () => {
    setShowBill(true);
    const bill = {
      data: billData,
      customerData: customerData
    };
    setCurrentBill(bill);
    const { data, error } = await supabase.from('bills').insert([bill]).select();
    setCurrentBillId(data![0].id)
    toast.success("When you're ready, please click CTRL + P to print.");
  };

  const setBill = () => {
    const confirm = window.confirm('Sure To Reset Bill ?');
    if (!confirm) return;
    setBillData([])
  }

  return (
    <div className="m-8">
      {customerData && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-8">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <p className="text-gray-600 mb-2">Full Name:</p>
              <p className="font-semibold">{customerData.fullName}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Age:</p>
              <p className="font-semibold">
                {customerData.age ? `${customerData.age} Year(s)` : "No Age"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Phone No.:</p>
              <p className="font-semibold">
                {customerData.phone || "No Phone"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Address:</p>
              <p className="font-semibold">
                {customerData.address || "No Address"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">Education:</p>
              <p className="font-semibold">
                {customerData.faculty || "No Education"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-2">ID:</p>
              <p className="font-semibold text-gray-500 text-xs">
                {customerId}
              </p>
            </div>
          </div>
          <div className="">
            {tabs.map((tab, index) => (
              <button className="bg-blue-500 text-white px-10 py-2 rounded mr-2 font-medium hover:bg-blue-600" type="button" key={index} onClick={() => setCurrentTab(index)}>{tab.label}</button>
            ))}
            <button className="bg-blue-500 ml-auto text-white px-10 py-2 rounded mr-2 font-medium hover:bg-blue-600" type="button" onClick={() => null}>Place Order</button>
          </div>
          <div className="h-[400px] border overflow-auto rounded mt-3 p-3">{tabs[currentTab].content}</div>
        </div>
      )}
      {showPlaceOrderModel && <OrderModel />}
      {showBill && <Bill id={currentBillId} setBillData={setBillData} setShowBill={setShowBill} transactionData={billData} />}
    </div>
  );
};

export default CustomerPage;
