import React, { useEffect, useState, useCallback } from 'react'
import { 
  LoadingScreen,
  PositionSelect,
  EmploymentStatusSelect,
  DateInput
} from '../components/CustomCommon'
import PageTitle from '../components/Typography/PageTitle'
import { Input, Label, Select, Textarea } from '@windmill/react-ui'
import dummy from '../assets/img/dummy.jpg';
import axios from 'axios'
import { domain, token } from '../App'

function Profile({loggedUser}) {
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

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");

  const apiUrl =  domain + "/api/Users";

  const fetchData = useCallback(async () => {
      try {
          setLoading(true);
          const response = await axios.get(`${apiUrl}/${loggedUser.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
          }})

          setUser(response.data);
      } catch (error) {
          setLoading(false);
          console.error('Error fetching data:', error);
      } finally {
          setLoading(false);
      }
  }, [apiUrl, loggedUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData])

  useEffect(() => {
    if(user){
      setUserUserId(user.userUserId);
      setFirstName(user.firstName);
      setMiddleName(user.middleName);
      setLastName(user.lastName);
      setExtensionName(user.extensionName);
      setContactNo(user.contactNo);
      setGender(user.gender);
      setPositionId(user.positionId);
      setAge(user.age);
      setBirthday(user.birthday);
      setEmploymentStatusId(user.employmentStatusId);
      setAddress(user.address);
      
      //image
      let filesToBeSet = [];
      if(user.image){
          const binaryData = atob(user.image);
  
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
  }, [user])

  return (
    <>
      <PageTitle>Profile</PageTitle>

      <Label className="my-2">
        <span>User Photo</span>
        <img
          src={image && image[0] instanceof File ? URL.createObjectURL(image[0]) : dummy}
          alt="Upload"
          className="w-32 max-h-2xl object-contain shadow-lg clickable-img mt-3"
        />
      </Label>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Label className="my-5">
          <span>User Id</span>
          <Input className="mt-1 input-custom-light dark:input-custom" placeholder="User Id" value={userUserId} disabled/>
        </Label>

        <Label className="my-5">
          <span>Last Name</span>
          <Input className="mt-1 input-custom-light dark:input-custom" placeholder="Last Name" value={lastName} disabled/>
        </Label>

        <Label className="my-5">
          <span>First Name</span>
          <Input className="mt-1 input-custom-light dark:input-custom" placeholder="First Name" value={firstName} disabled/>
        </Label>

        <Label className="my-5">
          <span>Middle Name</span>
          <Input className="mt-1 input-custom-light dark:input-custom" placeholder="Middle Name" value={middleName} disabled/>
        </Label>

        <Label className="my-5">
          <span>Extension Name</span>
          <Input className="mt-1 input-custom-light dark:input-custom" placeholder="Extension Name" value={extensionName} disabled/>
        </Label>

        <Label className="my-5">
          <span>Position</span>
          <PositionSelect getter={positionId} setter={setPositionId} isReadOnly={true}/>
        </Label>

        <Label className="my-5">
          <span>Employment Status</span>
          <EmploymentStatusSelect getter={employmentStatusId} setter={setEmploymentStatusId} isReadOnly={true}/>
        </Label>

        <Label className="my-5">
          <span>Contact No.</span>
          <Input className="mt-1 input-custom-light dark:input-custom" placeholder="Contact No." value={contactNo} disabled/>
        </Label>

        <Label className="my-5">
          <span>Gender</span>
          <Select className="mt-1 input-custom-light dark:input-custom" value={gender} disabled>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
        </Label>

        <Label className="my-5">
          <span>Age</span>
          <Input type="number" className="mt-1 input-custom-light dark:input-custom" placeholder="Age" value={age} onChange={(e)=>setAge(e.target.value)} disabled/>
        </Label>

        <Label className="my-5">
          <span>Date of Birth</span>
          <DateInput getter={birthday} setter={setBirthday} isReadOnly={true}/>
        </Label>

        <Label className="my-5">
          <span>Address</span>
          <Textarea className="mt-1 input-custom-light dark:input-custom" placeholder="Address" value={address} onChange={(e)=>setAddress(e.target.value)} disabled />
        </Label>
      </div>

      
      {/* Loading */}
      {loading && <LoadingScreen/> }
    </>
  )
}

export default Profile
