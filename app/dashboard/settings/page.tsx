"use client";

import { withAuth } from '@/hoc/withAuth'
import Layout from '@/layout/Layout'

function Settings() {
  return (
    <Layout>Settings</Layout>
  )
}

export default withAuth(Settings);