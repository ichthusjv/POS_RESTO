import React from 'react'
import routes from '../../routes/sidebar'
import { NavLink, Route } from 'react-router-dom'
import * as Icons from '../../icons'
import SidebarSubmenu from './SidebarSubmenu'
import logo from '../../assets/img/main_logo.png';

function Icon({ icon, ...props }) {
  const Icon = Icons[icon]
  return <Icon {...props} />
}

function SidebarContent({userAccess}) {
  const routeAccessMap = {
    "Dashboard": "hasDashboard",
    "Inventory": "hasInventory",
    "Cart": "hasCart",
    "Customer's View": "hasCustomerView",
    "Maintenance": [
      "hasManageInventory",
      "hasItemItemList",
      "hasBrands",
      "hasCategories",
      "hasCustomers",
      "hasUsers",
      "hasPositions",
      "hasEmploymentStatuses",
      "hasAccessTemplates",
      "hasAccounts",
      "hasDiscounts",
      "hasPricePerCategory",
      "hasPricePerCustomer",
    ],
    "Settings": "hasSettings",
  };

  const finalRoutes = [];

  for (const route of routes) {
    const accessKey = routeAccessMap[route.name];
  
    if (Array.isArray(accessKey)) {
      // If accessKey is an array, check if any condition is true
      if (accessKey.some(key => userAccess[key])) {
        finalRoutes.push(route);
      }
    } else if (accessKey && userAccess[accessKey]) {
      // If accessKey is a single condition
      finalRoutes.push(route);
    }
  }
  
  return (
    <div className=" text-gray-500 dark:text-gray-400">
      <a
        className="text-2xl font-bold text-gray-800 dark:text-gray-200 sticky top-0 z-30"
        href="/"  // Use a valid route or path here
        aria-label="Go to the homepage"
      >
        <div className="flex justify-center items-center flex-1 bg-white dark:bg-gray-800 py-4">
          <img src={logo} alt="" className='w-40 h-auto mr-2'></img>
          {/* <span>POINTSEVEN</span> */}
        </div>
      </a>
      <ul className="my-10">
        {finalRoutes.map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} userAccess={userAccess}/>
          ) : (
            <li className="relative px-6 py-3 my-5" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center w-full text-md font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  {/* <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span> */}
                </Route>
                <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>
      {/* <div className="px-6 my-6">
        <Button>
          Create account
          <span className="ml-2" aria-hidden="true">
            +
          </span>
        </Button>
      </div> */}
    </div>
  )
}

export default SidebarContent
