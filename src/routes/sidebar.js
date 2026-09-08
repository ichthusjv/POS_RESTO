/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: '/', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Dashboard', // name that appear in Sidebar
  },
  {
    path: '/inventory',
    icon: 'InventoryIcon',
    name: 'Inventory',
  },
  {
    path: '/cart',
    icon: 'CartIcon',
    name: 'Cart',
  },
  {
    path: '/customerView',
    icon: 'CustomerView',
    name: "Customer's View",
  },
  {
    icon: 'PagesIcon',
    name: 'Maintenance',
    routes: [
      // submenu
      {
        path: '/accessTemplates',
        name: 'Access Templates',
      },
      {
        path: '/accounts',
        name: 'Accounts',
      },
      {
        path: '/brands',
        name: 'Brands',
      },
      {
        path: '/categories',
        name: 'Categories',
      },
      {
        path: '/customers',
        name: 'Customers',
      },
      {
        path: '/discounts',
        name: 'Discounts',
      },
      {
        path: '/employmentStatuses',
        name: 'Employment Statuses',
      },
      {
        path: '/manageInventory',
        name: 'Manage Inventory',
      },
      {
        path: '/itemList',
        name: 'Item List',
      },
      {
        path: '/positions',
        name: 'Positions',
      },
      {
        path: '/pricePerCategory',
        name: 'Price Per Category',
      },
      {
        path: '/pricePerCustomer',
        name: 'Price Per Customer',
      },
      {
        path: '/users',
        name: 'Users',
      },
    ],
  },
  {
    path: '/settings',
    icon: 'MaintenanceIcon',
    name: 'Settings',
  },
]

export default routes
