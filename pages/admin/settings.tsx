// components

import CardSettings from 'components/cards/card-settings'
import CardProfile from 'components/cards/card-profile'

// layout for page

import Admin from 'layouts/admin'
import type { FC, ReactNode } from 'react'

export type SettingsProps = FC & {
  layout: FC<{ children: ReactNode }>
}

const Settings: SettingsProps = () => {
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-8/12 px-4'>
          <CardSettings />
        </div>
        <div className='w-full lg:w-4/12 px-4'>
          <CardProfile />
        </div>
      </div>
    </>
  )
}

Settings.layout = Admin

export default Settings
