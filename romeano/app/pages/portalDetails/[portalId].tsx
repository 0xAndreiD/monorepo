import "tailwindcss/tailwind.css"
import LineChart from "app/core/components/portalDetails/LineChart"
import { useParam, useQuery } from "blitz"
import getPortalDetail from "../../portal-details/queries/getPortalDetail"
import { ContactsCard } from "app/core/components/ContactsCard"
import DocumentsCard from "app/core/components/portalDetails/DocumentsCard"
import { CardDivider } from "app/core/components/generic/Card"
import { Footer } from "app/core/components/Footer"
import { StakeholderEngagementCard } from "app/core/components/portalDetails/StakeholderEngagementCard"
import { StakeholderActivityLogCard } from "app/core/components/portalDetails/StakeholderActivityLogCard"
import OpportunityOverview from "app/core/components/portalDetails/OpportunityOverview"
import { Header } from "app/core/components/portalDetails/Header"
import { LoadingSpinner } from "app/core/components/LoadingSpinner"

function PortalDetails() {
  const portalId = useParam("portalId", "string")!
  const [portal, { refetch }] = useQuery(
    getPortalDetail,
    { portalId },
    { refetchOnWindowFocus: false, enabled: !!portalId }
  )

  //container: https://tailwindui.com/components/application-ui/layout/containers
  if (!portalId || !portal) return <LoadingSpinner />
  return (
    <div>
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 pt-2">
        <Header
          portalId={portalId}
          vendorLogo={portal.header.vendorLogo || ""}
          customerName={portal.header.customerName}
          customerLogo={portal.header.customerLogo}
          refetchHandler={refetch}
        />
      </div>

      <div className="max-w-12xl mx-auto sm:px-6 lg:px-8 py-2">
        <div className="">
          <CardDivider />
        </div>
      </div>

      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 py-2 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <OpportunityOverview {...portal.opportunityOverview} />
            <ContactsCard data={portal.contacts} numContactsToDisplay={1} narrowLayout />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold pl-4">Overall Engagement</h1>
            <LineChart data={portal.overallEngagement} />
          </div>
        </div>
        <CardDivider />
        <DocumentsCard portalId={portalId} data={portal.documents} refetchHandler={refetch} editingEnabled={true} />
        <CardDivider />
        <StakeholderEngagementCard data={portal.stakeholderEngagement} />
      </div>

      <div className="max-w-12xl mx-auto sm:px-6 lg:px-16 py-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <StakeholderActivityLogCard data={portal.stakeholderActivityLog} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

PortalDetails.authenticate = true
export default PortalDetails
