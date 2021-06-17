import React, { Suspense } from "react"
import "tailwindcss/tailwind.css"
import NextStepsCard from "app/core/components/customerPortals/NextStepsCard"
import DocumentsCard from "app/core/components/customerPortals/DocumentsCard"
import { ProposalCard } from "app/core/components/customerPortals/ProposalCard"
import LaunchRoadmap from "app/core/components/customerPortals/LaunchRoadmap"
import { ProductInfoCard } from "app/core/components/customerPortals/ProductInfoCard"
import { ContactsCard } from "app/core/components/ContactsCard"
import { InternalNotesCard } from "app/core/components/customerPortals/InternalNotesCard"
import { Footer } from "app/core/components/Footer"
import { Header } from "app/core/components/customerPortals/Header"
import { CardDivider } from "app/core/components/generic/Card"
import { NotFoundError, useParam, useQuery } from "blitz"
import getCustomerPortal from "../../customer-portals/queries/getCustomerPortal"

export default function CustomerPortal() {
  const portalId = useParam("portalId", "number")
  const [data, { refetch }] = useQuery(getCustomerPortal, { id: portalId })

  if (!portalId) throw new NotFoundError()
  //container: https://tailwindui.com/components/application-ui/layout/containers
  return <Suspense fallback={<>Loading!</>}>
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <Header />
      <div className="py-3"><CardDivider /></div>
      <LaunchRoadmap {...data.launchRoadmap} />
    </div>

    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <NextStepsCard {...data.nextSteps} taskOnClick={(id, isCompleted) => refetch()} />
          <DocumentsCard portalId={portalId} data={data.documents} />
          <ProductInfoCard data={data.productInfo} />
        </div>
        <div className="flex flex-col gap-4">
          <ProposalCard data={data.proposal} />
          <ContactsCard data={data.contacts} />
          <InternalNotesCard data={data.internalNotes} />
        </div>
      </div>
      <div className="pt-4">
        <Footer />
      </div>
    </div>
  </Suspense>
}
