import "tailwindcss/tailwind.css"
import NextStepsCard from "app/core/components/customerPortals/NextStepsCard"
import DocumentsCard from "app/core/components/customerPortals/DocumentsCard"
import { ProposalCard } from "app/core/components/customerPortals/ProposalCard"
import LaunchRoadmap from "app/core/components/customerPortals/LaunchRoadmap"
import { ProductInfoCard } from "app/core/components/customerPortals/ProductInfoCard"
import { ContactsCard } from "app/core/components/ContactsCard"
import { Footer } from "app/core/components/Footer"
import { Header } from "app/core/components/customerPortals/Header"
import { CardDivider } from "app/core/components/generic/Card"
import { useParam, useQuery, useSession } from "blitz"
import getCustomerPortal from "../../customer-portals/queries/getCustomerPortal"
import StakeholderLoginForm from "../../auth/components/StakeholderLoginForm"

function CustomerPortal() {
  const portalId = useParam("portalId", "number")
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
    return <>Loading!</>
  }
  //container: https://tailwindui.com/components/application-ui/layout/containers
  return (
    <>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
        <Header
          portalId={portalId}
          vendorLogo={data.header.vendorLogo}
          customerName={data.header.customerName}
          customerLogo={data.header.customerLogo}
          data={data.proposal.stakeholders}
          refetchHandler={refetch}
        />
        <div className="py-3">
          <CardDivider />
        </div>
        <LaunchRoadmap portalId={portalId} refetchHandler={refetch} editingEnabled={false} {...data.launchRoadmap} />
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <NextStepsCard {...data.nextSteps} portalId={portalId} refetchHandler={refetch} />
            <DocumentsCard portalId={portalId} data={data.documents} refetchHandler={refetch} />
            <ProductInfoCard
              portalId={portalId}
              data={data.productInfo}
              editingEnabled={false}
              refetchHandler={refetch}
            />
          </div>
          <div className="flex flex-col gap-4">
            <ProposalCard portalId={portalId} data={data.proposal} refetchHandler={refetch} editingEnabled={false} />
            <ContactsCard data={data.contacts} />
            {/*<InternalNotesCard portalId={portalId} data={data.internalNotes} refetchHandler={refetch} />*/}
          </div>
        </div>
        <div className="pt-4">
          <Footer />
        </div>
      </div>
    </>
  )
}

// CustomerPortal.authenticate = true
export default CustomerPortal
