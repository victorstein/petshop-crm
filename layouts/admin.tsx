import { type FC, type ReactNode } from 'react'

// components

import AdminNavbar from 'components/navbars/admin-navbar'
import Sidebar from 'components/sidebar/sidebar'
import HeaderStats from 'components/headers/header-stats'
import FooterAdmin from 'components/footers/footer-admin'

const Admin: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <div className='relative md:ml-64 bg-blueGray-100'>
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className='px-4 md:px-10 mx-auto w-full -m-24'>
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  )
}

export default Admin
