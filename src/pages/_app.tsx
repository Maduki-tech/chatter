import { AppProps } from 'next/app'

import { api } from '~/utils/api'

import '~/styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ClerkProvider {...pageProps}>
            <Component {...pageProps} />
        </ClerkProvider>
    )
}
export default api.withTRPC(MyApp)
