import React from "react"
import "tailwindcss/tailwind.css"
import { CardDivider } from "app/core/components/generic/Card"

import { ActivePortals } from "app/core/components/vendorStats/ActivePortals"
import { Header } from "app/core/components/vendorStats/Header"
import { Footer } from "app/core/components/Footer"
import { OpportunityEngagement } from "app/core/components/vendorStats/OpportunityEngagement"
import { StakeholderActivity } from "app/core/components/vendorStats/StakeholderActivity"
import { useQuery } from "blitz"
import getVendorStats from "../vendor-stats/queries/getVendorStats"
import getTemplates from "app/vendor-stats/queries/getTemplates"

function VendorStats() {
  const [vendorStats, { refetch }] = useQuery(getVendorStats, {}, { refetchOnWindowFocus: false })
  const [templates] = useQuery(getTemplates, {}, { refetchOnWindowFocus: false })
  return (
    <>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
        <Header
          vendorLogo={vendorStats.header.vendorLogo || ""}
          templates={templates.templates}
          refetchHandler={refetch}
        />
        <div className="py-3">
          <CardDivider />
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OpportunityEngagement data={vendorStats.opportunityEngagement} />
          <StakeholderActivity data={vendorStats.stakeholderActivityLog} />
        </div>
      </div>
      <div style={{ backgroundColor: "#F7F7F9" }}>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
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
export default VendorStats
