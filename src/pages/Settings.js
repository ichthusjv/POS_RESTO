import React, { useState, useEffect } from 'react'
import { 
  LoadingScreen,
  Notification,
} from '../components/CustomCommon'
import { 
  Input, 
  Label,
  Button
} from '@windmill/react-ui'
import './../CustomCss.css';
import PageTitle from '../components/Typography/PageTitle'

function Settings() {
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('grid');
  
  // Notifications
  const [notification, setNotification] = useState(null);
  const showNotification = (type, message) => {
    setNotification({
      type,
      message: message,
    });
    setTimeout(() => setNotification(null), 3000); // Auto close after 3 seconds
  };

  useEffect(() => {
    const savedViewType = localStorage.getItem('viewType');
    if (savedViewType) {
      setViewType(savedViewType);
    }
  }, []);

  const saveHandleClick = async () => {
    setLoading(true);

    localStorage.setItem('viewType', viewType); // Save to localStorage
    showNotification('success', 'Settings changed.');
    setLoading(false);
  }

  return (
    <>
      <PageTitle>Settings</PageTitle>

      <div className="px-6 py-4 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">View Type</h2>
        <div className="flex items-center space-x-8">
          <Label className="flex items-center space-x-2">
            <Input
              className="mr-1 border-black input-custom-light dark:input-custom"
              type="radio"
              name="viewType"
              value="grid"
              checked={viewType === 'grid'}
              onChange={() => setViewType('grid')}
            />
            <span className="text-gray-700 dark:text-gray-300">Grid View (Supermarket Style)</span>
          </Label>
          <Label className="flex items-center space-x-2 ml-5">
            <Input
              className="mr-1 border-black input-custom-light dark:input-custom"
              type="radio"
              name="viewType"
              value="tile"
              checked={viewType === 'tile'}
              onChange={() => setViewType('tile')}
            />
            <span className="text-gray-700 dark:text-gray-300">Tile View (Restaurant Style)</span>
          </Label>
        </div>
      </div>

      <div>
        <Button className="mb-10" onClick={saveHandleClick}>Save</Button>
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

export default Settings
