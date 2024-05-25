// components

import { CardTable } from 'components/cards/card-table'

// layout for page

import Admin from 'layouts/admin'
import type { FC, ReactNode } from 'react'

export type TablesProps = FC & {
  layout: FC<{ children: ReactNode }>
}

const Tables: TablesProps = () => {
  return (
    <>
      <div className='flex flex-wrap mt-4'>
        <div className='w-full mb-12 px-4'>
          <CardTable />
        </div>
        <div className='w-full mb-12 px-4'>
          <CardTable color='dark' />
        </div>
      </div>
    </>
  )
}

Tables.layout = Admin

export default Tables
