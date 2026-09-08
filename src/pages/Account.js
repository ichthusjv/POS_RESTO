import React, { useState, useEffect, useCallback } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import { 
  LoadingScreen,
  Notification,
  UserSelect,
  AccessTemplateSelect
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
import { SearchIcon, EditIcon, TrashIcon, ChangePassword } from '../icons'

function Account() {
  const [pageTable, setPageTable] = useState(1)
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([])
  const [dataTablePerPage, setDataTablePerPage] = useState([])
  const [dataTableTotal, setDataTableTotal] = useState([])
  const [dataTableForSearch, setDataTableForSearch] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const apiUrl =  domain + "/api/Accounts";
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
      f.userFullName.toLowerCase().includes(lowercaseValue)
      );

      setDataTableTotal(res);
      setDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      setOriginalDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
  };

  // Add Account
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);
  const openAddAccountForm = () => {
    setShowAddAccountForm(true);
  }
  const closeAddAccountForm = () => {
    setShowAddAccountForm(false);
    resetParameters()
    setSelectedUser([])
  }

  // Update Account
  const [showUpdateAccountForm, setShowUpdateAccountForm] = useState(false);
  const openUpdateAccountForm = (data) => {
    setSelectedData(data);
    setShowUpdateAccountForm(true);
  }
  const closeUpdateAccountForm = () => {
    setShowUpdateAccountForm(false);
    resetParameters();
  }

  //Delete Account
  const [showDeleteAccountForm, setShowDeleteAccountForm] = useState(false);
  const openDeleteAccountForm = (data) => {
    setSelectedData(data);
    setShowDeleteAccountForm(true);
  }
  const closeDeleteAccountForm = () => {
    setShowDeleteAccountForm(false);
    resetParameters();
  }

  //Change Password
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const openChangePasswordForm = (data) => {
    setSelectedData(data);
    setShowChangePasswordForm(true);
  }
  const closeChangePasswordForm = () => {
    setShowChangePasswordForm(false);
    resetParameters();
  }

  useEffect(() => {
    if(showUpdateAccountForm){
      setUserId(selectedData.userId);
      setUserFullName(selectedData.userFullName)
      setAccessTemplateId(selectedData.accessTemplateId);
    }
  }, [showUpdateAccountForm, selectedData])

  useEffect(() => {
    if(showChangePasswordForm){
      setUserId(selectedData.userId);
      setUserFullName(selectedData.userFullName)
      setUsername(selectedData.username)
      setAccessTemplateId(selectedData.accessTemplateId);
    }
  }, [showChangePasswordForm, selectedData])

  const [userId, setUserId] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessTemplateId, setAccessTemplateId] = useState("");

  const handleAddAccount = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!userId
      || !username
      || !password
      || !confirmPassword
      || !accessTemplateId
    ) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    if(password !== confirmPassword){
      showNotification("fail", "Password and Confirmation Password do not match.")
      setLoading(false);
      return;
    }

    const data = {
      userId: userId,
      username: username,
      password: password,
      accessTemplateId: parseInt(accessTemplateId),
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
        closeAddAccountForm();
    }
  };
  const handleUpdateAccount = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!userId
      || !accessTemplateId
    ) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    const data = {
      userId: userId,
      accessTemplateId: parseInt(accessTemplateId),
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
        closeUpdateAccountForm();
    }
  };
  const handleChangePassword = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!oldPassword
      || !password
      || !confirmPassword
    ) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    if(password !== confirmPassword){
      showNotification("fail", "Password and Confirmation Password do not match.")
      setLoading(false);
      return;
    }

    const data = {
      oldPassword: oldPassword,
      newPassword: password,
    };

    try {
        await axios.put(`${apiUrl}/${selectedData.id}/change-password`, data, {
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
        closeChangePasswordForm();
    }
  };
  const handleDeleteAccount = async () => {
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
        closeDeleteAccountForm();
    }
  };
  const resetParameters = () => {
    setUserId("");
    setUserFullName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setAccessTemplateId("");
    setOldPassword("");
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

  const [showUserSelect, setShowUserSelect] = useState(false);
  const openUserSelect = () =>{
    setShowUserSelect(true);
  }
  const closeUserSelect = () =>{
    setShowUserSelect(false);
  }

  useEffect(() => {
    if(selectedUser){
      setUserId(selectedUser.id);
      setUserFullName(selectedUser.fullName);
    } else {
      setUserId("");
      setUserFullName("");
    }
  }, [selectedUser])

  return (
    <>
      <PageTitle>Accounts</PageTitle>
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
          <div>
            <Button onClick={openAddAccountForm}>Add Account</Button>
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
              <TableCell className="text-center" onClick={() => handleSort('username')}>
                Username
                {sortState.id === 'username' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('userFullName')}>
                User
                {sortState.id === 'userFullName' && (
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
                  <span className="text-sm">{data.username}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.userFullName}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit" onClick={()=>openUpdateAccountForm(data)}>
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Change Password" onClick={()=>openChangePasswordForm(data)}>
                      <ChangePassword className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete" onClick={()=>openDeleteAccountForm(data)} className="hidden">
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

      {/* Add Account Form */}
      <Modal id="modal" isOpen={showAddAccountForm} >
        <ModalHeader>Add Account Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>User</span>
            <div className="flex flex-1">
              <Input className="mt-1 mr-2" placeholder="- Select user -" value={userFullName}/>
              <div className="mt-1">
                <Button onClick={openUserSelect}>Select</Button>
              </div>
          </div>
          {!userId && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Username</span>
            <Input className="mt-1" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
            {!username && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Password</span>
            <Input type="password" className="mt-1" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            {!password && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Confirm Password</span>
            <Input type="password" className="mt-1" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
            {!confirmPassword && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Access Template</span>
            <AccessTemplateSelect getter={accessTemplateId} setter={setAccessTemplateId}/>
            {!accessTemplateId && <span className='text-xs text-red-500'>required</span>}
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeAddAccountForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleAddAccount}>Add Account</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Update Account Form */}
      <Modal id="modal" isOpen={showUpdateAccountForm}>
        <ModalHeader>Update Account Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>User</span>
            <div className="flex flex-1">
              <Input className="mt-1 mr-2" placeholder="- Select user -" value={userFullName}/>
              <div className="mt-1">
                <Button onClick={openUserSelect}>Select</Button>
              </div>
          </div>
          {!userId && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Access Template</span>
            <AccessTemplateSelect getter={accessTemplateId} setter={setAccessTemplateId}/>
            {!accessTemplateId && <span className='text-xs text-red-500'>required</span>}
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeUpdateAccountForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleUpdateAccount}>Update Account</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Change Password Form */}
      <Modal id="modal" isOpen={showChangePasswordForm}>
        <ModalHeader>Change Password Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>Username</span>
            <Input className="mt-1" placeholder="Username" value={username} />
            {!username && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Old Password</span>
            <Input type="password" className="mt-1" placeholder="Password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} />
            {!oldPassword && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>New Password</span>
            <Input type="password" className="mt-1" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            {!password && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Confirm Password</span>
            <Input type="password" className="mt-1" placeholder="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
            {!confirmPassword && <span className='text-xs text-red-500'>required</span>}
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeChangePasswordForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleChangePassword}>Change Password</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Delete Account Form */}
      <Modal id="modal" isOpen={showDeleteAccountForm}>
        <ModalHeader>Delete Account Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
            <span>{`Are you sure you want to delete ${selectedData.description} ?`}</span>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeDeleteAccountForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </ModalFooter>
      </Modal>

      
      {showUserSelect && <UserSelect isOpen={showUserSelect} onClose={closeUserSelect} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />}

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

export default Account
