import React, { Suspense } from "react"
import "tailwindcss/tailwind.css"
import DocumentsCard from "app/core/components/portalDetails/DocumentsCard"
import OpportunityOverview from "app/core/components/portalDetails/OpportunityOverview"
import { ContactsCard } from "app/core/components/ContactsCard"
import { Footer } from "app/core/components/Footer"
import { Header } from "app/core/components/portalDetails/Header"
import { CardDivider } from "app/core/components/generic/Card"
import { useRouter } from "next/router"
import LineChart from "app/core/components/portalDetails/LineChart"
import { StakeholderEngagementDemo } from "app/core/components/portalDetails/StakeholderEngagementDemo"
import { StakeholderActivityLogDemo } from "app/core/components/portalDetails/StakeholderActivityLogDemo"
import { NotFoundError, useParam, useQuery } from "blitz"
import getPortalDetail from "../../portal-details/queries/getPortalDetail"


export default function CustomerPortal() {
  const portalId = useParam("portalId", "number")
  const [portal] = useQuery(getPortalDetail, { id: portalId })

  if (!portalId) throw new NotFoundError()

  //container: https://tailwindui.com/components/application-ui/layout/containers
  return <Suspense fallback={<>Loading!</>}>
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <Header />
      <div className="py-3"><CardDivider /></div>
    </div>

    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <OpportunityOverview data={portal.launchRoadmap} />
          <ContactsCard data={portal.contacts}
                        numContactsToDisplay={1}
                        narrowLayout />
        </div>
        <div className="flex flex-col gap-4">
          <LineChart />
        </div>
      </div>
      <CardDivider />
      <DocumentsCard portalId={portalId} data={portal.documents} />
      <CardDivider />
      <StakeholderEngagementDemo />
      <StakeholderActivityLogDemo />
      <Footer />
    </div>
  </Suspense>
}
