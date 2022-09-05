import React, { ReactChild } from "react"
import "tailwindcss/tailwind.css"
import { CardDivider } from "app/core/components/generic/Card"
import { Header } from "app/core/components/manageTemplates/Header"
import { Footer } from "app/core/components/Footer"
import { useQuery } from "blitz"
import getTemplates from "app/vendor-stats/queries/getTemplates"
import getVendorStats from "app/vendor-stats/queries/getVendorStats"
import { TemplateList } from "app/core/components/manageTemplates/TemplateList"
import Layout from "app/core/layouts/Layout"

function ManageTemplate() {
  const [vendorStats] = useQuery(getVendorStats, {}, { refetchOnWindowFocus: false })
  const [templates] = useQuery(getTemplates, {}, { refetchOnWindowFocus: false })

  return (
    <>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
        <Header vendorLogo={vendorStats.header.vendorLogo || ""} templates={templates.templates} />
        <div className="py-3">
          <CardDivider />
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <TemplateList data={templates.templates} />
      </div>
      <Footer />
    </>
  )
}

ManageTemplate.authenticate = true
ManageTemplate.getLayout = (page: ReactChild) => <Layout title="Manage Templates">{page}</Layout>
export default ManageTemplate
