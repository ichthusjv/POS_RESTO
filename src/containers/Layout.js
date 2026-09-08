import React, { useState, useContext, Suspense, useEffect, lazy } from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import routes from '../routes'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Main from '../containers/Main'
import ThemedSuspense from '../components/ThemedSuspense'
import { SidebarContext } from '../context/SidebarContext'

const Page404 = lazy(() => import('../pages/404'))

function Layout({loggedUser, userAccess, handleLogout}) {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext)
  let location = useLocation()

  useEffect(() => {
    closeSidebar()
  }, [location, closeSidebar])

  const routeAccessMap = {
    "/": "hasDashboard",
    "/inventory": "hasInventory",
    "/cart": "hasCart",
    "/customerView": "hasCustomerView",
    "/manageInventory": "hasManageInventory",
    "/itemList": "hasItemList",
    "/brands": "hasBrands",
    "/categories": "hasCategories",
    "/customers": "hasCustomers",
    "/users": "hasUsers",
    "/positions": "hasPositions",
    "/employmentStatuses": "hasEmploymentStatuses",
    "/accessTemplates": "hasAccessTemplates",
    "/accounts": "hasAccounts",
    "/discounts": "hasDiscounts",
    "/pricePerCategory": "hasPricePerCategory",
    "/pricePerCustomer": "hasPricePerCustomer",
    "/profile": "",
    "/checkout": "",
    "/settings": "hasSettings",
  };
  
  const finalRoutes = [];

  // Filter and push routes dynamically
  for (const route of routes) {
    const accessKey = routeAccessMap[route.path];
    if (accessKey && userAccess[accessKey]) {
      finalRoutes.push(route);
    }

    if (route.path === "/profile") {
      finalRoutes.push(route);
    }

    /* if (route.path === "/checkout") {
      finalRoutes.push(route);
    } */
  }

  const [isCustomerView, setIsCustomerView] = useState(false);

  useEffect(() => {
    // Check if the path is '/customerView'
    if (location.pathname === "/customerView") {
      setIsCustomerView(true);
    } else {
      setIsCustomerView(false);
    }
  }, [location.pathname])

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSidebarOpen && 'overflow-hidden'} ${isCustomerView && 'items-center justify-center'}`}
    >
      {!isCustomerView ?
        <>
          <Sidebar userAccess={userAccess}/>

          <div className="flex flex-col flex-1 w-full">
            <Header loggedUser={loggedUser} handleLogout={handleLogout}/>
            <Main>
              <Suspense fallback={<ThemedSuspense />}>
                <Switch>
                  {finalRoutes.map((route, i) => {
                    return route.component ? (
                      <Route
                        key={i}
                        exact={true}
                        path={`${route.path}`}
                        render={(props) => <route.component {...props} loggedUser={loggedUser}/>}
                      />
                    ) : null
                  })}
                  <Redirect exact from="/" to="/" />
                  <Route component={Page404} />
                </Switch>
              </Suspense>
            </Main>
          </div>
        </>
        :
        <>
          <Main>
            <Suspense fallback={<ThemedSuspense />}>
              <Switch>
                {finalRoutes.map((route, i) => {
                  return route.component ? (
                    <Route
                      key={i}
                      exact={true}
                      path={`${route.path}`}
                      render={(props) => <route.component {...props} loggedUser={loggedUser}/>}
                    />
                  ) : null
                })}
                <Redirect exact from="/" to="/" />
                <Route component={Page404} />
              </Switch>
            </Suspense>
          </Main>
        </>
      }
    </div>
  )
}

export default Layout
