import React, { useState, useEffect, useCallback } from 'react';
import loadingSpinner from "../assets/loading.gif";
import { domain, token } from '../App'
import axios from 'axios'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Pagination,
  Select,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Button,
  Label,
  Input
} from '@windmill/react-ui'
import './../CustomCss.css';
import { SearchIcon } from '../icons'

// Main component
export const FullSizeImage = ({ src, alt, onClose }) => {
  return (
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-2xl max-h-2xl object-contain shadow-lg"
        />
      </div>
  );
};

export const LoadingScreen = () => {
  return (
    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20" style={{zIndex: 101}}>
      <img
        src={loadingSpinner}
        alt="Loading..."
        className="w-24 h-24"
      />
    </div>
  );
};

export const BrandSelect = ({getter, setter, isReadOnly}) => {
  const [data, setData] = useState([]);
  
  const handleSelectChange = (event) => {
    setter(event.target.value);
  };

  const fetchData = async () => {
      const apiUrl =  domain + "/api/Brands/active";

      await axios.get(apiUrl , {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // You can include other headers if needed
      }})
      .then(response => {
          setData(response.data); // Set the response data to the state
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <Select disabled={isReadOnly} className="mt-1 input-custom-light dark:input-custom" value={getter} onChange={handleSelectChange}>
      <option value="" disabled hidden>Choose brand</option>
      {data.map((dt, index) => ( 
        <option key={index} value={dt.id}>{dt.description}</option>
      ))}
    </Select>
  )
}
export const CategorySelect = ({getter, setter, isReadOnly}) => {
  const [data, setData] = useState([]);
  
  const handleSelectChange = (event) => {
    setter(event.target.value);
  };

  const fetchData = async () => {
      const apiUrl =  domain + "/api/Categories/active";

      await axios.get(apiUrl , {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // You can include other headers if needed
      }})
      .then(response => {
          setData(response.data); // Set the response data to the state
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <Select disabled={isReadOnly} className="mt-1 input-custom-light dark:input-custom" value={getter} onChange={handleSelectChange}>
      <option value="" disabled hidden>Choose category</option>
      {data.map((dt, index) => ( 
        <option key={index} value={dt.id}>{dt.description}</option>
      ))}
    </Select>
  )
}
export const AccessTemplateSelect = ({getter, setter, isReadOnly}) => {
  const [data, setData] = useState([]);
  
  const handleSelectChange = (event) => {
    setter(event.target.value);
  };

  const fetchData = async () => {
      const apiUrl =  domain + "/api/AccessTemplates/";

      await axios.get(apiUrl , {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // You can include other headers if needed
      }})
      .then(response => {
          setData(response.data); // Set the response data to the state
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <Select disabled={isReadOnly} className="mt-1 input-custom-light dark:input-custom" value={getter} onChange={handleSelectChange}>
      <option value="" disabled hidden>Choose access template</option>
      {data.map((dt, index) => ( 
        <option key={index} value={dt.id}>{dt.description}</option>
      ))}
    </Select>
  )
}
export const BrandSelectWithAll = ({getter, setter, isReadOnly}) => {
  const [data, setData] = useState([]);
  
  const handleSelectChange = (event) => {
    setter(event.target.value);
  };

  const fetchData = async () => {
      const apiUrl =  domain + "/api/Brands/active";

      await axios.get(apiUrl , {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // You can include other headers if needed
      }})
      .then(response => {
          setData(response.data); // Set the response data to the state
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <Select disabled={isReadOnly} className="mt-1 input-custom-light dark:input-custom" value={getter} onChange={handleSelectChange}>
      <option value="" >All</option>
      {data.map((dt, index) => ( 
        <option key={index} value={dt.id}>{dt.description}</option>
      ))}
    </Select>
  )
}
export const CategorySelectWithAll = ({getter, setter, isReadOnly}) => {
  const [data, setData] = useState([]);
  
  const handleSelectChange = (event) => {
    setter(event.target.value);
  };

  const fetchData = async () => {
      const apiUrl =  domain + "/api/Categories/active";

      await axios.get(apiUrl , {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // You can include other headers if needed
      }})
      .then(response => {
          setData(response.data); // Set the response data to the state
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <Select disabled={isReadOnly} className="mt-1 input-custom-light dark:input-custom" value={getter} onChange={handleSelectChange}>
      <option value="">All</option>
      {data.map((dt, index) => ( 
        <option key={index} value={dt.id}>{dt.description}</option>
      ))}
    </Select>
  )
}
export const PositionSelect = ({getter, setter, isReadOnly}) => {
  const [data, setData] = useState([]);
  
  const handleSelectChange = (event) => {
    setter(event.target.value);
  };

  const fetchData = async () => {
      const apiUrl =  domain + "/api/Positions/active";

      await axios.get(apiUrl , {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // You can include other headers if needed
      }})
      .then(response => {
          setData(response.data); // Set the response data to the state
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <Select disabled={isReadOnly} className="mt-1 input-custom-light dark:input-custom" value={getter} onChange={handleSelectChange}>
      <option value="" disabled hidden>Choose position</option>
      {data.map((dt, index) => ( 
        <option key={index} value={dt.id}>{dt.description}</option>
      ))}
    </Select>
  )
}
export const DiscountSelect = ({getter, setter, isReadOnly}) => {
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountValue, setDiscountValue] = useState(0);
  const [otherDiscount, setOtherDiscount] = useState(null);
  
  const handleSelectChange = (event) => {
    setTemp(event.target.value);

    if (event.target.value === "Others") {
      setIsModalOpen(true); // Open the modal when "Others" is selected
    } else {
      const foundData = data.find(d => d.id.toString() === event.target.value.toString());
      setter(foundData);
    }
  };

  const fetchData = async () => {
      const apiUrl =  domain + "/api/Discounts/";

      await axios.get(apiUrl , {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // You can include other headers if needed
      }})
      .then(response => {
          setData(response.data); // Set the response data to the state
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
      fetchData();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = () => {
    // Set a new discount object based on the input value
    const newDiscount = {
      id: 'temp-id', // Generate or define an appropriate ID if needed
      description: 'Other Discount',
      discountValue: discountValue
    };
    setOtherDiscount(newDiscount);
    setter(newDiscount);
    setIsModalOpen(false); // Close the modal
    setTemp("temp-id")
  };

  return (
    <>
      <Select disabled={isReadOnly} className="mt-1 input-custom-light dark:input-custom" value={temp} onChange={handleSelectChange}>
        <option value="" disabled hidden>Choose discount</option>
        {data.map((dt, index) => ( 
          <option key={index} value={dt.id}>{`${dt.description} - ${dt.discountValue.toFixed(2)}%`}</option>
        ))}
        <option value={otherDiscount ? otherDiscount.id : "Others"}>{`${otherDiscount ? otherDiscount.description + " - " + parseFloat(otherDiscount.discountValue).toFixed(2)+"%" : "Other Discount"}`}</option>
      </Select>

      <Modal id="modal" isOpen={isModalOpen}>
        <ModalHeader>Custom Discount</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>Description</span>
            <Input className="mt-1 input-custom-light dark:input-custom" placeholder="Description" value={"Other Discount"} disabled />
          </Label>
          <Label className="my-5">
            <span>Discount Value</span>
            <Input type="number" className="mt-1" value={discountValue} onChange={(e)=>setDiscountValue(e.target.value)} />
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={handleModalClose}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleModalSave}>Proceed</Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
export const EmploymentStatusSelect = ({getter, setter, isReadOnly}) => {
  const [data, setData] = useState([]);
  
  const handleSelectChange = (event) => {
    setter(event.target.value);
  };

  const fetchData = async () => {
      const apiUrl =  domain + "/api/EmploymentStatuses/active";

      await axios.get(apiUrl , {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' // You can include other headers if needed
      }})
      .then(response => {
          setData(response.data); // Set the response data to the state
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
      fetchData();
  }, []);

  return (
    <Select disabled={isReadOnly} className="mt-1 input-custom-light dark:input-custom" value={getter} onChange={handleSelectChange}>
      <option value="" disabled hidden>Choose employment status</option>
      {data.map((dt, index) => ( 
        <option key={index} value={dt.id}>{dt.description}</option>
      ))}
    </Select>
  )
}
export function DateInput({ getter, setter, isReadOnly }) {
  const handleSelectChange = (event) => {
    setter(event.target.value);
  };

  let formattedDate = "";

  if(getter){
      formattedDate = getter.split('T')[0];
  }

  return (
    <div class="flex flex-col items-start">
      <Input type="date" className="mt-1 input-custom-light dark:input-custom" value={formattedDate} onChange={handleSelectChange} disabled={isReadOnly} />
    </div>
  );
}
export function Notification({ type, message, onClose }) {
  return (
    <div
      className={`fixed inset-0 flex items-start justify-center bg-black bg-opacity-50`}
      style={{zIndex: 100}}
      onClick={onClose}
    >
      <div
        className={`mt-5 w-full max-w-md px-4 py-2 rounded shadow-lg text-white transition-transform duration-300 ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        <span className="block text-center">{message}</span>
      </div>
    </div>
  );
}
export function formatNumberWithCommas(value) {
  if(!value){
    return '0.00';
  }

  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const GetCategories = async () => {
  const apiUrl =  domain + "/api/Categories";
  try {
      const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
      }})

      return response.data
  } catch (error) {
      console.error('Error fetching data:', error);
      return []
  }
};
export const GetCartByUserId = async (userId) => {
  const apiUrl =  domain + "/api/Cart";
  try {
      const response = await axios.get(`${apiUrl}/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
      }})

      return response.data
  } catch (error) {
      console.error('Error fetching data:', error);
      return []
  }
};
export const GetPendingCartInfoByUserId = async (userId) => {
  const apiUrl =  domain + "/api/CartInfo";
  try {
      const response = await axios.get(`${apiUrl}/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
      }})

      return response.data
  } catch (error) {
      console.error('Error fetching data:', error);
      return null
  }
};
export const GetOrderSummaryByCartInfoId = async (cartInfoId) => {
  const apiUrl =  domain + "/api/OrderSummary";
  try {
      const response = await axios.get(`${apiUrl}/cartInfoId/${cartInfoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
      }})

      return response.data
  } catch (error) {
      console.error('Error fetching data:', error);
      console.log("test")
      return null
  }
};
export const GetItemsByCustomer = async (customerId) => {
  if(!customerId){
    return
  }

  const apiUrl =  domain + "/api/PricePerCustomer";
  try {
      const response = await axios.get(`${apiUrl}/${customerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
      }})

      return response.data
  } catch (error) {
      console.error('Error fetching data:', error);
      return []
  }
};
export const GetItemsByCategory = async (categoryId) => {
  if(!categoryId){
    return
  }
  
  const apiUrl =  domain + "/api/PricePerCategory";
  try {
      const response = await axios.get(`${apiUrl}/${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
      }})

      return response.data
  } catch (error) {
      console.error('Error fetching data:', error);
      return []
  }
};
export const UserSelect = ({isOpen, onClose, selectedUser, setSelectedUser}) => {
  const [pageTable, setPageTable] = useState(1);
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([]);
  const [dataTablePerPage, setDataTablePerPage] = useState([]);
  const [dataTableTotal, setDataTableTotal] = useState([]);
  const [dataTableForSearch, setDataTableForSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValue] = useState(selectedUser);
  const [temporaryValue, setTemporaryValue] = useState(selectedUser);

  const apiUrl = domain + "/api/Users";
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setDataTableForSearch(response.data);
      setDataTableTotal(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if(dataTableTotal.length > 0){
      setOriginalDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
      setDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
    }
  }, [dataTableTotal, pageTable])

  const handleRowClick = (data) => {
    setTemporaryValue(data);
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = dataTableTotal.length;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p);

    console.log("Page: ", p, " time ", new Date())
  }

  //Search
  const handleFilter = (value) => {
    const lowercaseValue = value.toLowerCase();
    var res = dataTableForSearch.filter((f) =>
      f.fullName.toLowerCase().includes(lowercaseValue)
      );

      setDataTableTotal(res);
      setDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      setOriginalDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
  };

  // Sorting feature
  const [sortState, setSortState] = useState({
    id: null, // null means no sorting
    direction: null, // default sorting direction
  });

  const handleSort = (columnId) => {
    const newDirection =
      sortState.id === columnId && sortState.direction === 'asc'
        ? 'desc'
        : sortState.id === columnId && sortState.direction === 'desc'
        ? 'default'
        : 'asc';

    if (newDirection === 'default') {
      setSortState({
        id: null,
        direction: null,
      });
      setDataTablePerPage(originalDataTablePerPage);
      return;
    }

    setSortState({
      id: columnId,
      direction: newDirection,
    });

    const sortedData = [...dataTablePerPage].sort((a, b) => {
      const aValue = a[columnId];
      const bValue = b[columnId];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    setDataTablePerPage(sortedData);
  };
  const handleCloseModal = () => {
    onClose();
    setSelectedUser(initialValue);
  }
  const handleProceedModal = () => {
    onClose();
    setSelectedUser(temporaryValue);
  }

  // Render the table
  return (
    <>
      <Modal id="modal" isOpen={isOpen} data-modal="big">
        <ModalHeader>Select User Form</ModalHeader>
        {/* <!-- Search input --> */}
        <div className="flex flex-1 lg:mr-32 my-3">
            <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
              <div className="absolute inset-y-0 flex items-center pl-2">
                <SearchIcon className="w-4 h-4" aria-hidden="true" />
              </div>
              <Input
                className="pl-8 text-gray-700"
                placeholder="Search for user"
                aria-label="Search"
                onChange={(e) => handleFilter(e.target.value)}
              />
            </div>
        </div>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          {/* Table with loading state */}
          {loading ? (
            <div>Loading...</div> // Show a loading message or spinner
          ) : (
            <TableContainer className="mb-8">
              <div style={{ width: '100%' }}>
                <Table style={{ tableLayout: 'fixed' }}>
                  <TableHeader>
                    <tr>
                      <TableCell className="text-center" onClick={() => handleSort('userId')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        User Id
                        {sortState.id === 'userId' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center" onClick={() => handleSort('fullName')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Name
                        {sortState.id === 'fullName' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center" onClick={() => handleSort('position')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Position
                        {sortState.id === 'position' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                    </tr>
                  </TableHeader>
                </Table>
                <div style={{ overflow: 'auto', maxHeight: '300px' }}>
                  <Table style={{ tableLayout: 'fixed' }}>
                    <TableBody>
                      {dataTablePerPage.map((data, i) => (
                        <TableRow key={i} className={`${temporaryValue?.id === data.id ? "bg-purple-600 text-white" : ""} " hover:bg-purple-600 hover:text-white cursor-pointer "`}
                        onClick={() => handleRowClick(data)}
                        >
                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.id}</span>
                          </TableCell>

                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.userUserId}</span>
                          </TableCell>

                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.fullName}</span>
                          </TableCell>

                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.position}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <TableFooter>
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={onPageChangeTable}
                  label="Table navigation"
                />
              </TableFooter>
            </TableContainer>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={handleCloseModal}>Cancel</Button>
          </div>
          <div className="block">
            <Button onClick={handleProceedModal}>Proceed</Button>
          </div>
        </ModalFooter>
      </Modal>
      {/* Loading */}
      {loading && <LoadingScreen/> }
    </>
  );
};
export const ItemSelect = ({isOpen, onClose, selectedItem, setSelectedItem}) => {
  const [pageTable, setPageTable] = useState(1);
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([]);
  const [dataTablePerPage, setDataTablePerPage] = useState([]);
  const [dataTableTotal, setDataTableTotal] = useState([]);
  const [dataTableForSearch, setDataTableForSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValue] = useState(selectedItem);
  const [temporaryValue, setTemporaryValue] = useState(selectedItem);

  const apiUrl = domain + "/api/Items";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setDataTableForSearch(response.data);
      setDataTableTotal(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if(dataTableTotal.length > 0){
      setOriginalDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
      setDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
    }
  }, [dataTableTotal, pageTable])

  const handleRowClick = (data) => {
    setTemporaryValue(data);
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = dataTableTotal.length;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p);
  }

  //Search
  const handleFilter = (value) => {
    const lowercaseValue = value.toLowerCase();
    var res = dataTableForSearch.filter((f) =>
      f.productName.toLowerCase().includes(lowercaseValue)
      );

      setDataTableTotal(res);
      setDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      setOriginalDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
  };

  // Sorting feature
  const [sortState, setSortState] = useState({
    id: null, // null means no sorting
    direction: null, // default sorting direction
  });

  const handleSort = (columnId) => {
    const newDirection =
      sortState.id === columnId && sortState.direction === 'asc'
        ? 'desc'
        : sortState.id === columnId && sortState.direction === 'desc'
        ? 'default'
        : 'asc';

    if (newDirection === 'default') {
      setSortState({
        id: null,
        direction: null,
      });
      setDataTablePerPage(originalDataTablePerPage);
      return;
    }

    setSortState({
      id: columnId,
      direction: newDirection,
    });

    const sortedData = [...dataTablePerPage].sort((a, b) => {
      const aValue = a[columnId];
      const bValue = b[columnId];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    setDataTablePerPage(sortedData);
  };
  const handleCloseModal = () => {
    onClose();
    setSelectedItem(initialValue);
  }
  const handleProceedModal = () => {
    onClose();
    setSelectedItem(temporaryValue);
  }

  // Render the table
  return (
    <>
      <Modal id="modal" isOpen={isOpen} data-modal="big">
        <ModalHeader>Select Item Form</ModalHeader>
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
        </div>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          {/* Table with loading state */}
          {loading ? (
            <div>Loading...</div> // Show a loading message or spinner
          ) : (
            <TableContainer className="mb-8">
              <div style={{ width: '100%' }}>
                <Table style={{ tableLayout: 'fixed' }}>
                  <TableHeader>
                    <tr>
                      <TableCell className="text-center" onClick={() => handleSort('productName')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Product Name
                        {sortState.id === 'productName' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center" onClick={() => handleSort('price')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Normal Price
                        {sortState.id === 'price' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                    </tr>
                  </TableHeader>
                </Table>
                <div style={{ overflow: 'auto', maxHeight: '300px' }}>
                  <Table style={{ tableLayout: 'fixed' }}>
                    <TableBody>
                      {dataTablePerPage.map((data, i) => (
                        <TableRow key={i} className={`${temporaryValue?.id === data.id ? "bg-purple-600 text-white" : ""} " hover:bg-purple-600 hover:text-white cursor-pointer "`}
                        onClick={() => handleRowClick(data)}
                        >
                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.productName}</span>
                          </TableCell>

                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{`₱ ${formatNumberWithCommas(data.price)}`}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <TableFooter>
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={onPageChangeTable}
                  label="Table navigation"
                />
              </TableFooter>
            </TableContainer>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={handleCloseModal}>Cancel</Button>
          </div>
          <div className="block">
            <Button onClick={handleProceedModal}>Proceed</Button>
          </div>
        </ModalFooter>
      </Modal>
      {/* Loading */}
      {loading && <LoadingScreen/> }
    </>
  );
};
export const AddItemSelect = ({isOpen, onClose, openAddForm}) => {
  const [pageTable, setPageTable] = useState(1);
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([]);
  const [dataTablePerPage, setDataTablePerPage] = useState([]);
  const [dataTableTotal, setDataTableTotal] = useState([]);
  const [dataTableForSearch, setDataTableForSearch] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = domain + "/api/Items";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setDataTableForSearch(response.data);
      setDataTableTotal(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if(dataTableTotal.length > 0){
      setOriginalDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
      setDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
    }
  }, [dataTableTotal, pageTable])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = dataTableTotal.length;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p);
  }

  //Search
  const handleFilter = (value) => {
    const lowercaseValue = value.toLowerCase();
    var res = dataTableForSearch.filter((f) =>
      f.barcode.toLowerCase().startsWith(lowercaseValue)
    );

      setDataTableTotal(res);
      setDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      setOriginalDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
  };

  // Sorting feature
  const [sortState, setSortState] = useState({
    id: null, // null means no sorting
    direction: null, // default sorting direction
  });

  const handleSort = (columnId) => {
    const newDirection =
      sortState.id === columnId && sortState.direction === 'asc'
        ? 'desc'
        : sortState.id === columnId && sortState.direction === 'desc'
        ? 'default'
        : 'asc';

    if (newDirection === 'default') {
      setSortState({
        id: null,
        direction: null,
      });
      setDataTablePerPage(originalDataTablePerPage);
      return;
    }

    setSortState({
      id: columnId,
      direction: newDirection,
    });

    const sortedData = [...dataTablePerPage].sort((a, b) => {
      const aValue = a[columnId];
      const bValue = b[columnId];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    setDataTablePerPage(sortedData);
  };
  const handleCloseModal = () => {
    onClose();
  }

  // Render the table
  return (
    <>
      <Modal id="modal" isOpen={isOpen} data-modal="big">
        <ModalHeader>Select Item Form</ModalHeader>
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
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          {/* Table with loading state */}
          {loading ? (
            <div>Loading...</div> // Show a loading message or spinner
          ) : (
            <TableContainer className="mb-8">
              <div style={{ width: '100%' }}>
                <Table style={{ tableLayout: 'fixed' }}>
                  <TableHeader>
                    <tr>
                      <TableCell className="text-center" onClick={() => handleSort('productName')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Product Name
                        {sortState.id === 'productName' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center" onClick={() => handleSort('price')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Normal Price
                        {sortState.id === 'price' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        -
                      </TableCell>
                    </tr>
                  </TableHeader>
                </Table>
                <div style={{ overflow: 'auto', maxHeight: '300px' }}>
                  <Table style={{ tableLayout: 'fixed' }}>
                    <TableBody>
                      {dataTablePerPage.map((data, i) => (
                        <TableRow key={i} className="hover:bg-purple-600 hover:text-white cursor-pointer">
                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.productName}</span>
                          </TableCell>
                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{`₱ ${formatNumberWithCommas(data.price)}`}</span>
                          </TableCell>
                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <div className='custom-button px-1 py-2'>
                              <Button size="small" layout="outline" className="bg-green-custom" onClick={() => openAddForm(data)}>
                                <span aria-hidden="true">Add</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <TableFooter>
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={onPageChangeTable}
                  label="Table navigation"
                />
              </TableFooter>
            </TableContainer>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={handleCloseModal}>Cancel</Button>
          </div>
        </ModalFooter>
      </Modal>
      {/* Loading */}
      {loading && <LoadingScreen/> }
    </>
  );
};
export const CustomerSelect = ({isOpen, onClose, selectedCustomer, setSelectedCustomer, loggedUser}) => {
  const [pageTable, setPageTable] = useState(1);
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([]);
  const [dataTablePerPage, setDataTablePerPage] = useState([]);
  const [dataTableTotal, setDataTableTotal] = useState([]);
  const [dataTableForSearch, setDataTableForSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValue] = useState(selectedCustomer);
  const [temporaryValue, setTemporaryValue] = useState(selectedCustomer);

  const apiUrl = domain + "/api/Customers";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setDataTableForSearch(response.data);
      setDataTableTotal(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if(dataTableTotal.length > 0){
      setOriginalDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
      setDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
    }
  }, [dataTableTotal, pageTable])

  const handleRowClick = (data) => {
    setTemporaryValue(data);
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = dataTableTotal.length;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p);
  }

  //Search
  const handleFilter = (value) => {
    const lowercaseValue = value.toLowerCase();
    var res = dataTableForSearch.filter((f) =>
      f.customerName.toLowerCase().includes(lowercaseValue)
      );

      setDataTableTotal(res);
      setDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      setOriginalDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
  };

  // Sorting feature
  const [sortState, setSortState] = useState({
    id: null, // null means no sorting
    direction: null, // default sorting direction
  });

  const handleSort = (columnId) => {
    const newDirection =
      sortState.id === columnId && sortState.direction === 'asc'
        ? 'desc'
        : sortState.id === columnId && sortState.direction === 'desc'
        ? 'default'
        : 'asc';

    if (newDirection === 'default') {
      setSortState({
        id: null,
        direction: null,
      });
      setDataTablePerPage(originalDataTablePerPage);
      return;
    }

    setSortState({
      id: columnId,
      direction: newDirection,
    });

    const sortedData = [...dataTablePerPage].sort((a, b) => {
      const aValue = a[columnId];
      const bValue = b[columnId];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    setDataTablePerPage(sortedData);
  };
  const handleCloseModal = () => {
    onClose();
    setSelectedCustomer(initialValue)
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

  const handleUpdateCustomer = async () => {
    setLoading(true);

    const _cartInfo = await GetPendingCartInfoByUserId(loggedUser.id);

    const data = {
        userId: _cartInfo.userId,
        customerId: temporaryValue.id,
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
    }
  };
  
  const handleProceedModal = async () => {
    if(loggedUser){
      await handleUpdateCustomer();
    }

    onClose();
    setSelectedCustomer(temporaryValue);
  }

  // Render the table
  return (
    <>
      <Modal id="modal" isOpen={isOpen}>
        <ModalHeader>Select Customer Form</ModalHeader>
        {/* <!-- Search input --> */}
        <div className="flex flex-1 lg:mr-32 my-3">
            <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
              <div className="absolute inset-y-0 flex items-center pl-2">
                <SearchIcon className="w-4 h-4" aria-hidden="true" />
              </div>
              <Input
                className="pl-8 text-gray-700"
                placeholder="Search for customer"
                aria-label="Search"
                onChange={(e) => handleFilter(e.target.value)}
              />
            </div>
        </div>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          {/* Table with loading state */}
          {loading ? (
            <div>Loading...</div> // Show a loading message or spinner
          ) : (
            <TableContainer className="mb-8">
              <div style={{ width: '100%' }}>
                <Table style={{ tableLayout: 'fixed' }}>
                  <TableHeader>
                    <tr>
                      <TableCell className="text-center" onClick={() => handleSort('id')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Id
                        {sortState.id === 'id' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center" onClick={() => handleSort('customerId')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Customer Id
                        {sortState.id === 'customerId' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center" onClick={() => handleSort('customerName')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Customer Name
                        {sortState.id === 'customerName' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                    </tr>
                  </TableHeader>
                </Table>
                <div style={{ overflow: 'auto', maxHeight: '300px' }}>
                  <Table style={{ tableLayout: 'fixed' }}>
                    <TableBody>
                      {dataTablePerPage.map((data, i) => (
                        <TableRow key={i} className={`${temporaryValue?.id === data.id ? "bg-purple-600 text-white" : ""} " hover:bg-purple-600 hover:text-white cursor-pointer "`}
                        onClick={() => handleRowClick(data)}
                        >
                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.id}</span>
                          </TableCell>

                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.customerId}</span>
                          </TableCell>

                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.customerName}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <TableFooter>
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={onPageChangeTable}
                  label="Table navigation"
                />
              </TableFooter>
            </TableContainer>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={handleCloseModal}>Cancel</Button>
          </div>
          <div className="block">
            <Button onClick={handleProceedModal}>Proceed</Button>
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
  );
};
export const CategoriesSelect = ({isOpen, onClose, selectedCategory, setSelectedCategory, loggedUser}) => {
  const [pageTable, setPageTable] = useState(1);
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([]);
  const [dataTablePerPage, setDataTablePerPage] = useState([]);
  const [dataTableTotal, setDataTableTotal] = useState([]);
  const [dataTableForSearch, setDataTableForSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValue] = useState(selectedCategory);
  const [temporaryValue, setTemporaryValue] = useState(selectedCategory);

  const apiUrl = domain + "/api/Categories";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setDataTableForSearch(response.data);
      setDataTableTotal(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if(dataTableTotal.length > 0){
      setOriginalDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
      setDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
    }
  }, [dataTableTotal, pageTable])

  const handleRowClick = (data) => {
    setTemporaryValue(data);
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = dataTableTotal.length;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p);
  }

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

  // Sorting feature
  const [sortState, setSortState] = useState({
    id: null, // null means no sorting
    direction: null, // default sorting direction
  });

  const handleSort = (columnId) => {
    const newDirection =
      sortState.id === columnId && sortState.direction === 'asc'
        ? 'desc'
        : sortState.id === columnId && sortState.direction === 'desc'
        ? 'default'
        : 'asc';

    if (newDirection === 'default') {
      setSortState({
        id: null,
        direction: null,
      });
      setDataTablePerPage(originalDataTablePerPage);
      return;
    }

    setSortState({
      id: columnId,
      direction: newDirection,
    });

    const sortedData = [...dataTablePerPage].sort((a, b) => {
      const aValue = a[columnId];
      const bValue = b[columnId];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    setDataTablePerPage(sortedData);
  };
  const handleCloseModal = () => {
    onClose();
    setSelectedCategory(initialValue)
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

  const handleUpdateCustomer = async () => {
    setLoading(true);

    const _cartInfo = await GetPendingCartInfoByUserId(loggedUser.id);

    const data = {
        userId: _cartInfo.userId,
        customerId: _cartInfo.customerId,
        categoryId: temporaryValue.id,
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
    }
  };
  const handleProceedModal = async () => {
    if(loggedUser){
      await handleUpdateCustomer();
    }

    onClose();
    setSelectedCategory(temporaryValue);
  }

  // Render the table
  return (
    <>
      <Modal id="modal" isOpen={isOpen}>
        <ModalHeader>Select Category Form</ModalHeader>
        {/* <!-- Search input --> */}
        <div className="flex flex-1 lg:mr-32 my-3">
            <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
              <div className="absolute inset-y-0 flex items-center pl-2">
                <SearchIcon className="w-4 h-4" aria-hidden="true" />
              </div>
              <Input
                className="pl-8 text-gray-700"
                placeholder="Search for category"
                aria-label="Search"
                onChange={(e) => handleFilter(e.target.value)}
              />
            </div>
        </div>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          {/* Table with loading state */}
          {loading ? (
            <div>Loading...</div> // Show a loading message or spinner
          ) : (
            <TableContainer className="mb-8">
              <div style={{ width: '100%' }}>
                <Table style={{ tableLayout: 'fixed' }}>
                  <TableHeader>
                    <tr>
                      <TableCell className="text-center" onClick={() => handleSort('id')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Id
                        {sortState.id === 'id' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center" onClick={() => handleSort('description')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Description
                        {sortState.id === 'description' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                    </tr>
                  </TableHeader>
                </Table>
                <div style={{ overflow: 'auto', maxHeight: '300px' }}>
                  <Table style={{ tableLayout: 'fixed' }}>
                    <TableBody>
                      {dataTablePerPage.map((data, i) => (
                        <TableRow key={i} className={`${temporaryValue?.id === data.id ? "bg-purple-600 text-white" : ""} " hover:bg-purple-600 hover:text-white cursor-pointer "`}
                        onClick={() => handleRowClick(data)}
                        >
                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.id}</span>
                          </TableCell>

                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.description}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <TableFooter>
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={onPageChangeTable}
                  label="Table navigation"
                />
              </TableFooter>
            </TableContainer>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={handleCloseModal}>Cancel</Button>
          </div>
          <div className="block">
            <Button onClick={handleProceedModal}>Proceed</Button>
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
  );
};
export const ItemListSelect = ({isOpen, onClose, selectedItem, setSelectedItem}) => {
  const [pageTable, setPageTable] = useState(1);
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([]);
  const [dataTablePerPage, setDataTablePerPage] = useState([]);
  const [dataTableTotal, setDataTableTotal] = useState([]);
  const [dataTableForSearch, setDataTableForSearch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValue] = useState(selectedItem);
  const [temporaryValue, setTemporaryValue] = useState(selectedItem);

  const apiUrl = domain + "/api/ItemList";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setDataTableForSearch(response.data);
      setDataTableTotal(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if(dataTableTotal.length > 0){
      setOriginalDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
      setDataTablePerPage(dataTableTotal.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage));
    }
  }, [dataTableTotal, pageTable])

  const handleRowClick = (data) => {
    setTemporaryValue(data);
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = dataTableTotal.length;

  // pagination change control
  function onPageChangeTable(p) {
    setPageTable(p);
  }

  //Search
  const handleFilter = (value) => {
    const lowercaseValue = value.toLowerCase();
    var res = dataTableForSearch.filter((f) =>
      f.name.toLowerCase().includes(lowercaseValue)
      );

      setDataTableTotal(res);
      setDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      setOriginalDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
  };

  // Sorting feature
  const [sortState, setSortState] = useState({
    id: null, // null means no sorting
    direction: null, // default sorting direction
  });

  const handleSort = (columnId) => {
    const newDirection =
      sortState.id === columnId && sortState.direction === 'asc'
        ? 'desc'
        : sortState.id === columnId && sortState.direction === 'desc'
        ? 'default'
        : 'asc';

    if (newDirection === 'default') {
      setSortState({
        id: null,
        direction: null,
      });
      setDataTablePerPage(originalDataTablePerPage);
      return;
    }

    setSortState({
      id: columnId,
      direction: newDirection,
    });

    const sortedData = [...dataTablePerPage].sort((a, b) => {
      const aValue = a[columnId];
      const bValue = b[columnId];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return newDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return newDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    setDataTablePerPage(sortedData);
  };
  const handleCloseModal = () => {
    onClose();
    setSelectedItem(initialValue)
  }
  const handleProceedModal = () => {
    onClose();
    setSelectedItem(temporaryValue);
  }

  // Render the table
  return (
    <>
      <Modal id="modal" isOpen={isOpen}>
        <ModalHeader>Select Customer Form</ModalHeader>
        {/* <!-- Search input --> */}
        <div className="flex flex-1 lg:mr-32 my-3">
            <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
              <div className="absolute inset-y-0 flex items-center pl-2">
                <SearchIcon className="w-4 h-4" aria-hidden="true" />
              </div>
              <Input
                className="pl-8 text-gray-700"
                placeholder="Search for customer"
                aria-label="Search"
                onChange={(e) => handleFilter(e.target.value)}
              />
            </div>
        </div>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          {/* Table with loading state */}
          {loading ? (
            <div>Loading...</div> // Show a loading message or spinner
          ) : (
            <TableContainer className="mb-8">
              <div style={{ width: '100%' }}>
                <Table style={{ tableLayout: 'fixed' }}>
                  <TableHeader>
                    <tr>
                      <TableCell className="text-center" onClick={() => handleSort('id')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Id
                        {sortState.id === 'id' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center" onClick={() => handleSort('name')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Name
                        {sortState.id === 'name' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center" onClick={() => handleSort('stock')} style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        Stock
                        {sortState.id === 'stock' && (
                          <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                        )}
                      </TableCell>
                    </tr>
                  </TableHeader>
                </Table>
                <div style={{ overflow: 'auto', maxHeight: '300px' }}>
                  <Table style={{ tableLayout: 'fixed' }}>
                    <TableBody>
                      {dataTablePerPage.map((data, i) => (
                        <TableRow key={i} className={`${temporaryValue?.id === data.id ? "bg-purple-600 text-white" : ""} " hover:bg-purple-600 hover:text-white cursor-pointer "`}
                        onClick={() => handleRowClick(data)}
                        >
                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.id}</span>
                          </TableCell>

                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.name}</span>
                          </TableCell>

                          <TableCell className="text-center" style={{ maxWidth: '200px', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            <span className="text-sm">{data.stock}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <TableFooter>
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={onPageChangeTable}
                  label="Table navigation"
                />
              </TableFooter>
            </TableContainer>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={handleCloseModal}>Cancel</Button>
          </div>
          <div className="block">
            <Button onClick={handleProceedModal}>Proceed</Button>
          </div>
        </ModalFooter>
      </Modal>
      {/* Loading */}
      {loading && <LoadingScreen/> }
    </>
  );
};