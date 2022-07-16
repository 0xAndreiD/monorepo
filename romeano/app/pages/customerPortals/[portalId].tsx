import "tailwindcss/tailwind.css"
import NextStepsCard from "app/core/components/customerPortals/NextStepsCard"
import DocumentsCard from "app/core/components/customerPortals/DocumentsCard"
import { ProposalCard } from "app/core/components/customerPortals/ProposalCard"
import LaunchRoadmap from "app/core/components/customerPortals/LaunchRoadmap"
import { ProductInfoCard } from "app/core/components/customerPortals/ProductInfoCard"
import { ContactsCard } from "app/core/components/ContactsCard"
import { Footer } from "app/core/components/Footer"
import { LoadingSpinner } from "app/core/components/LoadingSpinner"
import { Header } from "app/core/components/customerPortals/Header"
import { CardDivider } from "app/core/components/generic/Card"
import { useParam, useQuery, useSession } from "blitz"
import getCustomerPortal from "../../customer-portals/queries/getCustomerPortal"
import StakeholderLoginForm from "../../auth/components/StakeholderLoginForm"

function CustomerPortal() {
  const portalId = useParam("portalId", "string")!
  const session = useSession()
  const [data, { refetch }] = useQuery(
    getCustomerPortal,
    { portalId },
    {
      refetchOnWindowFocus: false,
      enabled: !!portalId && !session.isLoading && !!session.userId,
    }
  )

  if (!session.isLoading && !session.userId) {
    return <StakeholderLoginForm />
  }

  if (!portalId || !data) {
    return <LoadingSpinner />
  }
  //container: https://tailwindui.com/components/application-ui/layout/containers
  return (
    <>
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 pt-2">
        <Header
          portalId={portalId}
          vendorLogo={data.header.vendorLogo}
          customerName={data.header.customerName}
          customerLogo={data.header.customerLogo}
          data={data.proposal.stakeholders}
          editingEnabled={false}
          refetchHandler={refetch}
        />
      </div>

      <div className="max-w-12xl mx-auto sm:px-6 lg:px-8 py-2">
        <div className="">
          <CardDivider />
        </div>
      </div>

      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 py-2">
        <LaunchRoadmap
          portalId={portalId}
          refetchHandler={refetch}
          editingEnabled={false}
          stageData={data.launchRoadmap.stages}
          currentRoadmapStage={data.launchRoadmap.currentRoadmapStage}
        />
      </div>

      {/* <div className="max-w-8xl mx-40 bg-gray-100"> */}
      <div className="max-w-12xl mx-auto sm:px-6 lg:px-16 py-6 bg-gray-100">
        <div className="max-w-6xl lg:px-8 mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-9">
          <div className="flex flex-col gap-9">
            <NextStepsCard {...data.nextSteps} portalId={portalId} refetchHandler={refetch} />
            <DocumentsCard portalId={portalId} data={data.documents} refetchHandler={refetch} />
            <ProductInfoCard
              portalId={portalId}
              data={data.productInfo}
              editingEnabled={false}
              refetchHandler={refetch}
            />
          </div>
          <div className="flex flex-col gap-9">
            <ProposalCard portalId={portalId} data={data.proposal} refetchHandler={refetch} editingEnabled={false} />
            <ContactsCard data={data.contacts} />
            {/*<InternalNotesCard portalId={portalId} data={data.internalNotes} refetchHandler={refetch} />*/}
          </div>
        </div>
        <div className="pt-4">
          <Footer />
        </div>
      </div>
      {/* </div> */}
    </>
  )
}

// CustomerPortal.authenticate = true
export default CustomerPortal
