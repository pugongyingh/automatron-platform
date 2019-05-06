import React, { useState, useEffect, Suspense, lazy } from 'react'
import Layout from '../components/Layout'

const Authorization = lazy(() => import('../firebase/Authorization'))

/** @type {string | undefined} */
let savedToken

export default () => (
  <Layout>
    <AuthorizationPage />
  </Layout>
)

function Loading() {
  return <div>Loading...</div>
}

function AuthorizationPage() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setLoaded(true)
  }, [])
  if (!loaded) {
    return <Loading />
  }
  if (savedToken) {
    return (
      <Suspense fallback={<Loading />}>
        <Authorization token={savedToken} />
      </Suspense>
    )
  }
  const match =
    typeof window !== 'undefined' &&
    window.location.hash.match(/login_token=([^&#]+)/)
  if (match) {
    const token = match[1]
    savedToken = token
    return (
      <Suspense fallback={<Loading />}>
        <Authorization token={token} />
      </Suspense>
    )
  } else {
    return <div>Error: No token received!</div>
  }
}
