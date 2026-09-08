import React, { useState, useEffect, useCallback } from 'react'

import InfoCard from '../components/Cards/InfoCard'
import PageTitle from '../components/Typography/PageTitle'
import { CartIcon, MoneyIcon, PeopleIcon } from '../icons'
import RoundIcon from '../components/RoundIcon'
import { 
  LoadingScreen,
  DateInput,
  formatNumberWithCommas,
} from '../components/CustomCommon'
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Badge,
  Pagination,
  Input,
  Modal,
  ModalHeader, 
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Select
} from '@windmill/react-ui'

import axios from 'axios'
import { domain, token } from '../App'
import { SearchIcon } from '../icons'

function Dashboard({loggedUser}) {
  const [pageTable, setPageTable] = useState(1)
  const [originalDataTablePerPage, setOriginalDataTablePerPage] = useState([])
  const [dataTablePerPage, setDataTablePerPage] = useState([])
  const [dataTableTotal, setDataTableTotal] = useState([])
  const [dataTableForSearch, setDataTableForSearch] = useState([])
  // const [selectedData, setSelectedData] = useState([])
  const [loading, setLoading] = useState(false)

  const apiUrl =  domain + "/api/Transactions";
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

  //Sorting feature
  const [sortState, setSortState] = useState({
    id: null, // null means no sorting
    direction: null, // default sorting direction
  });

  //Search
  const handleFilter = (value) => {
    const lowercaseValue = value.toLowerCase();
    var res = dataTableForSearch.filter((f) =>
      f.transactionReferenceNumber.toLowerCase().includes(lowercaseValue)
      );

      setDataTableTotal(res);
      setDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
      setOriginalDataTablePerPage(res.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage))
  };

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

  const getBadgeType = (status) => {
    let badgeType = 'primary'

    if(status === "Completed") {
      badgeType = 'success';
    } else if(status === "Cancelled") {
      badgeType = 'danger';
    } else if(status === "Pending") {
      badgeType = 'neutral';
    }
    return badgeType
  }

  const formattedDate = (value) => {
    if(value){
      return value.split('T')[0];
    }

    return ""
  }
  const getTodaysTransactionCount = () => {
    const today = new Date().toISOString().split('T')[0];

    // Filter transactions with today's date
    const todaysTransactions = dataTableTotal.filter(transaction => formattedDate(transaction.date) === today);

    // Count today's transactions
    const todaysTransactionCount = todaysTransactions.length;

    return todaysTransactionCount;
  }

  const getTodaysSales = () => {
    let todaySales = 0;
    const today = new Date().toISOString().split('T')[0];
  
    // Filter transactions with today's date
    const todaysTransactions = dataTableTotal.filter(transaction => formattedDate(transaction.date) === today);
  
    // Compute today's sales by summing up the amounts
    todaySales = todaysTransactions.reduce((total, transaction) => {
      const amount = parseFloat(transaction.payableAmount) || 0; // Handle invalid or missing amounts
      return total + amount;
    }, 0);
  
    return todaySales;
  };

  const [showViewForm, setShowViewForm] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const openViewForm = async (data) => {
    await fetchDataOrders(data);
    setShowViewForm(true);
    setSelectedData(data);
  }
  const closeViewForm = () => {
    setShowViewForm(false);
  }

  const today = new Date();
  const formattedDateToday = today.toISOString().split("T")[0];

  const [orders, setOrders] = useState([]);

  const fetchDataOrders = useCallback(async (data) => {
    const apiUrl =  domain + "/api/Order";
    setLoading(true);

    try {
        const response = await axios.get(`${apiUrl}/${data.userId}/${data.cartInfoId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }})

        setOrders(response.data);
    } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);

        setOrders([]);
    } finally {
        setLoading(false);
    }
  }, []);

  const generateOrderSummary = (data) => {
    return(
      <div className="flex items-center my-5 text-sm">
          <p className="text-center text-gray-600 dark:text-gray-400 break-words whitespace-normal w-64">{data.productName}</p>
          <p className="text-center text-gray-600 dark:text-gray-400 w-64">{`x ${data.quantity}`}</p>
          <p className="text-center text-gray-600 dark:text-gray-400 w-64">{`₱ ${formatNumberWithCommas(data.totalPrice)}`}</p>
      </div>
    )
  }

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* <!-- Search input --> */}
      <div className="flex flex-1 lg:mr-32 my-3">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search for transaction no."
              aria-label="Search"
              onChange={(e) => handleFilter(e.target.value)}
            />
          </div>
      </div>

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
        <InfoCard title="Total transactions" value={totalResults}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Today's sales" value={`₱ ${formatNumberWithCommas(getTodaysSales())}`}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Today's transactions" value={getTodaysTransactionCount()}>
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell className="text-center" onClick={() => handleSort('transactionReferenceNumber')}>
                Transaction No. 
                {sortState.id === 'transactionReferenceNumber' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('payableAmount')}>
                Amount
                {sortState.id === 'payableAmount' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('status')}>
                Status
                {sortState.id === 'status' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('date')}>
                Date
                {sortState.id === 'date' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
              <TableCell className="text-center" onClick={() => handleSort('userFullName')}>
                Prepared by
                {sortState.id === 'userFullName' && (
                  <span>{sortState.direction === 'asc' ? '↑' : sortState.direction === 'desc' ? '↓' : ''}</span>
                )}
              </TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTablePerPage.map((data, i) => (
              <TableRow key={i} onClick={()=>openViewForm(data)} className="hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.transactionReferenceNumber}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{`₱ ${formatNumberWithCommas(data.payableAmount)}`}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <Badge type={getBadgeType(data.status)}>{data.status}</Badge>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{formattedDate(data.date)}</span>
                </TableCell>

                <TableCell className="text-center" style={{justifyItems: "center"}}>
                  <span className="text-sm">{data.userFullName}</span>
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

      {/* View Form */}
      <Modal id="modal" isOpen={showViewForm}>
        <ModalHeader>Transaction No. {selectedData?.transactionReferenceNumber}</ModalHeader>
        <ModalBody className="max-h-xl overflow-y-auto p-2">
          <div className='py-5'>
            <div className="px-4 py-3 mb-2 bg-white rounded-lg shadow-md dark:bg-gray-900">
              <div className="grid gap-6 mb-8 grid-cols-2">
                <Label>
                  <span>Date</span>
                  <DateInput getter={formattedDateToday} isReadOnly={true}/>
                </Label>
                <Label>
                  <span>Prepared By</span>
                  <Input className="mt-1 input-custom-light dark:input-custom" disabled value={loggedUser.fullName}/>
                </Label>
              </div>
            </div>

            <div className="px-4 py-3 mb-2 bg-white rounded-lg shadow-md dark:bg-gray-900 max-h-xl h-full overflow-auto">
              <div className="flex items-center py-2 border-b-2 border-color-white bg-white dark:bg-gray-800 sticky z-10" style={{top: "-12px"}}>
                  <p className="font-semibold text-center text-gray-600 dark:text-gray-400 break-words whitespace-normal w-64">Item</p>
                  <p className="font-semibold text-center text-gray-600 dark:text-gray-400 w-64">Quantity</p>
                  <p className="font-semibold text-center text-gray-600 dark:text-gray-400 w-64">Price</p>
              </div>
              { orders.map((order, i) => (
                generateOrderSummary(order)
              ))}
            </div>

            <div className="px-4 py-3 mb-2 bg-white rounded-lg shadow-md dark:bg-gray-900">
              <div className="py-2">
                <Label className="mt-2">
                  <span>SubTotal</span>
                  <Input className="mt-1 input-custom-light dark:input-custom" value={`₱ ${formatNumberWithCommas(selectedData?.subTotal)}`} disabled />
                </Label>
              </div>
              <div className="py-2">
                <Label className="mt-2">
                  <span>Tax (VAT included)</span>
                  <Input className="mt-1 input-custom-light dark:input-custom" value={`₱ ${formatNumberWithCommas(selectedData?.tax)}`} disabled/>
                </Label>
              </div>
              <div className="py-2">
                <Label className="mt-2">
                  <span>{`Total Discount: ${selectedData?.discount.toFixed(2)}%`}</span>
                </Label>
              </div>
              <div className="py-2">
                <Label className="mt-5">
                  <span>Payable Amount</span>
                  <Input className="mt-1 input-custom-light dark:input-custom" value={`₱ ${formatNumberWithCommas(selectedData?.payableAmount)}`} disabled/>
                </Label>
              </div>
              <div className="p-2 my-5 border border-white">
                <Label className="mt-5">
                  <span>Payment Type</span>
                  <Input className="mt-1 input-custom-light dark:input-custom" value={selectedData?.paymentType} disabled/>
                </Label>

                { selectedData?.paymentType === "Cash" &&
                  <div className="p-2">
                    <Label className="mt-1">
                      <span>Cash Amount (in ₱)</span>
                      <Input className="mt-1" type="number" placeholder="Input cash amount" value={selectedData?.payment} disabled/>
                    </Label>
                    <Label className="mt-5">
                      <span>Change</span>
                      <Input className="mt-1" value={`₱ ${formatNumberWithCommas(selectedData?.change)}`} disabled/>
                    </Label>
                  </div>
                }
                { selectedData?.paymentType === "Card" &&
                  <div className="p-2">
                    <Label className="">
                      <span>Type</span>
                      <Select className="mt-1">
                        <option>GCash</option>
                        <option>Credit or debit card</option>
                        <option>Link bank account</option>
                      </Select>
                    </Label>
                  </div>
                }
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="block">
            <Button layout="outline" onClick={closeViewForm}>
              Close
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Loading */}
      {loading && <LoadingScreen/> }
    </>
  )
}

export default Dashboard
