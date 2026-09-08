import React, { useState, useEffect, useCallback } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import { 
  LoadingScreen,
  Notification,
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

function AccessTemplate() {
  const [pageTable, setPageTable] = useState(1)
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([])
  const [dataTablePerPage, setDataTablePerPage] = useState([])
  const [dataTableTotal, setDataTableTotal] = useState([])
  const [dataTableForSearch, setDataTableForSearch] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const [loading, setLoading] = useState(false)

  const apiUrl =  domain + "/api/AccessTemplates";
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

  // Add AccessTemplate
  const [showAddAccessTemplateForm, setShowAddAccessTemplateForm] = useState(false);
  const openAddAccessTemplateForm = () => {
    setShowAddAccessTemplateForm(true);
  }
  const closeAddAccessTemplateForm = () => {
    setShowAddAccessTemplateForm(false);
    resetParameters()
  }

  // Update AccessTemplate
  const [showUpdateAccessTemplateForm, setShowUpdateAccessTemplateForm] = useState(false);
  const openUpdateAccessTemplateForm = (data) => {
    setSelectedData(data);
    setShowUpdateAccessTemplateForm(true);
  }
  const closeUpdateAccessTemplateForm = () => {
    setShowUpdateAccessTemplateForm(false);
    resetParameters();
  }

  //Delete AccessTemplate
  const [showDeleteAccessTemplateForm, setShowDeleteAccessTemplateForm] = useState(false);
  const openDeleteAccessTemplateForm = (data) => {
    setSelectedData(data);
    setShowDeleteAccessTemplateForm(true);
  }
  const closeDeleteAccessTemplateForm = () => {
    setShowDeleteAccessTemplateForm(false);
  }

  useEffect(() => {
    if(showUpdateAccessTemplateForm){
      setDescription(selectedData.description);
      setHasDashboard(selectedData.hasDashboard);
      setHasInventory(selectedData.hasInventory);
      setHasCart(selectedData.hasCart);
      setHasCustomerView(selectedData.hasCustomerView);
      setHasAccessTemplates(selectedData.hasAccessTemplates);
      setHasAccounts(selectedData.hasAccounts);
      setHasBrands(selectedData.hasBrands);
      setHasCategories(selectedData.hasCategories);
      setHasDiscounts(selectedData.hasDiscounts);
      setHasEmploymentStatuses(selectedData.hasEmploymentStatuses);
      setHasManageInventory(selectedData.hasManageInventory);
      setHasItemList(selectedData.hasItemList);
      setHasPositions(selectedData.hasPositions);
      setHasCustomers(selectedData.hasCustomers);
      setHasPricePerCategory(selectedData.hasPricePerCategory);
      setHasPricePerCustomer(selectedData.hasPricePerCustomer);
      setHasUsers(selectedData.hasUsers);
      setHasSettings(selectedData.hasSettings);
      setHasBOM(selectedData.hasBOM);
    }
  }, [showUpdateAccessTemplateForm, selectedData])

  const [description, setDescription] = useState("");
  const [hasDashboard, setHasDashboard] = useState(false);
  const [hasInventory, setHasInventory] = useState(false);
  const [hasCart, setHasCart] = useState(false);
  const [hasCustomerView, setHasCustomerView] = useState(false);
  const [hasAccessTemplates, setHasAccessTemplates] = useState(false);
  const [hasAccounts, setHasAccounts] = useState(false);
  const [hasBrands, setHasBrands] = useState(false);
  const [hasCategories, setHasCategories] = useState(false);
  const [hasDiscounts, setHasDiscounts] = useState(false);
  const [hasEmploymentStatuses, setHasEmploymentStatuses] = useState(false);
  const [hasManageInventory, setHasManageInventory] = useState(false);
  const [hasItemList, setHasItemList] = useState(false);
  const [hasPositions, setHasPositions] = useState(false);
  const [hasCustomers, setHasCustomers] = useState(false);
  const [hasPricePerCategory, setHasPricePerCategory] = useState(false);
  const [hasPricePerCustomer, setHasPricePerCustomer] = useState(false);
  const [hasUsers, setHasUsers] = useState(false);
  const [hasSettings, setHasSettings] = useState(false);
  const [hasBOM, setHasBOM] = useState(false);

  const handleAddAccessTemplate = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!description) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    const data = {
      description: description,
      hasDashboard: hasDashboard,
      hasInventory: hasInventory,
      hasCart: hasCart,
      hasCustomerView: hasCustomerView,
      hasAccessTemplates: hasAccessTemplates,
      hasAccounts: hasAccounts,
      hasBrands: hasBrands,
      hasCategories: hasCategories,
      hasDiscounts: hasDiscounts,
      hasEmploymentStatuses: hasEmploymentStatuses,
      hasManageInventory: hasManageInventory,
      hasItemList: hasItemList,
      hasPositions: hasPositions,
      hasCustomers: hasCustomers,
      hasPricePerCategory: hasPricePerCategory,
      hasPricePerCustomer: hasPricePerCustomer,
      hasUsers: hasUsers,
      hasSettings: hasSettings,
      hasBOM: hasBOM,
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
        closeAddAccessTemplateForm();
    }
  };
  const handleUpdateAccessTemplate = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!description) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    const data = {
      description: description,
      hasDashboard: hasDashboard,
      hasInventory: hasInventory,
      hasCart: hasCart,
      hasCustomerView: hasCustomerView,
      hasAccessTemplates: hasAccessTemplates,
      hasAccounts: hasAccounts,
      hasBrands: hasBrands,
      hasCategories: hasCategories,
      hasDiscounts: hasDiscounts,
      hasEmploymentStatuses: hasEmploymentStatuses,
      hasManageInventory: hasManageInventory,
      hasItemList: hasItemList,
      hasPositions: hasPositions,
      hasCustomers: hasCustomers,
      hasPricePerCategory: hasPricePerCategory,
      hasPricePerCustomer: hasPricePerCustomer,
      hasUsers: hasUsers,
      hasSettings: hasSettings,
      hasBOM: hasBOM,
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
        closeUpdateAccessTemplateForm();
    }
  };
  const handleDeleteAccessTemplate = async () => {
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
        closeDeleteAccessTemplateForm();
    }
  };
  const resetParameters = () => {
    setDescription("");
    setHasDashboard(false);
    setHasInventory(false);
    setHasCart(false);
    setHasCustomerView(false);
    setHasAccessTemplates(false);
    setHasAccounts(false);
    setHasBrands(false);
    setHasCategories(false);
    setHasDiscounts(false);
    setHasEmploymentStatuses(false);
    setHasManageInventory(false);
    setHasItemList(false);
    setHasPositions(false);
    setHasCustomers(false);
    setHasPricePerCategory(false);
    setHasPricePerCustomer(false);
    setHasUsers(false);
    setHasSettings(false);
    setHasBOM(false);
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

  return (
    <>
      <PageTitle>Access Templates</PageTitle>
      {/* <!-- Search input --> */}
      <div className="flex flex-1 lg:mr-32 my-3">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search for description"
              aria-label="Search"
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
          <div>
            <Button onClick={openAddAccessTemplateForm}>Add Template</Button>
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
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit" onClick={()=>openUpdateAccessTemplateForm(data)}>
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete" onClick={()=>openDeleteAccessTemplateForm(data)} className="hidden">
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

      {/* Add Access Template Form */}
      <Modal id="modal" isOpen={showAddAccessTemplateForm}>
        <ModalHeader>Add Template Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>Description</span>
            <Input className="mt-1" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            {!description && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasDashboard} onChange={(e)=>setHasDashboard(e.target.checked)}/>
            <span>Has Dashboard</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasInventory} onChange={(e)=>setHasInventory(e.target.checked)}/>
            <span>Has Inventory</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasCart} onChange={(e)=>setHasCart(e.target.checked)}/>
            <span>Has Cart</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasCustomerView} onChange={(e)=>setHasCustomerView(e.target.checked)}/>
            <span>Has Customer's View</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasAccessTemplates} onChange={(e)=>setHasAccessTemplates(e.target.checked)}/>
            <span>Has Access Templates</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasAccounts} onChange={(e)=>setHasAccounts(e.target.checked)}/>
            <span>Has Accounts</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasBrands} onChange={(e)=>setHasBrands(e.target.checked)}/>
            <span>Has Brands</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasCategories} onChange={(e)=>setHasCategories(e.target.checked)}/>
            <span>Has Categories</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasDiscounts} onChange={(e)=>setHasDiscounts(e.target.checked)}/>
            <span>Has Discounts</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasEmploymentStatuses} onChange={(e)=>setHasEmploymentStatuses(e.target.checked)}/>
            <span>Has Employment Statuses</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasManageInventory} onChange={(e)=>setHasManageInventory(e.target.checked)}/>
            <span>Has Items</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasItemList} onChange={(e)=>setHasItemList(e.target.checked)}/>
            <span>Has Item List</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasPositions} onChange={(e)=>setHasPositions(e.target.checked)}/>
            <span>Has Positions</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasCustomers} onChange={(e)=>setHasCustomers(e.target.checked)}/>
            <span>Has Customers</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasPricePerCategory} onChange={(e)=>setHasPricePerCategory(e.target.checked)}/>
            <span>Has Price Per Category</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasPricePerCustomer} onChange={(e)=>setHasPricePerCustomer(e.target.checked)}/>
            <span>Has Price Per Customer</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasUsers} onChange={(e)=>setHasUsers(e.target.checked)}/>
            <span>Has Users</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasSettings} onChange={(e)=>setHasSettings(e.target.checked)}/>
            <span>Has Settings</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasBOM} onChange={(e)=>setHasBOM(e.target.checked)}/>
            <span>Has BOM</span>
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeAddAccessTemplateForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleAddAccessTemplate}>Add Template</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Update Template Form */}
      <Modal id="modal" isOpen={showUpdateAccessTemplateForm}>
        <ModalHeader>Add AccessTemplate Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>Description</span>
            <Input className="mt-1" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            {!description && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasDashboard} onChange={(e)=>setHasDashboard(e.target.checked)}/>
            <span>Has Dashboard</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasInventory} onChange={(e)=>setHasInventory(e.target.checked)}/>
            <span>Has Inventory</span>
          </Label>
          
          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasCart} onChange={(e)=>setHasCart(e.target.checked)}/>
            <span>Has Cart</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasCustomerView} onChange={(e)=>setHasCustomerView(e.target.checked)}/>
            <span>Has Customer's View</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasAccessTemplates} onChange={(e)=>setHasAccessTemplates(e.target.checked)}/>
            <span>Has Access Templates</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasAccounts} onChange={(e)=>setHasAccounts(e.target.checked)}/>
            <span>Has Accounts</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasBrands} onChange={(e)=>setHasBrands(e.target.checked)}/>
            <span>Has Brands</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasCategories} onChange={(e)=>setHasCategories(e.target.checked)}/>
            <span>Has Categories</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasDiscounts} onChange={(e)=>setHasDiscounts(e.target.checked)}/>
            <span>Has Discounts</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasEmploymentStatuses} onChange={(e)=>setHasEmploymentStatuses(e.target.checked)}/>
            <span>Has Employment Statuses</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasManageInventory} onChange={(e)=>setHasManageInventory(e.target.checked)}/>
            <span>Has Items</span>
          </Label>
          
          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasItemList} onChange={(e)=>setHasItemList(e.target.checked)}/>
            <span>Has Item List</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasPositions} onChange={(e)=>setHasPositions(e.target.checked)}/>
            <span>Has Positions</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasCustomers} onChange={(e)=>setHasCustomers(e.target.checked)}/>
            <span>Has Customers</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasPricePerCategory} onChange={(e)=>setHasPricePerCategory(e.target.checked)}/>
            <span>Has Price Per Category</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasPricePerCustomer} onChange={(e)=>setHasPricePerCustomer(e.target.checked)}/>
            <span>Has Price Per Customer</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasUsers} onChange={(e)=>setHasUsers(e.target.checked)}/>
            <span>Has Users</span>
          </Label>
          
          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasSettings} onChange={(e)=>setHasSettings(e.target.checked)}/>
            <span>Has Settings</span>
          </Label>

          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={hasBOM} onChange={(e)=>setHasBOM(e.target.checked)}/>
            <span>Has BOM</span>
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeUpdateAccessTemplateForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleUpdateAccessTemplate}>Update Template</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Delete AccessTemplate Form */}
      <Modal id="modal" isOpen={showDeleteAccessTemplateForm}>
        <ModalHeader>Delete Template Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
            <span>{`Are you sure you want to delete ${selectedData.description} ?`}</span>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeDeleteAccessTemplateForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleDeleteAccessTemplate}>Delete Template</Button>
          </div>
        </ModalFooter>
      </Modal>

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

export default AccessTemplate
