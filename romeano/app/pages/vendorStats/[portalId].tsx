import { useRouter } from "next/router"
import React from "react"
import "tailwindcss/tailwind.css"
import { CardDivider } from "app/core/components/generic/Card"

import { ActivePortalsDemo } from "app/core/components/vendorStats/ActivePortals"
import { Header } from "app/core/components/vendorStats/Header"
import { Footer } from "app/core/components/Footer"
import { OpportunityEngagement } from "app/core/components/vendorStats/OpportunityEngagement"
import { StakeholderActivity } from "app/core/components/vendorStats/StakeholderActivity"
import { NotFoundError, useParam, useQuery } from "blitz"
import getVendorStats from "../../vendor-stats/queries/getVendorStats"

export default function VendorStats() {
  const portalId = useParam("portalId", "number")
  const [portal] = useQuery(getVendorStats, { id: portalId })

  if (!portalId) throw new NotFoundError()

  return <>
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <Header />
      <div className="py-3"><CardDivider /></div>
    </div>
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OpportunityEngagement data={portal.opportunityEngagement}/>
        <StakeholderActivity data={portal.stakeholderActivity}/>
      </div>
      <ActivePortalsDemo data={portal.activePortals}/>
    </div>
    <Footer />
  </>
}