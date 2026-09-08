import React from 'react'
import DesktopSidebar from './DesktopSidebar'
import MobileSidebar from './MobileSidebar'

function Sidebar({userAccess}) {
  return (
    <>
      <DesktopSidebar userAccess={userAccess}/>
      <MobileSidebar userAccess={userAccess}/>
    </>
  )
}

export default Sidebar
