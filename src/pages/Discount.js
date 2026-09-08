import React, { useState, useCallback, useEffect } from 'react'
import { 
  LoadingScreen,
  Notification,
} from '../components/CustomCommon'
import './../CustomCss.css';
import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import { 
  Input, 
  Label, 
  Button,
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
} from '@windmill/react-ui'
import axios from 'axios'
import { domain, token } from '../App'

function Discount() {
  const [discount, setDiscount] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [description, setDescription] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [loading, setLoading] = useState(false)
  
  // Notifications
  const [notification, setNotification] = useState(null);
  const showNotification = (type, message) => {
    setNotification({
      type,
      message: message,
    });
    setTimeout(() => setNotification(null), 3000); // Auto close after 3 seconds
  };

  const apiUrl =  domain + "/api/Discounts";
  const fetchData = useCallback(async () => {
      try {
          setLoading(true);
          const response = await axios.get(apiUrl, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
          }})

          setDiscount(response.data);
      } catch (error) {
          setLoading(false);
          console.error('Error fetching data:', error);
      } finally {
          setLoading(false);
      }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Add Discount
  const [showAddDiscountForm, setShowAddDiscountForm] = useState(false);
  const openAddDiscountForm = () => {
    setShowAddDiscountForm(true);
  }
  const closeAddDiscountForm = () => {
    setShowAddDiscountForm(false);
  }

  const generateDiscount = (data) => {
    return (
      <div>
        <Label>
          <span>{data.description}</span>
          <Input className="mt-1 input-custom-light dark:input-custom" type="number" value={data.discountValue} disabled/>
          <span>value is on %</span>
        </Label>
        <div className="mb-2 rounded-lg custom-button">
          <Button size="small" className="mr-2 my-2 bg-green-custom" onClick={() => openUpdateDiscountForm(data)}>
            <span aria-hidden="true">
              Update
            </span>
          </Button>
          <Button size="small" className="my-2 bg-red-custom" onClick={() => openDeleteDiscountForm(data)}>
            <span aria-hidden="true">
              Delete
            </span>
          </Button>
        </div>
      </div>
    )
  }

  // Update Discount
  const [showUpdateDiscountForm, setShowUpdateDiscountForm] = useState(false);
  const openUpdateDiscountForm = (data) => {
    setSelectedData(data);
    setShowUpdateDiscountForm(true);
  }
  const closeUpdateDiscountForm = () => {
    setShowUpdateDiscountForm(false);
  }

  useEffect(() => {
    if(showUpdateDiscountForm){
      setDescription(selectedData.description);
      setDiscountValue(selectedData.discountValue);
    }
  }, [showUpdateDiscountForm, selectedData])

  //Delete Discount
  const [showDeleteDiscountForm, setShowDeleteDiscountForm] = useState(false);
  const openDeleteDiscountForm = (data) => {
    setSelectedData(data);
    setShowDeleteDiscountForm(true);
  }
  const closeDeleteDiscountForm = () => {
    setShowDeleteDiscountForm(false);
  }

  const resetParameters = () => {
    setDescription("");
    setDiscountValue("");
  }

  const handleAddDiscount = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      description: description,
      discountValue: discountValue,
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
        closeAddDiscountForm();
        resetParameters();
    }
  };
  const handleUpdateDiscount = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!description) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    const data = {
        description: description,
        discountValue: discountValue,
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
        closeUpdateDiscountForm();
    }
  };
  const handleDeleteDiscount = async () => {
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
        closeDeleteDiscountForm();
    }
  };

  return (
    <>
      <PageTitle>Discounts</PageTitle>
      
      <div>
        <Button className="mb-10" onClick={openAddDiscountForm}>Add Discount</Button>
      </div>

      <SectionTitle>Priviledged Sectors</SectionTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 grid gap-6 xl:grid-cols-2">
        { discount.map((data, i) => (
          generateDiscount(data)
        ))}
        {/* <Label>
          <span>Person With Disabilities (PWD)</span>
          <Input className="mt-1" type="number" value={pwd} onChange={(e)=>setPWD(e.target.value)}/>
          <span>value is on %</span>
        </Label>

        <Label>
          <span>Senior Citizens</span>
          <Input className="mt-1" type="number" value={seniorCitizen} onChange={(e)=>setSeniorCitizen(e.target.value)}/>
          <span>value is on %</span>
        </Label>

        <Label>
          <span>National Athletes and Coaches</span>
          <Input className="mt-1" type="number" value={nationalAthletes} onChange={(e)=>setNationalAthletes(e.target.value)}/>
          <span>value is on %</span>
        </Label>

        <Label>
          <span>Solo Parents</span>
          <Input className="mt-1" type="number" value={soloParent} onChange={(e)=>setSoloParent(e.target.value)}/>
          <span>value is on %</span>
        </Label> */}
      </div>

      {/* Add Discount Form */}
      <Modal id="modal" isOpen={showAddDiscountForm}>
        <ModalHeader>Add Discount Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>Description</span>
            <Input className="mt-1" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            {!description && <span className='text-xs text-red-500'>required</span>}
          </Label>
          <Label className="my-5">
            <span>Discount Value</span>
            <Input type="number" className="mt-1" value={discountValue} onChange={(e)=>setDiscountValue(e.target.value)} />
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeAddDiscountForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleAddDiscount}>Add Discount</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Update Discount Form */}
      <Modal id="modal" isOpen={showUpdateDiscountForm}>
        <ModalHeader>Add Discount Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <Label className="my-5">
            <span>Description</span>
            <Input className="mt-1" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
            {!description && <span className='text-xs text-red-500'>required</span>}
          </Label>
          <Label className="my-5">
            <span>Discount Value</span>
            <Input type="number" className="mt-1" value={discountValue} onChange={(e)=>setDiscountValue(e.target.value)} />
          </Label>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeUpdateDiscountForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleUpdateDiscount}>Update Discount</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Delete Discount Form */}
      <Modal id="modal" isOpen={showDeleteDiscountForm}>
        <ModalHeader>Delete Discount Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
            <span>{`Are you sure you want to delete ${selectedData && selectedData.description ? selectedData.description : ""} ?`}</span>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeDeleteDiscountForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleDeleteDiscount}>Delete Discount</Button>
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

export default Discount
