import { type FC, useRef, useState } from 'react'
import Link from 'next/link'
import { createPopper } from '@popperjs/core'

const IndexDropdown: FC = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false)
  const btnDropdownRef = useRef(null)
  const popoverDropdownRef = useRef(null)
  const openDropdownPopover = (): void => {
    if (
      btnDropdownRef.current !== null &&
      popoverDropdownRef.current !== null
    ) {
      createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
        placement: 'bottom-start'
      })
      setDropdownPopoverShow(true)
    }
  }
  const closeDropdownPopover = (): void => {
    setDropdownPopoverShow(false)
  }
  return (
    <>
      <a
        className='hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold'
        href='#pablo'
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault()
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover()
        }}
      >
        Demo Pages
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          'bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48'
        }
      >
        <span
          className={
            'text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400'
          }
        >
          Admin Layout
        </span>
        <Link
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          href='/admin/dashboard'
        >
          Dashboard
        </Link>
        <Link
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          href='/admin/settings'
        >
          Settings
        </Link>
        <Link
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          href='/admin/tables'
        >
          Tables
        </Link>
        <Link
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          href='/admin/maps'
        >
          Maps
        </Link>
        <div className='h-0 mx-4 my-2 border border-solid border-blueGray-100' />
        <div
          className={
            'text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400'
          }
        />
        <span
          className={
            'text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400'
          }
        >
          Auth Layout
        </span>
        <Link
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          href='/auth/login'
        >
          Login
        </Link>
        <Link
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          href='/auth/register'
        >
          Register
        </Link>
        <div className='h-0 mx-4 my-2 border border-solid border-blueGray-100' />
        <span
          className={
            'text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400'
          }
        >
          No Layout
        </span>
        <Link
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          href='/landing'
        >
          Landing
        </Link>
        <Link
          className={
            'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
          }
          href='/profile'
        >
          Profile
        </Link>
      </div>
    </>
  )
}

export default IndexDropdown
