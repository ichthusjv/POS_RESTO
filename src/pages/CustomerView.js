import React, {useEffect} from 'react'
import { 
  formatNumberWithCommas,
} from '../components/CustomCommon'
import SectionTitle from '../components/Typography/SectionTitle'
import {
  Label,
} from '@windmill/react-ui'
import './../CustomCss.css';
import { useHistory } from 'react-router-dom'

function CustomerView({loggedUser}){
  const history = useHistory(); // ✅ this gives navigation functions
  const cart = JSON.parse(localStorage.getItem('customerOrder'));

  const subTotal = parseFloat(localStorage.getItem('subTotal')) || 0; // Default to 0 if null
  const tax = parseFloat(localStorage.getItem('tax')) || 0;
  const totalDiscount = parseFloat(localStorage.getItem('totalDiscount')) || 0;
  const payableAmount = parseFloat(localStorage.getItem('payableAmount')) || 0;

  // ✅ Handle ESC key to navigate back to /cart
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        history.push("/cart");
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [history]);

  return (
    <>
      <div>

        {/* item side */}
        <div className="px-6 py-4 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 my-3 h-full overflow-y-auto">

          <SectionTitle>Your Order</SectionTitle>

          <div className="px-6 py-4 bg-gray-100 rounded-lg dark:bg-gray-700 mt-5 text-gray-600 dark:text-gray-400 text-sm">
            <div className="flex flex-col text-gray-600 dark:text-gray-400 overflow-y-auto" style={{height: "20rem"}}>
              <div className="grid gap-6 border-b border-white sticky top-0 bg-gray-100 dark:bg-gray-700" style={{ gridTemplateColumns: "1.5fr 1fr 0.5fr 1fr" }}>
                <span className="px-1 py-2">Product</span>
                <span className="px-1 py-2">Price</span>
                <span className="px-1 py-2">Qty</span>
                <span className="px-1 py-2">Total</span>
              </div>

              {cart.map((item, index) => (
                  <div key={index} className="grid gap-6 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer" style={{ gridTemplateColumns: "1.5fr 1fr 0.5fr 1fr" }}>
                    <span className="px-1 py-2 break-words whitespace-normal w-40">{item.productName}</span>
                    <span className="px-1 py-2">{"₱ " + formatNumberWithCommas(item.initialPrice)}</span>
                    <span className="px-1 py-2">{`${item.quantity}`}</span>
                    <span className="px-1 py-2">{"₱ " + formatNumberWithCommas(item.initialPrice * item.quantity)}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-100 rounded-lg dark:bg-gray-700 mt-5 text-gray-600 dark:text-gray-400 text-sm">
            <div className="grid gap-6 grid-cols-2 border-white border-b p-4">
              <div>
                <div className='flex items-center'>
                  <span className="px-1 py-1">Subtotal: </span>
                  <span className="px-1 py-1">{`₱ ${formatNumberWithCommas(subTotal)}`}</span>
                </div>
                <div className='flex items-center'>
                  <span className="px-1 py-1">Tax (VAT included): </span>
                  <span className="px-1 py-1">{`₱ ${formatNumberWithCommas(tax)}`}</span>
                </div>
              </div>
              <div>
                <Label>
                  <span>Discount</span>
                </Label>
                <Label className="mt-2">
                  <span>{`Total Discount: ${totalDiscount.toFixed(2)}%`}</span>
                </Label>
              </div>
            </div>


            <div className='flex items-center mt-5 text-lg justify-between'>
              <div className='flex items-center mt-5 text-lg'>
                <span className="px-1 py-1">Payable Amount: </span>
                <span className="px-1 py-1">{`₱ ${formatNumberWithCommas(payableAmount)}`}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  )
}

export default CustomerView
