import React, { useState, useEffect, Suspense, lazy } from 'react'
import Layout from '../components/Layout'

const Authorization = lazy(() => import('../firebase/Authorization'))

/** @typedef {{ loginToken: string; to: string }} LoginParams */

/** @type {LoginParams | null} */
let savedLoginParams = null

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
  const loginParams = getLoginParams()
  if (loginParams) {
    return (
      <Suspense fallback={<Loading />}>
        <Authorization token={loginParams.loginToken} />
      </Suspense>
    )
  } else {
    return <div>Error: No token received!</div>
  }
}

function getLoginParams() {
  if (savedLoginParams) {
    return savedLoginParams
  }
  const match =
    typeof window !== 'undefined' &&
    window.location.hash.match(/login_token=([^&#]+)&to=(\w+)/)
  if (!match) return null
  savedLoginParams = {
    loginToken: match[1],
    to: match[2],
  }
  setTimeout(() => {
    window.location.hash = '#_=_'
  })
  return savedLoginParams
}
