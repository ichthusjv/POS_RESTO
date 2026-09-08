import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Inventory = lazy(() => import('../pages/Inventory'))
const CustomerView = lazy(() => import('../pages/CustomerView'))
const ManageInventory = lazy(() => import('../pages/ManageInventory'))
const ItemList = lazy(() => import('../pages/ItemList'))
const Brand = lazy(() => import('../pages/Brand'))
const Category = lazy(() => import('../pages/Category'))
const Customer = lazy(() => import('../pages/Customer'))
const Position = lazy(() => import('../pages/Position'))
const EmploymentStatus = lazy(() => import('../pages/EmploymentStatus'))
const User = lazy(() => import('../pages/User'))
const AccessTemplate = lazy(() => import('../pages/AccessTemplate'))
const Account = lazy(() => import('../pages/Account'))
const Discount = lazy(() => import('../pages/Discount'))
const PricePerCategory = lazy(() => import('../pages/PricePerCategory'))
const PricePerCustomer = lazy(() => import('../pages/PricePerCustomer'))
const Profile = lazy(() => import('../pages/Profile'))
const Cart = lazy(() => import('../pages/Cart'))
const Checkout = lazy(() => import('../pages/Checkout'))
const Settings = lazy(() => import('../pages/Settings'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: '/', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/inventory',
    component: Inventory,
  },
  {
    path: '/customerView',
    component: CustomerView,
  },
  {
    path: '/manageInventory',
    component: ManageInventory,
  },
  {
    path: '/itemList',
    component: ItemList,
  },
  {
    path: '/brands',
    component: Brand,
  },
  {
    path: '/categories',
    component: Category,
  },
  {
    path: '/users',
    component: User,
  },
  {
    path: '/positions',
    component: Position,
  },
  {
    path: '/employmentStatuses',
    component: EmploymentStatus,
  },
  {
    path: '/accessTemplates',
    component: AccessTemplate,
  },
  {
    path: '/accounts',
    component: Account,
  },
  {
    path: '/customers',
    component: Customer,
  },
  {
    path: '/discounts',
    component: Discount,
  },
  {
    path: '/pricePerCategory',
    component: PricePerCategory,
  },
  {
    path: '/pricePerCustomer',
    component: PricePerCustomer,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/cart',
    component: Cart,
  },
  {
    path: '/checkout',
    component: Checkout,
  },
  {
    path: '/settings',
    component: Settings,
  },
]

export default routes
