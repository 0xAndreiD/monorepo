import React from "react"
import "tailwindcss/tailwind.css"
import { CardDivider } from "app/core/components/generic/Card"
import { ActivePortals } from "app/core/components/vendorStats/ActivePortals"
import { Header } from "app/core/components/manageTemplates/Header"
import { Footer } from "app/core/components/Footer"
import { OpportunityEngagement } from "app/core/components/vendorStats/OpportunityEngagement"
import { StakeholderActivity } from "app/core/components/vendorStats/StakeholderActivity"
import { useQuery } from "blitz"
import getTemplates from "app/vendor-stats/queries/getTemplates"
import getVendorStats from "app/vendor-stats/queries/getVendorStats"
import { TemplateList } from "app/core/components/manageTemplates/TemplateList"

function ManageTemplate() {
  const [vendorStats] = useQuery(getVendorStats, {}, { refetchOnWindowFocus: false })
  const [templates] = useQuery(getTemplates, {}, { refetchOnWindowFocus: false })

  return (
    <>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
        <Header vendorLogo={vendorStats.header.vendorLogo} />
        <div className="py-3">
          <CardDivider />
        </div>
      </div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
        <TemplateList data={templates.templates} />
      </div>
      <Footer />
    </>
  )
}

ManageTemplate.authenticate = true
export default ManageTemplate
