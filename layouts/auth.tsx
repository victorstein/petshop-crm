import { type FC, type ReactNode } from 'react'

// components

import Navbar from 'components/navbars/auth-navbar'
import FooterSmall from 'components/footers/footer-small'

const Auth: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>
        <section className='relative w-full h-full py-40 min-h-screen'>
          <div
            className='absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full'
            style={{
              backgroundImage: "url('/img/register_bg_2.png')"
            }}
          ></div>
          {children}
          <FooterSmall absolute />
        </section>
      </main>
    </>
  )
}

export default Auth
