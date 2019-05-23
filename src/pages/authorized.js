import React, { useState, useEffect, Suspense, lazy } from 'react'
import Layout from '../components/Layout'

const Authorization = lazy(() => import('../firebase/Authorization'))

/** @typedef {{ loginToken: string; to: string }} SignInParams */

/** @type {SignInParams | null} */
let savedSignInParams = null

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
  const signInParams = getSignInParams()
  if (signInParams) {
    return (
      <Suspense fallback={<Loading />}>
        <Authorization token={signInParams.loginToken} to={signInParams.to} />
      </Suspense>
    )
  } else {
    return <div>Error: No token received!</div>
  }
}

function getSignInParams() {
  if (savedSignInParams) {
    return savedSignInParams
  }
  const match =
    typeof window !== 'undefined' &&
    window.location.hash.match(/login_token=([^&#]+)&to=(\w+)/)
  if (!match) return null
  savedSignInParams = {
    loginToken: match[1],
    to: match[2],
  }
  setTimeout(() => {
    window.location.hash = '#_=_'
  })
  return savedSignInParams
}
