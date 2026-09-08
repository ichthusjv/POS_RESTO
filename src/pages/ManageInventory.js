import React, { useState, useEffect, useCallback, useRef } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import { 
  FullSizeImage, 
  LoadingScreen,
  Notification,
  BrandSelect,
  CategorySelect,
  ItemListSelect,
  GetCategories,
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
  Label,
  Textarea
} from '@windmill/react-ui'
import axios from 'axios'
import { domain, token } from '../App'
import './../CustomCss.css';
import { 
  EditIcon, 
  SearchIcon, 
  TrashIcon
} from '../icons'
import dummy from '../assets/img/dummg-item.png';

function ManageInventory() {
  const [pageTable, setPageTable] = useState(1)
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([])
  const [dataTablePerPage, setDataTablePerPage] = useState([])
  const [dataTableTotal, setDataTableTotal] = useState([])
  const [dataTableForSearch, setDataTableForSearch] = useState([])
  const [selectedData, setSelectedData] = useState([])
  const [loading, setLoading] = useState(false)

  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(0)

  const apiUrl =  domain + "/api/Items";
  const fetchData = useCallback(async () => {
    try {
        setLoading(true);
        const response = await axios.get(apiUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }})

        const _categories = await GetCategories();
        setCategories(_categories);

        let finalData = response.data;

        if(activeCategory !== 0){
          finalData = finalData.filter(data => data.categoryId === activeCategory);
        }

        setDataTableForSearch(finalData);
        setDataTableTotal(finalData);
        setDataTablePerPage(finalData.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
        setOriginalDataTablePerPage(finalData.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
    } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  }, [apiUrl, pageTable, activeCategory]);

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

  //View Image
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [imageSource, setImageSource] = useState(false);
  const openImageViewer = (source) => {
    setIsImageViewerVisible(true);
    setImageSource(source);
  };
  const closeImageViewer = () => {
    setIsImageViewerVisible(false);
  };

  //Filter
  const handleFilter = (value) => {
    const lowercaseValue = value.toLowerCase();
    var res = dataTableForSearch.filter((f) =>
      f.barcode.toLowerCase().startsWith(lowercaseValue)
    );

      setDataTableTotal(res);
      setDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      setOriginalDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
  };

  // Add Item
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const openAddItemForm = () => {
    setShowAddItemForm(true);
  }
  const closeAddItemForm = () => {
    setShowAddItemForm(false);
    unTriggerSelectItemMode()
    resetParameters()
  }

  // Update Item
  const [showUpdateItemForm, setShowUpdateItemForm] = useState(false);
  const openUpdateItemForm = (data) => {
    setSelectedData(data);
    setShowUpdateItemForm(true);
  }
  const closeUpdateItemForm = () => {
    setShowUpdateItemForm(false);
    unTriggerSelectItemMode();
    resetParameters();
  }
  useEffect(() => {
    if(showUpdateItemForm){
      setItemCode(selectedData.itemCode);
      setBarcode(selectedData.barcode);
      setProductName(selectedData.productName);
      setDescription(selectedData.description);
      setItemId(selectedData.brandId);
      setCategoryId(selectedData.categoryId);

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

      setPrice(selectedData.price);

      const finalItemList = [];

      for(const item of selectedData.itemLists){

        const newData = {
          name: item.name,
          itemId: selectedData.id,
          itemListId: item.id
        }

        finalItemList.push(newData)
      }
      
      setItemListItems(finalItemList);
    }
  }, [showUpdateItemForm, selectedData])

  //Delete Item
  const [showDeleteItemForm, setShowDeleteItemForm] = useState(false);
  const openDeleteItemForm = (data) => {
    setSelectedData(data);
    setShowDeleteItemForm(true);
  }
  const closeDeleteItemForm = () => {
    setShowDeleteItemForm(false);
  }

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [barcode, setBarcode] = useState("");
  const [brandId, setItemId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [itemListItems, setItemListItems] = useState([]);

  const fileInputRef = useRef(null); // Reference to the file input
  const handleImageChange = (event) => {
    const files = event.target.files; // Get the selected files
    if (files && files[0]) {
        setImage(files); // Store the FileList
    }
  };
  const handleRemoveImage = () => {
    setImage(""); // Clear the image preview
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };

  const handleAddItem = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!productName
      || !itemCode
      || !barcode
      || !brandId
      || !price
      || !categoryId
    ) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    if(itemListItems.length <= 0) {
      showNotification("fail", "Please add atleast 1 item.")
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
        itemCode: itemCode,
        barcode: barcode,
        productName: productName,
        description: description,
        brandId: brandId,
        categoryId: categoryId,
        image: image ? imageToBeSave : null,
        price: price,
        itemListItems: itemListItems,
    };

    
    console.log('Final bulkData:', JSON.stringify(data, null, 2));

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
        closeAddItemForm();
    }
  };
  const handleUpdateItem = async (event) => {
    event.preventDefault();
    setLoading(true);

    if(!productName
      || !itemCode
      || !barcode
      || !brandId
      || !price
      || !categoryId
    ) {
      showNotification("fail", "Please fill up all required fields.")
      setLoading(false);
      return;
    }

    if(itemListItems.length <= 0) {
      showNotification("fail", "Please add atleast 1 item.")
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
        itemCode: itemCode,
        barcode: barcode,
        productName: productName,
        description: description,
        brandId: brandId,
        categoryId: categoryId,
        image: image ? imageToBeSave : null,
        price: price,
        itemListItems: itemListItems
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
        closeUpdateItemForm();
    }
  };
  const handleDeleteItem = async () => {
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
        closeDeleteItemForm();
    }
  };
  const resetParameters = () => {
    setItemCode("");
    setBarcode("");
    setDescription("");
    setProductName("");
    setItemId("");
    setCategoryId("");
    setImage("");
    setPrice(0);
    setItemListItems([]);
    setTempSelectedItem(null);
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

  const [isSelectItemMode, setIsSelectItemMode] = useState(false);
  const triggerSelectItemMode = () => {
    setIsSelectItemMode(true);
  }
  const unTriggerSelectItemMode = () => {
    setIsSelectItemMode(false);
  }

  const [showItemListSelect, setShowItemListSelect] = useState(false);
  const [tempSelectedItem, setTempSelectedItem] = useState(null);
  
  const openItemSelectForm = () => {
    setShowItemListSelect(true);
  }
  const closeItemSelectForm = () => {
    setShowItemListSelect(false);
    setTempSelectedItem(null);
    unTriggerSelectItemMode();
  }

  useEffect(() => {
    if (tempSelectedItem) {
      const newData = {
        name: tempSelectedItem.name,
        itemId: selectedData.id,
        itemListId: tempSelectedItem.id
      }
      
      setItemListItems((prev) => [...prev, newData]);
    }
  }, [tempSelectedItem, selectedData])

  const addTempItem = () => {
    triggerSelectItemMode()
    openItemSelectForm();
  }

  const removeTempItem = (data) => {
    console.log("Removing item: ", data); // Check if it's being called more than once
    setItemListItems((prev) => prev.filter((item) => item.itemListId !== data.itemListId));
  };

  return (
    <>
      <PageTitle>Manage Inventory</PageTitle>
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
          <div>
            <Button onClick={openAddItemForm}>Add Item</Button>
          </div>
      </div>

      {/* <!-- Categories --> */}
      <div className="flex flex-1 lg:mr-32 my-3">
        <Button className={`mx-2 ${activeCategory === 0 ? "dark:bg-gray-600 bg-gray-200" : ""}`} layout="outline"
                onClick={()=>setActiveCategory(0)}>
          All
        </Button>
        {categories.map((data, i) => (
          <Button key={i} className={`mx-2 ${activeCategory === data.id ? "dark:bg-gray-600 bg-gray-200" : ""}`} layout="outline" 
                  onClick={()=>setActiveCategory(data.id)}>
            {data.description}
          </Button>
        ))}
      </div>

      {/* table */}
      <TableContainer className="mb-20">
        <Table>
          <TableHeader>
            <tr>
              <TableCell className="text-center" onClick={() => handleSort('id')}>
                Id
                {sortState.id === 'id' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('productName')}>
                Product
                {sortState.id === 'productName' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center">Image</TableCell>
              <TableCell className="text-center" onClick={() => handleSort('itemCode')}>
                ItemCode
                {sortState.id === 'itemCode' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('barcode')}>
                Barcode
                {sortState.id === 'barcode' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('brand')}>
                Brand
                {sortState.id === 'brand' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('price')}>
                Price
                {sortState.id === 'price' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('category')}>
                Category
                {sortState.id === 'category' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center">Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTablePerPage.map((data, i) => (
              <TableRow key={i}>
                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.id}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold truncate w-64">{data.productName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate w-64">{data.description}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  {data.image ? (
                    <img
                      className="clickable-img w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain mx-auto"
                      src={'data:image/jpeg;base64,' + data.image}
                      alt="User avatar"
                      onClick={() => openImageViewer('data:image/jpeg;base64,' + data.image)}
                    />
                  ) : (
                    <img
                      className="clickable-img w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain mx-auto"
                      src={dummy}
                      alt="User avatar"
                      onClick={() => openImageViewer(dummy)}
                    />
                  )}
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.itemCode}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.barcode}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.brand}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{"₱ " + formatNumberWithCommas(data.price)}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.category}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit" onClick={()=>openUpdateItemForm(data)}>
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete" onClick={()=>openDeleteItemForm(data)} className="hidden">
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

      {/* Add Item Form */}
      <Modal id="modal" isOpen={showAddItemForm}>
        <ModalHeader>Add Item Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          { !isSelectItemMode &&
            <div className="custom-button hidden sm:block">
              <Button className="bg-green-custom" onClick={addTempItem}>Add Item</Button>
            </div>
          }

          <div className="p-5 flex flex-col">
          {itemListItems?.map((e, index) => {
            return (
                <div key={index} className='flex items-center p-1'>
                  <div className="custom-button hidden sm:block mr-5">
                    <Button className="bg-red-custom" onClick={()=>removeTempItem(e)} size="small" style={{fontSize: "0.7rem", height: "20px"}}>remove</Button>
                  </div>
                  <span >- {e.name}</span>
                </div>
            );
          })}
          </div>

          <Label className="my-5">
            <span>Product</span>
            <Input className="mt-1" placeholder="Product" value={productName} onChange={(e)=>setProductName(e.target.value)} />
            {!productName && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Description</span>
            <Textarea className="mt-1" rows="3" placeholder="Enter description." value={description} onChange={(e)=>setDescription(e.target.value)} />
          </Label>
          
          <Label className="my-5">
            <span>ItemCode</span>
            <Input className="mt-1" placeholder="ItemCode" value={itemCode} onChange={(e)=>setItemCode(e.target.value)} />
            {!itemCode && <span className='text-xs text-red-500'>required</span>}
          </Label>
          
          <Label className="my-5">
            <span>Barcode</span>
            <Input className="mt-1" placeholder="Barcode" value={barcode} onChange={(e)=>setBarcode(e.target.value)} />
            {!barcode && <span className='text-xs text-red-500'>required</span>}
          </Label>
          
          <Label className="my-5">
            <span>Brand</span>
            <BrandSelect getter={brandId} setter={setItemId}/>
            {!brandId && <span className='text-xs text-red-500'>required</span>}
          </Label>
          
          <Label className="my-5">
            <span>Price</span>
            <Input className="mt-1" placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} />
            {!price && <span className='text-xs text-red-500'>required</span>}
          </Label>
          
          <Label className="my-5">
            <span>Category</span>
            <CategorySelect getter={categoryId} setter={setCategoryId}/>
            {!categoryId && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Image</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="mt-2"
            />
          </Label>
          
          {image && image[0] && (
            <div className="mt-5">
              <span>Preview:</span>
              <img
                src={URL.createObjectURL(image[0])} // Create a URL for the file
                alt="Uploaded Preview"
                className="clickable-img mt-2 w-40 h-40 object-cover rounded"
                onClick={() => openImageViewer(URL.createObjectURL(image[0]))} // Pass the image file to the viewer
              />
              <Button
                onClick={handleRemoveImage}
                className="mt-2"
                size="small"
              >
                Remove
              </Button>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeAddItemForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleAddItem}>Save</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Update Item Form */}
      <Modal id="modal" isOpen={showUpdateItemForm}>
        <ModalHeader>Update Item Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          { !isSelectItemMode &&
            <div className="custom-button hidden sm:block">
              <Button className="bg-green-custom" onClick={addTempItem}>Add Item</Button>
            </div>
          }

          <div className="p-5 flex flex-col">
          {itemListItems?.map((e, index) => {
            return (
              <div key={index} className='flex items-center p-1'>
                <div className="custom-button hidden sm:block mr-5">
                  <Button className="bg-red-custom" onClick={()=>removeTempItem(e)} size="small" style={{fontSize: "0.7rem", height: "20px"}}>remove</Button>
                </div>
                <span>- {e.name}</span>
              </div>
            );
          })}
          </div>

          <Label className="my-5">
            <span>Product</span>
            <Input className="mt-1" placeholder="Product" value={productName} onChange={(e)=>setProductName(e.target.value)} />
            {!productName && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Description</span>
            <Textarea className="mt-1" rows="3" placeholder="Enter description." value={description} onChange={(e)=>setDescription(e.target.value)} />
          </Label>
          
          <Label className="my-5">
            <span>ItemCode</span>
            <Input className="mt-1" placeholder="ItemCode" value={itemCode} onChange={(e)=>setItemCode(e.target.value)} />
            {!itemCode && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Barcode</span>
            <Input className="mt-1" placeholder="Barcode" value={barcode} onChange={(e)=>setBarcode(e.target.value)} />
            {!barcode && <span className='text-xs text-red-500'>required</span>}
          </Label>
          
          <Label className="my-5">
            <span>Brand</span>
            <BrandSelect getter={brandId} setter={setItemId}/>
            {!brandId && <span className='text-xs text-red-500'>required</span>}
          </Label>
          
          <Label className="my-5">
            <span>Price</span>
            <Input className="mt-1" placeholder="Price" type="number" value={price} onChange={(e)=>setPrice(e.target.value)} />
            {!price && <span className='text-xs text-red-500'>required</span>}
          </Label>
          
          <Label className="my-5">
            <span>Category</span>
            <CategorySelect getter={categoryId} setter={setCategoryId}/>
            {!categoryId && <span className='text-xs text-red-500'>required</span>}
          </Label>

          <Label className="my-5">
            <span>Image</span>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="mt-2"
            />
          </Label>
          
          {image && image[0] && (
            <div className="mt-5">
              <span>Preview:</span>
              <img
                src={URL.createObjectURL(image[0])} // Create a URL for the file
                alt="Uploaded Preview"
                className="clickable-img mt-2 w-40 h-40 object-cover rounded"
                onClick={() => openImageViewer(URL.createObjectURL(image[0]))} // Pass the image file to the viewer
              />
              <Button
                onClick={handleRemoveImage}
                className="mt-2"
                size="small"
              >
                Remove
              </Button>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeUpdateItemForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleUpdateItem}>Update Item</Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Delete Item Form */}
      <Modal id="modal" isOpen={showDeleteItemForm}>
        <ModalHeader>Delete Item Form</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
            <span>{`Are you sure you want to delete ${selectedData.productName} ?`}</span>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeDeleteItemForm}>
              Cancel
            </Button>
          </div>
          <div className="block">
            <Button onClick={handleDeleteItem}>Delete Item</Button>
          </div>
        </ModalFooter>
      </Modal>

      {showItemListSelect && <ItemListSelect isOpen={showItemListSelect} onClose={closeItemSelectForm} selectedItem={tempSelectedItem} setSelectedItem={setTempSelectedItem}/>}

      {/* Full Image View */}
      {isImageViewerVisible && (
        <FullSizeImage
          src={imageSource}
          onClose={closeImageViewer} // Pass close handler to ImageViewer
        />
      )}

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

export default ManageInventory
