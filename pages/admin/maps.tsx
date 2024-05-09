// components

import MapExample from 'components/Maps/MapExample'

// layout for page

import Admin from 'layouts/Admin'
import type { FC, ReactNode } from 'react'

export type MapsProps = FC & {
  layout: FC<{ children: ReactNode }>
}

const Maps: MapsProps = () => {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full px-4'>
          <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded'>
            <MapExample />
          </div>
        </div>
      </div>
    </>
  )
}

Maps.layout = Admin

export default Maps
