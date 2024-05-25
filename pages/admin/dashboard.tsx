// components

import CardLineChart from 'components/cards/card-line-chart'
import CardBarChart from 'components/cards/card-bar-chart'
import CardPageVisits from 'components/cards/card-page-visits'
import CardSocialTraffic from 'components/cards/card-social-traffic'

// layout for page

import Admin from 'layouts/admin'
import type { FC, ReactNode } from 'react'

export type DashboardProps = FC & {
  layout: FC<{ children: ReactNode }>
}

const Dashboard: DashboardProps = () => {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full xl:w-8/12 mb-12 xl:mb-0 px-4'>
          <CardLineChart />
        </div>
        <div className='w-full xl:w-4/12 px-4'>
          <CardBarChart />
        </div>
      </div>
      <div className='flex flex-wrap mt-4'>
        <div className='w-full xl:w-8/12 mb-12 xl:mb-0 px-4'>
          <CardPageVisits />
        </div>
        <div className='w-full xl:w-4/12 px-4'>
          <CardSocialTraffic />
        </div>
      </div>
    </>
  )
}

Dashboard.layout = Admin

export default Dashboard
