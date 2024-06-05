import { type FC, type ReactNode } from 'react'
import Head from 'next/head'

import 'chart.js/auto'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'styles/tailwind.css'
import { type AppProps } from 'next/app'

type AppComponentProps = AppProps & {
  Component: {
    layout: FC<{ children: ReactNode }>
  }
}

const emptyLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <>{children}</>
)

const app = ({ Component, pageProps }: AppComponentProps): JSX.Element => {
  const Layout = Component.layout ?? emptyLayout

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no'
        />
        <title>Pet Shop CRM</title>
        <script
          async
          src='https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE'
        ></script>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default app
