import React, { useState, useEffect, useCallback } from 'react'
import { 
  LoadingScreen,
  DateInput,
  DiscountSelect,
  Notification,
  GetPendingCartInfoByUserId,
  GetOrderSummaryByCartInfoId,
  formatNumberWithCommas
} from '../components/CustomCommon'
import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import { Label, Button, Input, Card, CardBody } from '@windmill/react-ui'
import './../CustomCss.css';
import axios from 'axios'
import { domain, token } from '../App'
import { useHistory } from 'react-router-dom'

function Checkout({loggedUser}) {
  const history = useHistory(); // ✅ this gives navigation functions
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartInfo, setCartInfo] = useState(null);
  const [orderSummary, setOrderSummary] = useState(null);

  const apiUrl =  domain + "/api/Order";
  const fetchData = useCallback(async () => {
      setLoading(true);
      const _cartInfo = await GetPendingCartInfoByUserId(loggedUser.id);
      setCartInfo(_cartInfo);

      try {
          const response = await axios.get(`${apiUrl}/${loggedUser.id}/${_cartInfo.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
          }})
          
          const _orderSummary = await GetOrderSummaryByCartInfoId(_cartInfo.id);
          setOrderSummary(_orderSummary);

          setOrders(response.data);
      } catch (error) {
          setLoading(false);
          console.error('Error fetching data:', error);

          setOrders([]);
      } finally {
          setLoading(false);
      }
  }, [apiUrl, loggedUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData])

  const backToCart = () => {
    // window.location.pathname = "/cart"
    history.push("/cart")
  }

  const generateOrderSummary = (data) => {
    return(
      <div className="flex items-center my-5 text-sm">
          <p className="text-center text-gray-600 dark:text-gray-400 break-words whitespace-normal w-64">{data.productName}</p>
          <p className="text-center text-gray-600 dark:text-gray-400 w-64">{`x ${data.quantity}`}</p>
          <p className="text-center text-gray-600 dark:text-gray-400 w-64">{`₱ ${formatNumberWithCommas(data.totalPrice)}`}</p>
      </div>
    )
  }

  // Notifications
  const [notification, setNotification] = useState(null);
  const showNotification = (type, message) => {
    setNotification({
      type,
      message: message,
    });
    setTimeout(() => setNotification(null), 3000); // Auto close after 3 seconds
  };

  const [discounts, setDiscounts] = useState([])
  const [tempDiscount, setTempDiscount] = useState([])
  
  const generateDiscount = (data) => {
    const remove = () => {
      setDiscounts((prevDiscounts) => 
        prevDiscounts.filter((discount) => discount.id !== data.id)
      );
    };

    return(
      <div className="mt-2 flex items-center">
        <div className='mr-2'>
          <span className="text-gray-600 dark:text-gray-400 break-words whitespace-normal w-64">{`${data.description} - ${parseFloat(data.discountValue).toFixed(2)}%`}</span>
        </div>

        <div className="custom-button">
          <Button className="bg-red-custom h-2" 
            onClick={() => remove()}>
            <span aria-hidden="true" className='text-xs'>
              remove
            </span>
          </Button>
        </div>
      </div>
    )
  }

  const [discountAddState, setDiscountAddState] = useState(false);
  const onDiscountAddState = () => {
    setDiscountAddState(true);
  }
  const offDiscountAddState = () => {
    setDiscountAddState(false);
  }

  const saveDiscount = () => {
    if(!tempDiscount.id){
      showNotification("fail", "Please select discount.");
      return;
    }

    const exists = discounts.some((discount) => discount.id === tempDiscount.id);
  
    if (exists) {
      showNotification("fail", "Already included.");
      return;
    }
  
    setDiscounts((prevDiscounts) => [...prevDiscounts, tempDiscount]);
  
    setTempDiscount([]);
    offDiscountAddState();
  };

  const getSubTotal = () => {
    let subTotal = totalOrder / 1.12;

    return subTotal;
  }

  const getTotalOrder = () => {
    let totalOrder = 0;

    for(const order of orders){
      totalOrder = totalOrder + order.totalPrice;
    }

    return totalOrder;
  }

  const getTax = () => {
    let tax = 0;
    const vatSales = totalOrder / 1.12;

    tax = vatSales * 0.12;

    return tax;
  }

  const getTotalDiscount = () => {
    let totalDiscount = 0;

    for(const discount of discounts){
      totalDiscount = totalDiscount + parseFloat(discount.discountValue);
    }

    return totalDiscount;
  }

  const today = new Date();
  const formattedDateToday = today.toISOString().split("T")[0];
  const totalOrder = getTotalOrder();
  const subTotal = getSubTotal();
  const tax = getTax();
  const totalDiscount = getTotalDiscount();

  const getPayableAmount = () => {
    const discountPercentage = totalDiscount / 100;

    let payableAmount = totalOrder - (totalOrder * discountPercentage);

    return payableAmount;
  }

  const [paymentType, setPaymentType] = useState("Cash");
  const [payment, setPayment] = useState(0);

  const handlePaymentMethodClick = (type) => {
    setPaymentType(type);
  }
  
  const payableAmount = getPayableAmount();
  const changeAmount = payment - payableAmount;

  const completePayment = async () => {
    const apiUrl =  domain + "/api/Transactions";
    setLoading(true);

    if(changeAmount < 0){
      setLoading(false);
      showNotification("fail", "Payment insufficient.")
      return;
    }

    const data = {
      transactionReferenceNumber: formatTransactionId(cartInfo.id),
      cartInfoId: cartInfo.id,
      orderSummaryId: orderSummary.id,
      date: formattedDateToday,
      userId: loggedUser.id,
      subTotal: subTotal.toFixed(2),
      tax: tax.toFixed(2),
      discount: totalDiscount.toFixed(2),
      payableAmount: payableAmount.toFixed(2),
      payment: parseFloat(payment),
      paymentType: paymentType,
      change: changeAmount,
      status: "Completed"
    };

    try {
        await axios.post(apiUrl, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });

        showNotification("success", "Payment successfully completed.")
        // window.location.pathname = "/inventory"
        history.push("/inventory")
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = "An error occurred"; // Default error message
    
        if (error.response) {
            // Check if the response data contains a specific message
            if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data) {
                // If there's any other data in the response, use it
                errorMessage = error.response.data;
            }
        }

        setLoading(false);
        showNotification("fail", errorMessage)
    } finally {
        setLoading(false);
    }
  };

  const formatTransactionId = (value) =>{
    if(value){
      return value.toString().padStart(9, '0');
    }

    return "";
  }

  return (
    <>
      <PageTitle>Checkout</PageTitle>

      <div className="mb-2 rounded-lg custom-button">
        <Button size="small" className="my-2 bg-red-custom" onClick={() => backToCart()}>
          <span aria-hidden="true">
            BACK TO CART
          </span>
        </Button>
      </div>

      <div className='py-5'>
        <SectionTitle>Transaction Information</SectionTitle>

        <div className="px-4 py-3 mb-2 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="grid gap-6 mb-8 grid-cols-2">
            <Label>
              <span>Transaction No.</span>
              <Input className="mt-1 input-custom-light dark:input-custom" value={formatTransactionId(cartInfo?.id)} disabled/>
            </Label>
            <Label>
              <span>Date</span>
              <DateInput getter={formattedDateToday} isReadOnly={true}/>
            </Label>
            <Label>
              <span>Prepared By</span>
              <Input className="mt-1 input-custom-light dark:input-custom" disabled value={loggedUser.fullName}/>
            </Label>
          </div>
        </div>
      </div>

      <div className="grid gap-6 mb-2 md:grid-cols-1 xl:grid-cols-2 mb-20">
        <div>
          <SectionTitle>Order Summary</SectionTitle>

          <div className="px-4 py-3 mb-2 bg-white rounded-lg shadow-md dark:bg-gray-800 max-h-xxl h-full overflow-auto">
            <div className="flex items-center py-2 border-b-2 border-color-white bg-white dark:bg-gray-800 sticky z-10" style={{top: "-12px"}}>
                <p className="font-semibold text-center text-gray-600 dark:text-gray-400 break-words whitespace-normal w-64">Item</p>
                <p className="font-semibold text-center text-gray-600 dark:text-gray-400 w-64">Quantity</p>
                <p className="font-semibold text-center text-gray-600 dark:text-gray-400 w-64">Price</p>
            </div>
            { orders.map((order, i) => (
              generateOrderSummary(order)
            ))}
          </div>
        </div>
        <div>
          <SectionTitle>Payment</SectionTitle>

          <div className="px-4 py-3 mb-2 bg-white rounded-lg shadow-md dark:bg-gray-800 max-h-xxl h-full overflow-auto">
            <div className="py-2">
              <Label className="mt-2">
                <span>SubTotal</span>
                <Input className="mt-1 input-custom-light dark:input-custom" value={`₱ ${formatNumberWithCommas(subTotal)}`} disabled />
              </Label>
            </div>
            <div className="py-2">
              <Label className="mt-2">
                <span>Tax (VAT included)</span>
                <Input className="mt-1 input-custom-light dark:input-custom" value={`₱ ${formatNumberWithCommas(tax)}`} disabled/>
              </Label>
            </div>
            <div className="py-2">
              <Label className="mt-2">
                <span>Discount</span>
              </Label>
              { discounts.length > 0 &&
                  <div className="flex flex-col text-sm mt-1 p-2 rounded-sm shadow-sm dark:bg-gray-700">
                    { discounts.map((discount, i) => (
                      generateDiscount(discount)
                    ))}
                  </div>
                }
              { !discountAddState ?
                    <div className="mb-2 rounded-lg custom-button">
                      <Button size="small" className="my-2 bg-green-custom" onClick={() => onDiscountAddState()}>
                        <span aria-hidden="true">
                          Add
                        </span>
                      </Button>
                    </div>
                  :
                    <div className="mb-2 rounded-lg custom-button">
                      <DiscountSelect getter={tempDiscount} setter={setTempDiscount} />
                      <Button size="small" className="mr-2 my-2 bg-blue-custom" onClick={() => saveDiscount()}>
                        <span aria-hidden="true">
                          Save
                        </span>
                      </Button>
                      <Button size="small" className="my-2 bg-red-custom" 
                        onClick={() => offDiscountAddState()}>
                        <span aria-hidden="true">
                          Cancel
                        </span>
                      </Button>
                    </div>
                }
                <Label className="mt-2">
                  <span>{`Total Discount: ${totalDiscount.toFixed(2)}%`}</span>
                </Label>
            </div>
            <div className="py-2">
              <Label className="mt-5">
                <span>Payable Amount</span>
                <Input className="mt-1 input-custom-light dark:input-custom" value={`₱ ${formatNumberWithCommas(payableAmount)}`} disabled/>
              </Label>
            </div>
            <div className="my-5 p-2 border-gray-200 border rounded-lg shadow-md">
              <div className='flex custom-button'>
                <Button size="regular" layout="outline" className={`my-2 rounded-none-custom w-full ${paymentType === "Cash" ? "bg-blue-custom" : ""}`} onClick={() => handlePaymentMethodClick("Cash")}>
                  <span aria-hidden="true">
                    CASH
                  </span>
                </Button>
                <Button size="regular" layout="outline" className={`my-2 rounded-none-custom w-full ${paymentType === "Card" ? "bg-blue-custom" : ""}`} onClick={() => handlePaymentMethodClick("Card")}>
                  <span aria-hidden="true">
                    CARD / E-WALLET
                  </span>
                </Button>
              </div>
              
              { paymentType === "Cash" &&
                <div>
                  <Label className="mt-1">
                    <span>Cash Amount (in ₱)</span>
                    <Input className="mt-1" type="number" placeholder="Input cash amount" value={payment} onChange={(e)=>setPayment(e.target.value)}/>
                  </Label>
                  <Label className="mt-5">
                    <span>Change</span>
                    <Input className="mt-1" value={`₱ ${payment <= payableAmount ? "0.00" : formatNumberWithCommas(changeAmount)}`} disabled/>
                  </Label>
                  <div className="mt-5 rounded-lg custom-button">
                    <Button size="small" className="my-2 bg-blue-custom" onClick={() => completePayment()}>
                      <span aria-hidden="true">
                        COMPLETE
                      </span>
                    </Button>
                  </div>
                </div>
              }
              { paymentType === "Card" &&
                <div>

                  <div className="mt-5 rounded-lg custom-button">
                    <Card>
                      <CardBody>
                        <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Secure online payment via VeritasPay</p>
                        <p className="text-gray-600 dark:text-gray-400">
                          After clicking <b>"Proceed"</b>, you will be redirected to the secure VeritasPay payment gateway to complete your purchase.
                        </p>
                      </CardBody>
                    </Card>

                    <Button size="small" className="my-4 bg-blue-custom" onClick={() => completePayment()}>
                      <span aria-hidden="true">
                        PROCEED
                      </span>
                    </Button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Loading */}
      {loading && <LoadingScreen/> }
    </>
  )
}

export default Checkout
