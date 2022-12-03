import React from "react"
import "tailwindcss/tailwind.css"
import { CardDivider } from "app/core/components/generic/Card"

import { ActivePortals } from "app/core/components/vendorStats/ActivePortals"
import { Footer } from "app/core/components/Footer"
import { OpportunityEngagement } from "app/core/components/vendorStats/OpportunityEngagement"
import { StakeholderActivity } from "app/core/components/vendorStats/StakeholderActivity"
import { useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTemplates from "app/vendor-stats/queries/getTemplates"
import getVendorStats from "app/vendor-stats/queries/getVendorStats"

function VendorStats() {
  const [vendorStats, { refetch }] = useQuery(getVendorStats, {}, { refetchOnWindowFocus: false })
  const [templates] = useQuery(getTemplates, {}, { refetchOnWindowFocus: false })
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8">
        <OpportunityEngagement data={vendorStats.opportunityEngagement} />
        <StakeholderActivity data={vendorStats.stakeholderActivityLog} />
      </div>
      <div style={{ backgroundColor: "#F7F7F9" }}>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div style={{ backgroundColor: "#F7F7F9" }}>
            <ActivePortals data={vendorStats.activePortals} templates={templates.templates} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

VendorStats.authenticate = true
VendorStats.getLayout = (page: React.ReactChild) => <Layout title="Vendor Stats">{page}</Layout>
export default VendorStats
