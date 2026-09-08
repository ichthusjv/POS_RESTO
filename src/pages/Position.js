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

function Position() {
  const [pageTable, setPageTable] = useState(1)
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([])
  const [dataTablePerPage, setDataTablePerPage] = useState([])
  const [dataTableTotal, setDataTableTotal] = useState([])
  const [dataTableForSearch, setDataTableForSearch] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const [loading, setLoading] = useState(false)

  const apiUrl =  domain + "/api/Positions";
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

  // Add Position
  const [showAddPositionForm, setShowAddPositionForm] = useState(false);
  const openAddPositionForm = () => {
    setShowAddPositionForm(true);
  }
  const closeAddPositionForm = () => {
    setShowAddPositionForm(false);
    resetParameters()
  }

  // Update Position
  const [showUpdatePositionForm, setShowUpdatePositionForm] = useState(false);
  const openUpdatePositionForm = (data) => {
    setSelectedData(data);
    setShowUpdatePositionForm(true);
  }
  const closeUpdatePositionForm = () => {
    setShowUpdatePositionForm(false);
    resetParameters();
  }

  //Delete Position
  const [showDeletePositionForm, setShowDeletePositionForm] = useState(false);
  const openDeletePositionForm = (data) => {
    setSelectedData(data);
    setShowDeletePositionForm(true);
  }
  const closeDeletePositionForm = () => {
    setShowDeletePositionForm(false);
  }

  useEffect(() => {
    if(showUpdatePositionForm){
      setDescription(selectedData.description);
      setIsActive(selectedData.isActive);
    }
  }, [showUpdatePositionForm, selectedData])

  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleAddPosition = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!description) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    const data = {
      description: description,
      isActive: isActive,
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
        closeAddPositionForm();
    }
  };
  const handleUpdatePosition = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!description) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    const data = {
        description: description,
        isActive: isActive,
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
        closeUpdatePositionForm();
    }
  };
  const handleDeletePosition = async () => {
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
        closeDeletePositionForm();
    }
  };
  const resetParameters = () => {
    setDescription("");
    setIsActive(false);
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
      <PageTitle>Positions</PageTitle>
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
            <Button onClick={openAddPositionForm}>Add Position</Button>
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
              <TableCell className="text-center" onClick={() => handleSort('isActive')}>
                Is Active?
                {sortState.id === 'isActive' && (
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
                  <span className="text-sm">{data.isActive ? "True" : "False"}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit" onClick={()=>openUpdatePositionForm(data)}>
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <div className='hidden'>
                      <Button layout="link" size="icon" aria-label="Delete" onClick={()=>openDeletePositionForm(data)}>
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    </div>
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

      {/* Add Position Form */}
      <Modal id="modal" isOpen={showAddPositionForm}>
        <ModalHeader>Add Position Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>Description</span>
            <Input className="mt-1" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            {!description && <span className='text-xs text-red-500'>required</span>}
          </Label>
          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={isActive} onChange={(e)=>setIsActive(e.target.checked)}/>
            <span>Is Active?</span>
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeAddPositionForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleAddPosition}>Add Position</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Update Position Form */}
      <Modal id="modal" isOpen={showUpdatePositionForm}>
        <ModalHeader>Add Position Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>Description</span>
            <Input className="mt-1" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            {!description && <span className='text-xs text-red-500'>required</span>}
          </Label>
          <Label className="my-5">
            <Input type="checkbox" className="mr-2" checked={isActive} onChange={(e)=>setIsActive(e.target.checked)}/>
            <span>Is Active?</span>
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeUpdatePositionForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleUpdatePosition}>Update Position</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Delete Position Form */}
      <Modal id="modal" isOpen={showDeletePositionForm}>
        <ModalHeader>Delete Position Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
            <span>{`Are you sure you want to delete ${selectedData.description} ?`}</span>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeDeletePositionForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleDeletePosition}>Delete Position</Button>
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

export default Position
