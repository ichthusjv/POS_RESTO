import React, { useState, useEffect, useCallback, useRef } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import { 
  LoadingScreen,
  Notification,
  PositionSelect,
  EmploymentStatusSelect,
  DateInput
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
  Select,
  Textarea,
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
import dummy from '../assets/img/dummy.jpg';

function User() {
  const [pageTable, setPageTable] = useState(1)
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([])
  const [dataTablePerPage, setDataTablePerPage] = useState([])
  const [dataTableTotal, setDataTableTotal] = useState([])
  const [dataTableForSearch, setDataTableForSearch] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const [loading, setLoading] = useState(false)

  //parameters
  const [userUserId, setUserUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [extensionName, setExtensionName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [gender, setGender] = useState("");
  const [positionId, setPositionId] = useState("");
  const [age, setAge] = useState(0);
  const [birthday, setBirthday] = useState("");
  const [employmentStatusId, setEmploymentStatusId] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");

  const apiUrl =  domain + "/api/Users";
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
      f.fullName.toLowerCase().includes(lowercaseValue)
      );

      setDataTableTotal(res);
      setDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      setOriginalDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
  };

  // Add User
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const openAddUserForm = () => {
    setShowAddUserForm(true);
  }
  const closeAddUserForm = () => {
    setShowAddUserForm(false);
    resetParameters()
  }

  // Update User
  const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);
  const openUpdateUserForm = (data) => {
    setSelectedData(data);
    setShowUpdateUserForm(true);
  }
  const closeUpdateUserForm = () => {
    setShowUpdateUserForm(false);
    resetParameters();
  }

  //Delete User
  const [showDeleteUserForm, setShowDeleteUserForm] = useState(false);
  const openDeleteUserForm = (data) => {
    setSelectedData(data);
    setShowDeleteUserForm(true);
  }
  const closeDeleteUserForm = () => {
    setShowDeleteUserForm(false);
  }

  useEffect(() => {
    if(showUpdateUserForm){
      setUserUserId(selectedData.userUserId);
      setFirstName(selectedData.firstName);
      setMiddleName(selectedData.middleName);
      setLastName(selectedData.lastName);
      setExtensionName(selectedData.extensionName);
      setContactNo(selectedData.contactNo);
      setGender(selectedData.gender);
      setPositionId(selectedData.positionId);
      setAge(selectedData.age);
      setBirthday(selectedData.birthday);
      setEmploymentStatusId(selectedData.employmentStatusId);
      setAddress(selectedData.address);
      
      //image
      let filesToBeSet = [];
      if(selectedData.image){
          const binaryData = atob(selectedData.image);
  
          // Convert the binary data to a Uint8Array
          const arrayBuffer = new ArrayBuffer(binaryData.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < binaryData.length; i++) {
              uint8Array[i] = binaryData.charCodeAt(i);
          }
  
          const blob = new Blob([uint8Array], { type: 'image/jpeg' }); // Adjust the MIME type as per your data
  
          const file = new File([blob], 'filename.jpg', { type: 'image/jpeg' }); // Provide a filename and MIME type
  
          filesToBeSet.push(file);
      }
      setImage(filesToBeSet);
    }
  }, [showUpdateUserForm, selectedData])

  const handleAddUser = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!userUserId
      || !firstName
      || !lastName
      || !positionId
      || !employmentStatusId
    ){
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    let base64String = "";
    let imageToBeSave = "";

    if (image && image.length > 0) {
        base64String = await toBase64(image[0]);
        imageToBeSave = base64String.split(',')[1];
    }

    const data = {
        userUserId: userUserId,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        extensionName: extensionName,
        fullName: `${lastName}, ${firstName}`,
        contactNo: contactNo,
        gender: gender,
        positionId: positionId,
        age: age ? age : 0,
        birthday: birthday ? birthday : null,
        employmentStatusId: employmentStatusId,
        address: address,
        image: image ? imageToBeSave : null,
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
        closeAddUserForm();
    }
  };
  const handleUpdateUser = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!userUserId
      || !firstName
      || !lastName
      || !positionId
      || !employmentStatusId
    ){
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    let base64String = "";
    let imageToBeSave = "";

    if (image && image.length > 0) {
        base64String = await toBase64(image[0]);
        imageToBeSave = base64String.split(',')[1];
    }

    const data = {
        userUserId: userUserId,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        extensionName: extensionName,
        fullName: `${lastName}, ${firstName}`,
        contactNo: contactNo,
        gender: gender,
        positionId: positionId,
        age: age ? age : 0,
        birthday: birthday ? birthday : null,
        employmentStatusId: employmentStatusId,
        address: address,
        image: image ? imageToBeSave : null,
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
        closeUpdateUserForm();
    }
  };
  const handleDeleteUser = async () => {
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
        closeDeleteUserForm();
    }
  };
  const resetParameters = () => {
    setUserUserId("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setExtensionName("");
    setContactNo("");
    setGender("");
    setPositionId("");
    setAge("");
    setBirthday("");
    setEmploymentStatusId("");
    setAddress("");
    setImage("");
  };

  //image selection
  const fileInputRef = useRef(null); // Reference to the file input
  const handleImageChange = (event) => {
    const files = event.target.files; // Get the selected files
    if (files && files[0]) {
        setImage(files); // Store the FileList
    }
  };

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
      <PageTitle>Users</PageTitle>
      {/* <!-- Search input --> */}
      <div className="flex flex-1 lg:mr-32 my-3">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search for name"
              aria-label="Search"
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
          <div>
            <Button onClick={openAddUserForm}>Add User</Button>
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
              <TableCell className="text-center" onClick={() => handleSort('userUserId')}>
                User Id
                {sortState.id === 'userUserId' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('fullName')}>
                Name
                {sortState.id === 'fullName' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('position')}>
                Position
                {sortState.id === 'position' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('employmentStatus')}>
                Employment Status
                {sortState.id === 'employmentStatus' && (
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
                  <span className="text-sm">{data.userUserId}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.fullName}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.position}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.employmentStatus}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit" onClick={()=>openUpdateUserForm(data)}>
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete" onClick={()=>openDeleteUserForm(data)} className="hidden">
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

      {/* Add User Form */}
      <Modal className="custom-modal w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-6xl" id="modal" isOpen={showAddUserForm}>
        <ModalHeader>Add User Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <div>
            <Label className="my-5">
              <span>User Photo</span>
              <img
                src={image && image[0] instanceof File ? URL.createObjectURL(image[0]) : dummy}
                alt="Upload"
                className="w-36 max-h-2xl object-contain shadow-lg clickable-img mt-3"
              />
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Label>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            <Label className="my-5">
              <span>User Id</span>
              <Input className="mt-1" placeholder="User Id" value={userUserId} onChange={(e)=>setUserUserId(e.target.value)} />
              {!userUserId && <span className='text-xs text-red-500'>required</span>}
            </Label>

            <Label className="my-5">
              <span>Last Name</span>
              <Input className="mt-1" placeholder="Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
              {!lastName && <span className='text-xs text-red-500'>required</span>}
            </Label>

            <Label className="my-5">
              <span>First Name</span>
              <Input className="mt-1" placeholder="First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
              {!firstName && <span className='text-xs text-red-500'>required</span>}
            </Label>

            <Label className="my-5">
              <span>Middle Name</span>
              <Input className="mt-1" placeholder="Middle Name" value={middleName} onChange={(e)=>setMiddleName(e.target.value)} />
            </Label>

            <Label className="my-5">
              <span>Extension Name</span>
              <Input className="mt-1" placeholder="Extension Name" value={extensionName} onChange={(e)=>setExtensionName(e.target.value)} />
            </Label>

            <Label className="my-5">
              <span>Position</span>
              <PositionSelect getter={positionId} setter={setPositionId}/>
              {!positionId && <span className='text-xs text-red-500'>required</span>}
            </Label>

            <Label className="my-5">
              <span>Employment Status</span>
              <EmploymentStatusSelect getter={employmentStatusId} setter={setEmploymentStatusId}/>
              {!employmentStatusId && <span className='text-xs text-red-500'>required</span>}
            </Label>

            <Label className="my-5">
              <span>Contact No.</span>
              <Input className="mt-1" placeholder="Contact No." value={contactNo} onChange={(e)=>setContactNo(e.target.value)} />
            </Label>

            <Label className="my-5">
              <span>Gender</span>
              <Select className="mt-1" value={gender} onChange={(e)=>setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </Label>

            <Label className="my-5">
              <span>Age</span>
              <Input type="number" className="mt-1" placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)} />
            </Label>

            <Label className="my-5">
              <span>Date of Birth</span>
              <DateInput getter={birthday} setter={setBirthday}/>
            </Label>

            <Label className="my-5">
              <span>Address</span>
              <Textarea className="mt-1" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} />
            </Label>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeAddUserForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleAddUser}>Add User</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Update User Form */}
      <Modal className="custom-modal w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-6xl" id="modal" isOpen={showUpdateUserForm}>
        <ModalHeader>Add User Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <div>
            <Label className="my-5">
              <span>User Photo</span>
              <img
                src={image && image[0] instanceof File ? URL.createObjectURL(image[0]) : dummy}
                alt="Upload"
                className="w-32 max-h-2xl object-contain shadow-lg clickable-img mt-3"
              />
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Label>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            <Label className="my-5">
              <span>User Id</span>
              <Input className="mt-1 input-custom-light dark:input-custom" disabled placeholder="User Id" value={userUserId} onChange={(e)=>setUserUserId(e.target.value)} />
              {!userUserId && <span className='text-xs text-red-500'>required</span>}
            </Label>

            <Label className="my-5">
              <span>Last Name</span>
              <Input className="mt-1" placeholder="Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
              {!lastName && <span className='text-xs text-red-500'>required</span>}
            </Label>

            <Label className="my-5">
              <span>First Name</span>
              <Input className="mt-1" placeholder="First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
              {!firstName && <span className='text-xs text-red-500'>required</span>}
            </Label>

            <Label className="my-5">
              <span>Middle Name</span>
              <Input className="mt-1" placeholder="Middle Name" value={middleName} onChange={(e)=>setMiddleName(e.target.value)} />
            </Label>

            <Label className="my-5">
              <span>Extension Name</span>
              <Input className="mt-1" placeholder="Extension Name" value={extensionName} onChange={(e)=>setExtensionName(e.target.value)} />
            </Label>

            <Label className="my-5">
              <span>Position</span>
              <PositionSelect getter={positionId} setter={setPositionId}/>
              {!positionId && <span className='text-xs text-red-500'>required</span>}
            </Label>

            <Label className="my-5">
              <span>Employment Status</span>
              <EmploymentStatusSelect getter={employmentStatusId} setter={setEmploymentStatusId}/>
              {!employmentStatusId && <span className='text-xs text-red-500'>required</span>}
            </Label>

            <Label className="my-5">
              <span>Contact No.</span>
              <Input className="mt-1" placeholder="Contact No." value={contactNo} onChange={(e)=>setContactNo(e.target.value)} />
            </Label>

            <Label className="my-5">
              <span>Gender</span>
              <Select className="mt-1" value={gender} onChange={(e)=>setGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </Label>

            <Label className="my-5">
              <span>Age</span>
              <Input type="number" className="mt-1" placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)} />
            </Label>

            <Label className="my-5">
              <span>Date of Birth</span>
              <DateInput getter={birthday} setter={setBirthday}/>
            </Label>

            <Label className="my-5">
              <span>Address</span>
              <Textarea className="mt-1" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} />
            </Label>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeUpdateUserForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleUpdateUser}>Update User</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Delete User Form */}
      <Modal id="modal" isOpen={showDeleteUserForm}>
        <ModalHeader>Delete User Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
            <span>{`Are you sure you want to delete ${selectedData.fullName} ?`}</span>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeDeleteUserForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleDeleteUser}>Delete User</Button>
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

export default User
