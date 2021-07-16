import React, { Suspense } from "react"
import "tailwindcss/tailwind.css"
import DocumentsCard from "app/core/components/portalDetails/DocumentsCard"
import OpportunityOverview from "app/core/components/portalDetails/OpportunityOverview"
import { ContactsCard } from "app/core/components/ContactsCard"
import { Footer } from "app/core/components/Footer"
import { Header } from "app/core/components/portalDetails/Header"
import { CardDivider } from "app/core/components/generic/Card"
import LineChart from "app/core/components/portalDetails/LineChart"
import { StakeholderEngagementCard } from "app/core/components/portalDetails/StakeholderEngagementCard"
import { StakeholderActivityLogCard } from "app/core/components/portalDetails/StakeholderActivityLogCard"
import { NotFoundError, useParam, useQuery } from "blitz"
import getPortalDetail from "../../portal-details/queries/getPortalDetail"

export default function PortalDetails() {
  const portalId = useParam("portalId", "number")
  const [portal] = useQuery(getPortalDetail, { portalId })

  if (!portalId) throw new NotFoundError()

  //container: https://tailwindui.com/components/application-ui/layout/containers
  return <Suspense fallback={<>Loading!</>}>
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <Header portalId={portalId}/>
      <div className="py-3"><CardDivider /></div>
    </div>

    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <OpportunityOverview {...portal.opportunityOverview} />
          <ContactsCard data={portal.contacts}
                        numContactsToDisplay={1}
                        narrowLayout />
        </div>
        <div className="flex flex-col gap-4">
          <LineChart data={portal.overallEngagement} />
        </div>
      </div>
      <CardDivider />
      <DocumentsCard portalId={portalId} data={portal.documents} />
      <CardDivider />
      <StakeholderEngagementCard data={portal.stakeholderEngagement} />
      <StakeholderActivityLogCard data={portal.stakeholderActivityLog}/>
      <Footer />
    </div>
  </Suspense>
}

PortalDetails.authenticate = true
