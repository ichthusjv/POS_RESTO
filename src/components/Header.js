import React, { useContext, useEffect, useState, useCallback } from 'react'
import { SidebarContext } from '../context/SidebarContext'
import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineLogoutIcon,
  AddToCartIcon
} from '../icons'
import routes from '../routes/sidebar';
import { useHistory } from 'react-router-dom'
import { Avatar, Badge, Input, Dropdown, DropdownItem, WindmillContext } from '@windmill/react-ui'
import axios from 'axios'
import { domain, token } from '../App'
import dummy from '../assets/img/dummy.jpg';

function Header({ loggedUser, handleLogout }) {
  const history = useHistory(); // ✅ this gives navigation functions
  const { mode, toggleMode } = useContext(WindmillContext)
  const { toggleSidebar } = useContext(SidebarContext)

  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  function handleNotificationsClick() {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen)
  }

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  //Search dropdown
  const [query, setQuery] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  const allRoutes = routes
    .flatMap(route => (route.routes ? route.routes : [route]))
    .filter(route => route.path); // Only include routes with a path

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (value) {
      const filtered = allRoutes.filter(route =>
        route.name.toLowerCase().includes(value)
      );
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes([]);
    }
  };

  const viewCart = () =>{
    // window.location.pathname = "/cart";
    history.push("/cart");
  }

  const [general, setGeneral] = useState(0);

  const getCartTotal = useCallback(async () => {
    const apiUrl =  domain + "/api/Cart";

    try {
        const response = await axios.get(`${apiUrl}/${loggedUser.id}/general`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
        }})
  
        setGeneral(response.data)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
  }, [loggedUser]);

  useEffect(() => {
    getCartTotal();
  }, [getCartTotal, general])

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      {/* <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300"> */}
      <div className="flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* <!-- Mobile hamburger --> */}
        <button
          style={{visibility: "hidden"}}
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        {/* <!-- Search input --> */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 text-gray-700"
              placeholder="Search for menu"
              aria-label="Search"
              value={query}
              onChange={handleInputChange}
            />
            {filteredRoutes.length > 0 && (
              <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                {filteredRoutes.map((route, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    // onClick={() => window.location.href = route.path} // Navigate to route on click
                    onClick={() => history.push(route.path)}
                  >
                    {route.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === 'dark' ? (
                <SunIcon className="w-6 h-6" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </li>
          {/* <!-- Cart --> */}
          <li className="flex">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={viewCart}
              aria-label="Toggle color mode"
            >
              {/* The icon */}
              <AddToCartIcon className="w-6 h-6" aria-hidden="true" />

              {/* The counter badge */}
              {general.totalCount > 0 &&
                <span
                  aria-hidden="true"
                  className="text-white text-center text-xs absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
                >
                  {general.totalCount}
                </span>
              }
            </button>
          </li>
          {/* <!-- Notifications menu --> */}
          <li className="relative hidden">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={handleNotificationsClick}
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <BellIcon className="w-5 h-5" aria-hidden="true" />
              {/* <!-- Notification badge --> */}
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
              ></span>
            </button>

            <Dropdown
              align="right"
              isOpen={isNotificationsMenuOpen}
              onClose={() => setIsNotificationsMenuOpen(false)}
            >
              <DropdownItem tag="a" href="#" className="justify-between">
                <span>Messages</span>
                <Badge type="danger">13</Badge>
              </DropdownItem>
              <DropdownItem tag="a" href="#" className="justify-between">
                <span>Sales</span>
                <Badge type="danger">2</Badge>
              </DropdownItem>
              <DropdownItem onClick={() => alert('Alerts!')}>
                <span>Alerts</span>
              </DropdownItem>
            </Dropdown>
          </li>
          {/* <!-- Profile menu --> */}
          <li className="relative">
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              <Avatar
                className="align-middle w-10 h-10"
                src={loggedUser.image ? 'data:image/jpeg;base64,' + loggedUser.image : dummy}
                alt=""
                aria-hidden="true"
              />
            </button>
            <Dropdown
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            >
              <DropdownItem tag="a" href="/profile">
                <OutlinePersonIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>{loggedUser.fullName}</span>
              </DropdownItem>
              <DropdownItem onClick={handleLogout}>
                <OutlineLogoutIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>Log out</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
