import React, { useState, useEffect, useCallback } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import { 
  LoadingScreen,
  Notification,
  ItemSelect,
  CustomerSelect,
  formatNumberWithCommas
} from '../components/CustomCommon'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Input,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Label
} from '@windmill/react-ui'
import axios from 'axios'
import { domain, token } from '../App'
import './../CustomCss.css';
import { SearchIcon, EditIcon, TrashIcon } from '../icons'

function PricePerCustomer() {
  const [pageTable, setPageTable] = useState(1)
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([])
  const [dataTablePerPage, setDataTablePerPage] = useState([])
  const [dataTableTotal, setDataTableTotal] = useState([])
  const [dataTableForSearch, setDataTableForSearch] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const [loading, setLoading] = useState(false)

  const apiUrl =  domain + "/api/PricePerCustomer";
  const fetchData = useCallback(async () => {
      try {
          setLoading(true);
          const response = await axios.get(apiUrl, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
          }})

          setDataTableForSearch(response.data);
          setDataTableTotal(response.data);
          setOriginalDataTablePerPage(response.data.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
          setDataTablePerPage(response.data.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      } catch (error) {
          setLoading(false);
          console.error('Error fetching data:', error);
      } finally {
          setLoading(false);
      }
  }, [apiUrl, pageTable]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // pagination setup
  const resultsPerPage = 10
  const totalResults = dataTableTotal.length

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p)
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

  //Search
  const handleFilter = (value) => {
    const lowercaseValue = value.toLowerCase();
    var res = dataTableForSearch.filter((f) =>
      f.description.toLowerCase().includes(lowercaseValue)
      );

      setDataTableTotal(res);
      setDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      setOriginalDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
  };

  // Add PricePerCustomer
  const [showAddPricePerCustomerForm, setShowAddPricePerCustomerForm] = useState(false);
  const openAddPricePerCustomerForm = () => {
    setShowAddPricePerCustomerForm(true);
  }
  const closeAddPricePerCustomerForm = () => {
    setShowAddPricePerCustomerForm(false);
    resetParameters()
    addStateOff()
    setItemsToAdd([])
  }

  // Update PricePerCustomer
  const [showUpdatePricePerCustomerForm, setShowUpdatePricePerCustomerForm] = useState(false);
  const openUpdatePricePerCustomerForm = (data) => {
    setSelectedData(data);
    setShowUpdatePricePerCustomerForm(true);
  }
  const closeUpdatePricePerCustomerForm = () => {
    setShowUpdatePricePerCustomerForm(false);
    resetParameters();
  }

  //Delete PricePerCustomer
  const [showDeletePricePerCustomerForm, setShowDeletePricePerCustomerForm] = useState(false);
  const openDeletePricePerCustomerForm = (data) => {
    setSelectedData(data);
    setShowDeletePricePerCustomerForm(true);
  }
  const closeDeletePricePerCustomerForm = () => {
    setShowDeletePricePerCustomerForm(false);
  }

  useEffect(() => {
    if(showUpdatePricePerCustomerForm){
      console.log(selectedData)
      setDescription(selectedData.description);
      setItemId(selectedData.itemId);
      setItemDescription(`${selectedData.itemDescription} - ₱ ${formatNumberWithCommas(selectedData.price)}`);
      setCustomerId(selectedData.customerId);
      setCustomerName(selectedData.customerName);
      setPrice(selectedData.price);
    }
  }, [showUpdatePricePerCustomerForm, selectedData])

  const [description, setDescription] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [price, setPrice] = useState("");

  const handleAddPricePerCustomer = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!description
      || !itemId
      || !customerId
      || !price
    ) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    const data = {
      description: description,
      itemId: itemId,
      customerId: customerId,
      price: price,
    };

    try {
        await axios.post(apiUrl, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
        await fetchData();

        showNotification("success", "Added successfully.")
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
    } finally {
        setLoading(false);
        resetParameters();
        closeAddPricePerCustomerForm();
    }
  };
  const handleUpdatePricePerCustomer = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!description
      || !itemId
      || !customerId
      || !price
    ) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    const data = {
      description: description,
      itemId: itemId,
      customerId: customerId,
      price: price,
    };

    try {
        await axios.put(`${apiUrl}/${selectedData.id}`, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
        await fetchData();
        
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
        resetParameters();
        closeUpdatePricePerCustomerForm();
    }
  };
  const handleDeletePricePerCustomer = async () => {
    setLoading(true);
    try {
        await axios.delete(`${apiUrl}/${selectedData.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
        await fetchData();
        
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
        resetParameters();
        closeDeletePricePerCustomerForm();
    }
  };
  const resetParameters = () => {
    setDescription("");
    setItemId("");
    setItemDescription("");
    setCustomerId("");
    setCustomerName("");
    setPrice("");
  }

  //Sorting feature
  const [sortState, setSortState] = useState({
    id: null, // null means no sorting
    direction: null, // default sorting direction
  });

  const handleSort = (columnId) => {
    // If the same column is clicked, toggle between ascending and descending
    const newDirection =
      sortState.id === columnId && sortState.direction === 'asc'
        ? 'desc'
        : sortState.id === columnId && sortState.direction === 'desc'
        ? 'default' // Reset to default when clicked again after descending
        : 'asc'; // Start with ascending if it's a new column
  
    // If the new direction is 'default', reset sorting (no sorting)
    if (newDirection === 'default') {
      setSortState({
        id: null,
        direction: null,
      });
      setDataTablePerPage(originalDataTablePerPage); // Optionally reset to original order if no sorting
      return; // Exit the function early if resetting to default
    }
  
    // Update the sort state to the new direction
    setSortState({
      id: columnId,
      direction: newDirection,
    });
  
    // Sort the data based on the selected column and direction
    const sortedData = [...dataTablePerPage].sort((a, b) => {
      const aValue = a[columnId]; // Get value for sorting
      const bValue = b[columnId]; // Get value for sorting
  
      // Handle sorting for numeric columns
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
  
      // Handle sorting for string columns
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
  
      // If not string or number, return 0 (no change)
      return 0;
    });
  
    // Update the table data with sorted data
    setDataTablePerPage(sortedData);
  };

  const [showItemSelect, setShowItemSelect] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const openItemSelect = () => {
    setShowItemSelect(true);
  }
  const closeItemSelect = () => {
    setShowItemSelect(false);
  }

  useEffect(() => {
    if(selectedItem){
      setItemId(selectedItem.id);
      setItemDescription(`${selectedItem.productName} - ₱ ${formatNumberWithCommas(selectedItem.price)}`);
    } else {
      setItemId("");
      setItemDescription("");
    }
  }, [selectedItem])

  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const openCustomerSelect = () => {
    setShowCustomerSelect(true);
  }
  const closeCustomerSelect = () => {
    setShowCustomerSelect(false);
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

  const [itemsToAdd, setItemsToAdd] = useState([]);
  const [isAddState, setIsAddState] = useState(false);
  
  const addStateOn = () => {
    setIsAddState(true)
  }
  const addStateOff = () => {
    setIsAddState(false)
    setSelectedItem(null)
  }
  const addItemHandleClick = () => {
    if(!selectedItem) {
      showNotification("fail", "Please select product.")
      return;
    }
    
    const foundProduct = itemsToAdd.find(i => i?.id === selectedItem?.id)

    if(foundProduct) {
      showNotification("fail", "Already added.")
      return;
    }

    setItemsToAdd((prev) => [...prev, selectedItem]);
    addStateOff()
  }

  return (
    <>
      <PageTitle>Price Per Customer</PageTitle>
      {/* <!-- Search input --> */}
      <div className="flex flex-1 lg:mr-32 my-3">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search for product"
              aria-label="Search"
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
          <div>
            <Button onClick={openAddPricePerCustomerForm}>Add Pricing</Button>
          </div>
      </div>

      {/* table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell className="text-center" onClick={() => handleSort('id')}>
                Id 
                {sortState.id === 'id' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('description')}>
                Description
                {sortState.id === 'description' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('customerName')}>
                Customer
                {sortState.id === 'customerName' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('description')}>
                Product
                {sortState.id === 'description' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('description')}>
                Price
                {sortState.id === 'description' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                Action
              </TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTablePerPage.map((data, i) => (
              <TableRow key={i}>
                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.id}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.description}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.customerName}</span>
                </TableCell>
                
                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.itemDescription}</span>
                </TableCell>
                
                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{`₱ ${formatNumberWithCommas(data.price)}`}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit" onClick={()=>openUpdatePricePerCustomerForm(data)}>
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete" onClick={()=>openDeletePricePerCustomerForm(data)} className="hidden">
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>

      {/* Add PricePerCustomer Form */}
      <Modal id="modal" isOpen={showAddPricePerCustomerForm}>
        <ModalHeader>Add Price Per Customer Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>Description</span>
            <Input className="mt-1" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            {!description && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Customer</span>
            <div className="flex flex-1">
              <Input className="mt-1 mr-2" placeholder="- Select customer -" value={customerName}/>
              <div className="mt-1">
                <Button onClick={openCustomerSelect}>Select</Button>
              </div>
          </div>
          {!customerId && <span className='text-xs text-red-500'>required</span>}
          </Label>
          
          { isAddState &&
            <>
              <Label className="my-5">
                <span>Product</span>
                <div className="flex flex-1">
                  <Input className="mt-1 mr-2" placeholder="- Select product -" value={itemDescription}/>
                  <div className="mt-1">
                    <Button onClick={openItemSelect}>Select</Button>
                  </div>
              </div>
              {!itemId && <span className='text-xs text-red-500'>required</span>}
              </Label>

              <Label className="my-5">
                <span>Price</span>
                <Input className="mt-1" placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} />
                {!price && <span className='text-xs text-red-500'>required</span>}
              </Label>
            </>
          }

          { !isAddState ?
            <button className='bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-lg'
                    onClick={addStateOn}
            >
              Add
            </button>
          :
            <div className='flex flex-row gap-2'>
              <button className='bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg'
                      onClick={addItemHandleClick}
              >
                Save
              </button>
              <button className='bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-lg'
                      onClick={addStateOff}
              >
                Cancel
              </button>
            </div>
          }

          {/* <div className='flex flex-col gap-2 p-4 border rounded-md mt-5'>
            {itemsToAdd?.map((item, index) => (
              <span key={index}>{` ➤ ${item?.productName}`}</span>
            ))}

            {itemsToAdd?.length <= 0 &&
              <span>{`No items to show.`}</span>
            }
          </div> */}

          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell className="text-center" onClick={() => handleSort('description')}>
                    Product
                    {sortState.id === 'description' && (
                      <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center" onClick={() => handleSort('description')}>
                    Price
                    {sortState.id === 'description' && (
                      <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    Action
                  </TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {itemsToAdd.map((data, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-center" style={{justifyItems: "center"}}>
                      <span className="text-sm">{data.productName}</span>
                    </TableCell>
                    
                    <TableCell className="text-center" style={{justifyItems: "center"}}>
                      <span className="text-sm">{`₱ ${formatNumberWithCommas(data.price)}`}</span>
                    </TableCell>

                    <TableCell className="text-center" style={{justifyItems: "center"}}>
                      <div className="flex items-center space-x-4">
                        <Button layout="link" size="icon" aria-label="Edit" onClick={()=>openUpdatePricePerCustomerForm(data)}>
                          <EditIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <Button layout="link" size="icon" aria-label="Delete" onClick={()=>openDeletePricePerCustomerForm(data)}>
                          <TrashIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={onPageChangeTable}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeAddPricePerCustomerForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleAddPricePerCustomer}>Add PricePerCustomer</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Update PricePerCustomer Form */}
      <Modal id="modal" isOpen={showUpdatePricePerCustomerForm}>
        <ModalHeader>Update Price Per Customer Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>Description</span>
            <Input className="mt-1" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            {!description && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Customer</span>
            <div className="flex flex-1">
              <Input className="mt-1 mr-2" placeholder="- Select customer -" value={customerName}/>
              <div className="mt-1">
                <Button onClick={openCustomerSelect}>Select</Button>
              </div>
          </div>
          {!customerId && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Product</span>
            <div className="flex flex-1">
              <Input className="mt-1 mr-2" placeholder="- Select product -" value={itemDescription}/>
              <div className="mt-1">
                <Button onClick={openItemSelect}>Select</Button>
              </div>
          </div>
          {!itemId && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Price</span>
            <Input className="mt-1" placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} />
            {!price && <span className='text-xs text-red-500'>required</span>}
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeUpdatePricePerCustomerForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleUpdatePricePerCustomer}>Update PricePerCustomer</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Delete PricePerCustomer Form */}
      <Modal id="modal" isOpen={showDeletePricePerCustomerForm}>
        <ModalHeader>Delete Price Per Customer Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
            <span>{`Are you sure you want to delete ${selectedData.description} ?`}</span>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeDeletePricePerCustomerForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleDeletePricePerCustomer}>Delete PricePerCustomer</Button>
          </div>
        </ModalFooter>
      </Modal>

      {showItemSelect && <ItemSelect isOpen={showItemSelect} onClose={closeItemSelect} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>}
      {showCustomerSelect && <CustomerSelect isOpen={showCustomerSelect} onClose={closeCustomerSelect} selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>}

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

export default PricePerCustomer
