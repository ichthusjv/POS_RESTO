import React, { useState, useEffect, useCallback } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import useScanDetection from "use-scan-detection";
import { useHistory } from 'react-router-dom'
import { 
  LoadingScreen,
  Notification,
  CustomerSelect,
  CategoriesSelect,
  GetItemsByCustomer,
  GetItemsByCategory,
  GetPendingCartInfoByUserId,
  GetOrderSummaryByCartInfoId,
  formatNumberWithCommas,
  GetCategories,
  AddItemSelect,
  DiscountSelect
} from '../components/CustomCommon'
import SectionTitle from '../components/Typography/SectionTitle'
import {
  Button,
  Input,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Label,
  Card,
  CardBody
} from '@windmill/react-ui'
import axios from 'axios'
import { domain, token } from '../App'
import './../CustomCss.css';
import { SearchIcon, EditIcon, TrashIcon, SaveIcon, CancelIcon } from '../icons'

function Cart({loggedUser}){
  const history = useHistory(); // ✅ this gives navigation functions
  const [loading, setLoading] = useState(false)
  const [originalItems, setOriginalItems] = useState([])
  const [items, setItems] = useState([])
  const [itemsForSearch, setItemsForSearch] = useState([])
  const [cartInfo, setCartInfo] = useState(null)
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(0);
  const [cart, setCart] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [quantity, setQuantity] = useState(1)

  const fetchDataCart = useCallback(async () => {
    const apiUrl =  domain + "/api/Cart";
    try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/${loggedUser.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }})

        const itemsByCustomer = await GetItemsByCustomer(customerId);
        const itemsByCategory = await GetItemsByCategory(categoryId);

        const originalData = [...response.data].reverse();

        let byCategory = [];
      
        if (itemsByCategory) {
          byCategory = originalData.map((eachData) => {
            const foundItem = itemsByCategory.find((item) => item.itemId === eachData.itemId);
            return foundItem ? { ...eachData, initialPrice: foundItem.price, totalPrice: foundItem.price * eachData.quantity } : eachData;
          });
        } else {
          byCategory = [...originalData];
        }

        let updatedData = [];

        if (itemsByCustomer) {
          updatedData = byCategory.map((eachData) => {
            const foundItem = itemsByCustomer.find((item) => item.itemId === eachData.itemId);
            return foundItem ? { ...eachData, initialPrice: foundItem.price, totalPrice: foundItem.price * eachData.quantity } : eachData;
          });
        } else {
          updatedData = [...byCategory];
        }
        
        localStorage.setItem('customerOrder', JSON.stringify(updatedData));
        setCart(updatedData);
    } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  }, [ loggedUser, customerId, categoryId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault(); // Prevent default tab behavior
        setActiveCategory((prev) => (prev + 1 === categories.length + 1 ? 0 : prev + 1));
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [categories.length]);

  // Notifications
  const [notification, setNotification] = useState(null);
  const showNotification = (type, message) => {
    setNotification({
      type,
      message: message,
    });
    setTimeout(() => setNotification(null), 3000); // Auto close after 3 seconds
  };

  const handleCreateCartInfo = useCallback(async () => {
    const apiUrl =  domain + "/api/CartInfo";

    const data = {
      userId: loggedUser.id,
      isCompleted: false,
    };

    try {
        const response = await axios.post(apiUrl, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });

        return response.data
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

        showNotification("fail", errorMessage)

        return null;
    }
  }, [loggedUser]);

  const apiUrl =  domain + "/api/Items";
  
  const fetchData = useCallback(async () => {
    try {
        setLoading(true);
        const response = await axios.get(apiUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }})

        const foundCartInfo = await GetPendingCartInfoByUserId(loggedUser.id);

        if(!foundCartInfo){ //if not existing then create
          const createdCartInfo = await handleCreateCartInfo()
          setCartInfo(createdCartInfo)
        } else {
          setCartInfo(foundCartInfo)
          setCustomerId(foundCartInfo.customerId)
          setCustomerName(foundCartInfo.customerName)
          setCategoryId(foundCartInfo.categoryId)
          setCategoryDescription(foundCartInfo.categoryDescription)
        }

        const _categories = await GetCategories();
        setCategories(_categories);

        await fetchDataCart();

        setItems(response.data);
        setItemsForSearch(response.data);
        setOriginalItems(response.data);
    } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  }, [apiUrl, loggedUser, handleCreateCartInfo, fetchDataCart]);

  useEffect(() => {
    fetchData();
  }, [fetchData])

  useEffect(() => {
    const sortItemPerCategory = async () => {
      let originalData = originalItems;

      if(activeCategory !== 0){
        originalData = originalData.filter(data => data.categoryId === activeCategory);
      }
      setItems(originalData)
    }

    sortItemPerCategory()
  }, [activeCategory, originalItems]);

  const handleFilter = (value) => {
    const lowercaseValue = value.toLowerCase();
    var res = itemsForSearch.filter((f) =>
      f.barcode.toLowerCase().startsWith(lowercaseValue)
    );

    setItems(res);
    setOriginalItems(res);
  }

  const handleAdd = async (data) => {
    setLoading(true);

    const apiUrl =  domain + "/api/Cart";
    // const cart = await GetCartByUserId(loggedUser.id);
    // const foundCartInfo = await GetPendingCartInfoByUserId(loggedUser.id);

    try {
        await axios.post(apiUrl, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });

        /* if(cart.length <= 0){
          if(!foundCartInfo){ //if existing then update
            await handleCreateCartInfo()
          }
        } */

        await fetchDataCart();

        showNotification("success", "Added to cart.")
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
  }
  const handleUpdate = async (data, cartItem) => {
    setLoading(true);

    const apiUrl =  domain + "/api/Cart";

    const newData = {
      userId: data.userId,
      itemId: data.itemId,
      quantity: data.quantity + cartItem.quantity,
      initialPrice: data.initialPrice,
      totalPrice: data.totalPrice + cartItem.totalPrice,
    };

    try {
        await axios.put(`${apiUrl}/${cartItem.id}`, newData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });

        await fetchDataCart();

        showNotification("success", "Added to cart.")
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
  }

  const fetchDataCartByItemId = useCallback(async (itemId) => {
    const apiUrl =  domain + "/api/Cart";
    try {
        const response = await axios.get(`${apiUrl}/${loggedUser.id}/${itemId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }})

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);

        return null;
    }
  }, [loggedUser]);

  const addToCart = async (item) => {
    const itemId = item.id; // Assuming data has a property itemCode
    const quantity = counter; // Get the quantity from counters, default to 0 if not set
    const totalPrice = item.price * quantity;

    closeAddForm();

    const foundItemInCart = await fetchDataCartByItemId(itemId);

    const data = {
      userId: loggedUser.id,
      itemId: item.id,
      quantity: quantity,
      initialPrice: item.price,
      totalPrice: totalPrice,
    };

    if(!foundItemInCart){ //if not yet in cart > add
      await handleAdd(data)
    } else { //if in cart > update quantity
      await handleUpdate(data, foundItemInCart)
    }
  }

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const openAddForm = (data) => {
    setShowAddForm(true);
    setSelectedItem(data)
  }
  const closeAddForm = () => {
    setShowAddForm(false);
    setCounter(1);
  }
  // Initialize state for counters for each row
  const [counter, setCounter] = useState(1);

  // Handle Increment
  const handleIncrement = () => {
    setCounter(counter + 1)
  };
  const handleDecrement = () => {
    if(counter > 1){
      setCounter(counter - 1)
    }
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

    for(const order of cart){
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
  const getPayableAmount = () => {
    const discountPercentage = totalDiscount / 100;

    let payableAmount = totalOrder - (totalOrder * discountPercentage);

    return payableAmount;
  }

  const today = new Date();
  const formattedDateToday = today.toISOString().split("T")[0];
  const totalOrder = getTotalOrder();
  const subTotal = getSubTotal();
  const tax = getTax();
  const totalDiscount = getTotalDiscount();
  const payableAmount = getPayableAmount();

  localStorage.setItem('subTotal', subTotal);
  localStorage.setItem('tax', tax);
  localStorage.setItem('totalDiscount', totalDiscount);
  localStorage.setItem('payableAmount', payableAmount);

  const formatTransactionId = (value) =>{
    if(value){
      return value.toString().padStart(9, '0');
    }

    return "";
  }

  //barcode feature
  const [barcode, setBarcode] = useState("");
  const [isInputMode, setIsInputMode] = useState(false);

  // Conditionally enable the barcode scanner detection
  useScanDetection({
    onComplete: (scan) => {

      if(!isInputMode){
        setBarcode(scan);
      }
    },
  });

  const getScannedItem = useCallback(async (barcode) => {
    const apiUrl =  domain + "/api/Items";
    try {
        const response = await axios.get(`${apiUrl}/barcode/${barcode}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }})

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
  }, []); 

  useEffect(() => {
    const handleAdd = async (data) => {
      setLoading(true);
  
      const apiUrl =  domain + "/api/Cart";
  
      try {
          await axios.post(apiUrl, data, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
          });
  
          await fetchDataCart();

          showNotification("success", "Added to cart.")
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
    }
    const handleUpdate = async (data, cartItem) => {
      setLoading(true);
  
      const apiUrl =  domain + "/api/Cart";
  
      const newData = {
        userId: data.userId,
        itemId: data.itemId,
        quantity: data.quantity + cartItem.quantity,
        initialPrice: data.initialPrice,
        totalPrice: data.totalPrice + cartItem.totalPrice,
      };
  
      try {
          await axios.put(`${apiUrl}/${cartItem.id}`, newData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
          });
  
        await fetchDataCart();

        showNotification("success", "Added to cart.")
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
    }

    if (barcode) {
      const fetchItem = async () => {
        const item = await getScannedItem(barcode);

        if(!item){
          // showNotification("fail", "No item detected.")
          return;
        }

        const itemId = item.id; // Assuming data has a property itemCode
        // const quantity = 1; // Get the quantity from counters, default to 0 if not set
        const totalPrice = item.price * parseInt(quantity);

        const foundItemInCart = await fetchDataCartByItemId(itemId);

        const data = {
          userId: loggedUser.id,
          itemId: item.id,
          quantity: parseInt(quantity),
          initialPrice: item.price,
          totalPrice: totalPrice,
        };

        if(!foundItemInCart){ //if not yet in cart > add
          await handleAdd(data)
        } else { //if in cart > update quantity
          await handleUpdate(data, foundItemInCart)
        }
        setBarcode("");
        setQuantity(1)
      };

      fetchItem();
    }
  }, [barcode, getScannedItem, fetchDataCartByItemId, loggedUser.id, fetchDataCart, quantity]);

  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const openCustomerSelect = () => {
    setShowCustomerSelect(true);
  }
  const closeCustomerSelect = () => {
    setShowCustomerSelect(false);
  }
  const clearCustomer = async () => {
    setLoading(true);

    const _cartInfo = await GetPendingCartInfoByUserId(loggedUser.id);

    const data = {
        userId: _cartInfo.userId,
        customerId: null,
        categoryId: _cartInfo.categoryId,
        isCompleted: _cartInfo.isCompleted,
    };

    const apiUrl =  domain + "/api/CartInfo";

    try {
        await axios.put(`${apiUrl}/${_cartInfo.id}`, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
        // await fetchData();
        
        showNotification("success", "Updated successfully.")
    } catch (error) {
        console.error('Error:', error);

        // Safely handle JSON parsing
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
        
        showNotification("fail", errorMessage)
    } finally {
      setLoading(false);
      setCustomerId("");
      setCustomerName("");
      setSelectedCustomer(null);
    }
  }

  useEffect(() => {
    if(selectedCustomer){
      setCustomerId(selectedCustomer.id);
      setCustomerName(selectedCustomer.customerName);
    } else {
      setCustomerId("");
      setCustomerName("");
    }
  }, [selectedCustomer])
  
  const [showCategorySelect, setShowCategorySelect] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const openCategorySelect = () => {
    setShowCategorySelect(true);
  }
  const closeCategorySelect = () => {
    setShowCategorySelect(false);
  }
  const clearCategory = async () => {
    setLoading(true);

    const _cartInfo = await GetPendingCartInfoByUserId(loggedUser.id);

    const data = {
        userId: _cartInfo.userId,
        customerId: _cartInfo.customerId,
        categoryId: null,
        isCompleted: _cartInfo.isCompleted,
    };

    const apiUrl =  domain + "/api/CartInfo";

    try {
        await axios.put(`${apiUrl}/${_cartInfo.id}`, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
        // await fetchData();
        
        showNotification("success", "Updated successfully.")
    } catch (error) {
        console.error('Error:', error);

        // Safely handle JSON parsing
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
        
        showNotification("fail", errorMessage)
    } finally {
      setLoading(false);
      setCategoryId("");
      setCategoryDescription("");
      setSelectedCategory(null);
    }
  }

  useEffect(() => {
    if(selectedCategory){
      setCategoryId(selectedCategory.id);
      setCategoryDescription(selectedCategory.description);
    } else {
      setCategoryId("");
      setCategoryDescription("");
    }
  }, [selectedCategory])

  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [tempQuantity, setTempQuantity] = useState(0); 
  const openEditMode = (index, data) => {
    setTempQuantity(data.quantity);
    setSelectedCartItem(data);
    setEditIndex(index);
  }
  const closeEditMode = () => {
    setSelectedCartItem(null);
    setEditIndex(null);
    setTempQuantity(0);
  }

  const handleSave = async() => {
    const apiUrl =  domain + "/api/Cart";
    closeEditMode();
    setLoading(true);

    if(tempQuantity <= 0){
      showNotification("fail", "Please enter a valid quantity.")
      setLoading(false);
      return;
    }

    const totalPrice = selectedCartItem.initialPrice * counter;

    const data = {
        userId: selectedCartItem.userId,
        itemId: selectedCartItem.itemId,
        quantity: tempQuantity,
        initialPrice: selectedCartItem.initialPrice,
        totalPrice: totalPrice,
    };

    try {
        await axios.put(`${apiUrl}/${selectedCartItem.id}`, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
        await fetchDataCart();
        
        showNotification("success", "Updated successfully.")
    } catch (error) {
        console.error('Error:', error);

        // Safely handle JSON parsing
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
        
        showNotification("fail", errorMessage)
    } finally {
        setLoading(false);
    }
  }

  //Delete Cart
  const [showDeleteCartForm, setShowDeleteCartForm] = useState(false);
  const openDeleteCartForm = (data) => {
    setSelectedCartItem(data);
    setShowDeleteCartForm(true);
  }
  const closeDeleteCartForm = () => {
    setShowDeleteCartForm(false);
  }

  const handleDeleteCart = async () => {
    const apiUrl =  domain + "/api/Cart";

    closeDeleteCartForm();
    setLoading(true);
    try {
        await axios.delete(`${apiUrl}/${selectedCartItem.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
        await fetchDataCart();
        
        showNotification("success", "Deleted successfully");
    } catch (error) {
        console.error('Error:', error);

        // Safely handle JSON parsing
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

        showNotification("success", errorMessage);
    } finally {
        setLoading(false);
    }
  };

  const createOderSummary = async () => {
    const apiUrl =  domain + "/api/OrderSummary";

    const data = {
      cartInfoId: cartInfo.id,
      userId: loggedUser.id,
      orders: cart.map(item => {
        return {
          cartInfoId: cartInfo.id,
          itemId: item.itemId,
          productName: item.productName,
          initialPrice: item.initialPrice,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          userId: item.userId
        };
      })
    };

    try {
        await axios.post(apiUrl, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
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

        showNotification("fail", errorMessage)
    }
  }
  const updateOderSummary = async (foundOrderSummary) => {
    const apiUrl =  domain + "/api/OrderSummary";

    const data = {
      cartInfoId: cartInfo.id,
      userId: loggedUser.id,
      orders: cart.map(item => {
        return {
          cartInfoId: cartInfo.id,
          itemId: item.itemId,
          productName: item.productName,
          initialPrice: item.initialPrice,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          userId: item.userId
        };
      })
    };

    try {
        await axios.put(`${apiUrl}/${foundOrderSummary.id}`, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
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

        showNotification("fail", errorMessage)
    }
  }

  const [showCheckOutForm, setShowCheckOutForm] = useState(false);
  const openCheckOutForm = async () => {
    if(cart.length <= 0) {
      showNotification("fail", "No order to check out.")
      return;
    }

    const foundOrderSummary = await GetOrderSummaryByCartInfoId(cartInfo.id);

    if(foundOrderSummary){
      await updateOderSummary(foundOrderSummary)
    } else {
      await createOderSummary();
    }
    
    setShowCheckOutForm(true);
  }
  const closeCheckOutForm = () => {
    setPayment(0)
    setShowCheckOutForm(false);
    setPaymentType("Cash")
  }
  
  const [changeAmount, setChangeAmount] = useState(0);
  const [payment, setPayment] = useState(0);
  const [paymentType, setPaymentType] = useState("Cash");

  useEffect(() => {
    setChangeAmount(payment - payableAmount)
  }, [payableAmount, payment])

  const handlePaymentMethodClick = (type) => {
    setPaymentType(type);
  }

  const completePayment = async () => {
    const apiUrl =  domain + "/api/Transactions";
    setLoading(true);

    if(changeAmount < 0){
      setLoading(false);
      showNotification("fail", "Payment insufficient.")
      return;
    }

    closeCheckOutForm();

    const _orderSummary = await GetOrderSummaryByCartInfoId(cartInfo.id);

    const data = {
      transactionReferenceNumber: formatTransactionId(cartInfo.id),
      cartInfoId: cartInfo.id,
      orderSummaryId: _orderSummary.id,
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

        await fetchDataCart();
        showNotification("success", "Payment successfully completed.")
        // window.location.pathname = "/cart"
        history.push("/cart")
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

  const [showItemSelect, setShowItemSelect] = useState(false);

  const openItemSelectForm = () => {
    setShowItemSelect(true);
  }
  const closeItemSelectForm = () => {
    setShowItemSelect(false);
  }

  return (
    <>
      <PageTitle>Cart</PageTitle>
      {/* <div className="grid gap-6 mb-8 xl:grid-cols-2"> */}

      <div className='flex flex-col sm:flex-row items-center justify-between w-full'>
        {/* <!-- Quantity --> */}
        <div className='w-full'>
          <Label className="my-5 flex flex-row items-center gap- max-w-md">
            <span>Quantity (Next Scan Entry):</span>
            <Input
              className="mt-1"
              placeholder="1"
              type="number"
              value={quantity || 1}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.target.blur(); // remove focus from the input
                }
              }}
              onFocus={() => setIsInputMode(true)}
              onBlur={() => setIsInputMode(false)} // exit input mode on blur
            />
          </Label>
          {isInputMode && 
          <Label>
            <span className='text-red-500'>Please press "Enter" after you set the quantity before scanning items. </span>
          </Label>}
        </div>
      </div>

      <div className='custom-button py-2 w-full'>
        <Button layout="outline" className="bg-green-custom" onClick={()=>openItemSelectForm()}>
          <span aria-hidden="true">Add Item</span>
        </Button>
      </div>

      <div className='mb-20'>

        {/* item side */}
        <div className="px-6 py-4 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 my-3 h-full overflow-y-auto" style={{display: "none"}}>

          <SectionTitle>Inventory</SectionTitle>

          {/* <!-- Search input --> */}
          <div className="flex flex-1 lg:mr-32 my-3">
            <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
              <div className="absolute inset-y-0 flex items-center pl-2">
                <SearchIcon className="w-4 h-4" aria-hidden="true" />
              </div>
              <Input
                className="pl-8 text-gray-700"
                placeholder="Enter barcode"
                aria-label="Search"
                onChange={(e) => handleFilter(e.target.value)}
              />
            </div>
          </div>

          {/* <!-- Categories --> */}
          <div className="flex flex-1 my-3 mt-5 overflow-x-auto py-2">
            <Button className={`mx-2 ${activeCategory === 0 ? "dark:bg-gray-600 bg-gray-200" : ""}`} layout="outline" size="small"
                    onClick={()=>setActiveCategory(0)}>
              All
            </Button>
            {categories.map((data, i) => (
              <Button key={i} className={`mx-2 ${activeCategory === data.id ? "dark:bg-gray-600 bg-gray-200" : ""}`} layout="outline" size="small"
                      onClick={()=>setActiveCategory(data.id)}>
                {data.description}
              </Button>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-100 rounded-lg dark:bg-gray-700">
            <div className="flex flex-col text-gray-600 dark:text-gray-400 overflow-y-auto" style={{height: "34rem"}}>
              <div className="grid gap-24 grid-cols-3 border-b border-white sticky top-0 bg-gray-100 dark:bg-gray-700">
                <span className="px-1 py-2">Product</span>
                <span className="px-1 py-2">Price</span>
                <span className="px-1 py-2">-</span>
              </div>
              {items.map((item, index) => (
                <div key={index} className="grid gap-20 grid-cols-3 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer">
                  <span className="px-1 py-2 break-words whitespace-normal w-64">{item.productName}</span>
                  <span className="px-1 py-2">{"₱ " + formatNumberWithCommas(item.price)}</span>
                  <div className='custom-button px-1 py-2'>
                    <Button size="small" layout="outline" className="bg-green-custom" onClick={()=>openAddForm(item)}>
                      <span aria-hidden="true">Add</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* cart side */}
        <div className="px-6 py-4 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 my-3 h-full overflow-y-auto">
          <div className="px-6 py-4 bg-gray-100 rounded-lg dark:bg-gray-700 ">
            <div className="flex flex-col justify-between text-gray-600 dark:text-gray-400 text-sm">
              <div className='w-full'>
                <div className='flex'>
                  <span className="px-1 py-1">Transaction No.: </span>
                  <span className="px-1 py-1">{`${formatTransactionId(cartInfo?.id)}`}</span>
                </div>
              </div>
              <div className='flex'>
                <span className="px-1 py-1">Prepared by: </span>
                <span className="px-1 py-1">{`${loggedUser.fullName}`}</span>
              </div>
              <div className='flex items-center'>
                <span className="px-1 py-1">Date: </span>
                <span className="px-1 py-1">{`${formattedDateToday}`}</span>
              </div>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
              <div className='w-full xl:flex justify-between'>
                <div className='flex items-center w-full'>
                  <Label className="my-2 w-full flex items-center">
                    <span>Customer: </span>
                    <div className="flex flex-1 ml-2">
                      <Input className="mt-1 mr-2" placeholder="- Select customer -" value={customerName}/>
                      <div className="mt-1 mr-2">
                        <Button onClick={openCustomerSelect}>Select</Button>
                      </div>
                      { customerId &&
                        <div className="mt-1 custom-button">
                          <Button className="bg-red-custom" onClick={clearCustomer}>Clear</Button>
                        </div>
                      }
                    </div>
                  </Label>
                </div>
                <div className='xl:ml-10 flex items-center w-full'>
                  <Label className="my-2 w-full flex items-center">
                    <span>Category: </span>
                    <div className="flex flex-1 ml-2">
                      <Input className="mt-1 mr-2" placeholder="- Select category -" value={categoryDescription}/>
                      <div className="mt-1 mr-2">
                        <Button onClick={openCategorySelect}>Select</Button>
                      </div>

                      { categoryId &&
                      <div className="mt-1 custom-button">
                        <Button className="bg-red-custom" onClick={clearCategory}>Clear</Button>
                      </div>
                      }
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">           
            <div className="px-6 py-4 bg-gray-100 rounded-lg dark:bg-gray-700 mt-5 text-gray-600 dark:text-gray-400 text-sm">
              <div className="flex flex-col text-gray-600 dark:text-gray-400 overflow-y-auto" style={{height: "30rem"}}>
                <div className="grid gap-6 border-b border-white sticky top-0 bg-gray-100 dark:bg-gray-700" style={{ gridTemplateColumns: "1.5fr 1fr 0.5fr 1fr 1fr" }}>
                  <span className="px-1 py-2">Product</span>
                  <span className="px-1 py-2">Price</span>
                  <span className="px-1 py-2">Qty</span>
                  <span className="px-1 py-2">Total</span>
                  <span className="px-1 py-2">-</span>
                </div>

                {cart.map((item, index) => (
                    <div key={index} className="grid gap-6 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer" style={{ gridTemplateColumns: "1.5fr 1fr 0.5fr 1fr 1fr" }}>
                      <span className="px-1 py-2 break-words whitespace-normal w-full">{item.productName}</span>
                      <span className="px-1 py-2">{"₱ " + formatNumberWithCommas(item.initialPrice)}</span>
                      { editIndex === index ?
                        <Input
                          className="text-gray-700"
                          value={tempQuantity}
                          onChange={(e) => setTempQuantity(e.target.value)}
                        />
                        :
                        <span className="px-1 py-2">{`${item.quantity}`}</span>
                      }
                      <span className="px-1 py-2">{"₱ " + formatNumberWithCommas(item.initialPrice * item.quantity)}</span>
                      { editIndex === index ?
                        <div className="flex items-center space-x-4">
                          <Button layout="link" size="icon" aria-label="Save" onClick={()=>handleSave()}>
                            <SaveIcon className="w-5 h-5" aria-hidden="true" />
                          </Button>
                          <Button layout="link" size="icon" aria-label="Cancel" onClick={()=>closeEditMode()}>
                            <CancelIcon className="w-5 h-5" aria-hidden="true" />
                          </Button>
                        </div>
                        :
                        <div className="flex items-center space-x-4">
                          <Button layout="link" size="icon" aria-label="Edit" onClick={()=>openEditMode(index, item)}>
                            <EditIcon className="w-5 h-5" aria-hidden="true" />
                          </Button>
                          <Button layout="link" size="icon" aria-label="Delete" onClick={()=>openDeleteCartForm(item)}>
                            <TrashIcon className="w-5 h-5" aria-hidden="true" />
                          </Button>
                        </div>
                      }
                    </div>
                  ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-100 rounded-lg dark:bg-gray-700 mt-5 text-gray-600 dark:text-gray-400 text-sm">
              <div className="border-white border-b py-4">
                <div>
                  <div className='flex items-center'>
                    <span className="px-1 py-2">Subtotal: </span>
                    <span className="px-1 py-2">{`₱ ${formatNumberWithCommas(subTotal)}`}</span>
                  </div>
                  <div className='flex items-center'>
                    <span className="px-1 py-2">Tax (VAT included): </span>
                    <span className="px-1 py-2">{`₱ ${formatNumberWithCommas(tax)}`}</span>
                  </div>
                </div>
                <div>
                  <Label className="mt-10 px-1">
                    <span>Discount</span>
                  </Label>
                  { discounts.length > 0 &&
                      <div className="flex flex-col text-sm mt-1 p-2 rounded-sm shadow-sm dark:bg-gray-700 px-1">
                        { discounts.map((discount, i) => (
                          generateDiscount(discount)
                        ))}
                      </div>
                    }
                  { !discountAddState ?
                        <div className="mb-2 rounded-lg custom-button  px-1">
                          <Button size="small" className="my-2 bg-green-custom" onClick={() => onDiscountAddState()}>
                            <span aria-hidden="true">
                              Add
                            </span>
                          </Button>
                        </div>
                      :
                        <div className="mb-2 rounded-lg custom-button  px-1">
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
                    <Label className="mt-2 px-1">
                      <span>{`Total Discount: ${totalDiscount.toFixed(2)}%`}</span>
                    </Label>
                </div>
              </div>


              <div className='flex items-center mt-5 text-lg justify-between'>
                <div className='flex items-center mt-5 text-lg'>
                  <span className="px-1 py-1">Payable Amount: </span>
                  <span className="px-1 py-1">{`₱ ${formatNumberWithCommas(payableAmount)}`}</span>
                </div>
                <div className='custom-button px-1 py-2 mt-5 ml-5'>
                  <Button size="small" layout="outline" className="bg-blue-custom" onClick={()=>openCheckOutForm()}>
                    <span aria-hidden="true">CHECK OUT</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <Modal id="modal" isOpen={showAddForm}>
        <ModalHeader>Add Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <div className='flex items-center justify-between py-5 border-white border-b'>
            <span className="px-1 py-2 break-words whitespace-normal w-64 text-lg">{selectedItem?.productName}</span>
            <div className="flex items-center space-x-4">
              <div>
                <Button size="small" layout="outline" className="dark:bg-gray-600" onClick={() => handleDecrement()}>
                  <span aria-hidden="true">-</span>
                </Button>
              </div>

              <div className="w-20 text-center">
                <Input
                  type="number"
                  className="appearance-none no-spinner text-center"
                  style={{ MozAppearance: 'textfield' }}
                  value={counter}
                  onChange={(e) => setCounter(e.target.value)}
                />
              </div>

              <div>
                <Button size="small" layout="outline" className="dark:bg-gray-600" onClick={() => handleIncrement()}>
                  <span aria-hidden="true">+</span>
                </Button>
              </div>
            </div>
          </div>
          <div className='flex items-center justify-end'>
            <span className="px-1 py-2">Total: </span>
            <span className="px-1 py-2">{`₱ ${formatNumberWithCommas(selectedItem?.price * counter)}`}</span>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeAddForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={()=>addToCart(selectedItem)}>Add Item</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Delete Cart Form */}
      <Modal id="modal" isOpen={showDeleteCartForm}>
        <ModalHeader>Delete Item Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
            <span>{`Are you sure you want to delete ${selectedCartItem && selectedCartItem.productName ? selectedCartItem.productName : ""} ?`}</span>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeDeleteCartForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleDeleteCart}>Delete</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Check Out Form */}
      <Modal id="modal" isOpen={showCheckOutForm}>
        <ModalHeader>Check Out Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <div className='flex items-center mt-5 text-base'>
            <span className="px-1 py-1">Payable Amount: </span>
            <span className="px-1 py-1">{`₱ ${formatNumberWithCommas(payableAmount)}`}</span>
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
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeCheckOutForm}>
              Cancel
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {showCustomerSelect && <CustomerSelect isOpen={showCustomerSelect} onClose={closeCustomerSelect} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} loggedUser={loggedUser}/>}
      {showCategorySelect && <CategoriesSelect isOpen={showCategorySelect} onClose={closeCategorySelect} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} loggedUser={loggedUser}/>}
      {showItemSelect && <AddItemSelect isOpen={showItemSelect} onClose={closeItemSelectForm} openAddForm={openAddForm}/>}

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

export default Cart
