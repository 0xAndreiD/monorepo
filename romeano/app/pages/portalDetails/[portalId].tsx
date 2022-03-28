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

function PortalDetails() {
  const portalId = useParam("portalId", "number")
  const [portal, { refetch }] = useQuery(
    getPortalDetail,
    { portalId },
    { refetchOnWindowFocus: false, enabled: !!portalId }
  )

  //container: https://tailwindui.com/components/application-ui/layout/containers
  if (!portalId || !portal) return <>Loading!</>
  return (
    <div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-4">
        <Header
          portalId={portalId}
          vendorLogo={portal.header.vendorLogo}
          customerName={portal.header.customerName}
          customerLogo={portal.header.customerLogo}
          refetchHandler={refetch}
        />
        <div className="pt-3">
          <CardDivider />
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <OpportunityOverview {...portal.opportunityOverview} />
            <ContactsCard data={portal.contacts} numContactsToDisplay={1} narrowLayout />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold pl-4">Overall Engagement</h1>
            <LineChart data={portal.overallEngagement} />
          </div>
        </div>
        <CardDivider />
        <DocumentsCard portalId={portalId} data={portal.documents} />
        <CardDivider />
        <StakeholderEngagementCard data={portal.stakeholderEngagement} />
      </div>
      <div style={{ backgroundColor: "#F7F7F9" }}>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div style={{ backgroundColor: "#F7F7F9" }}>
            <StakeholderActivityLogCard data={portal.stakeholderActivityLog} />
          </div>
        </div>
      </div>
      <Footer gray={true} />
    </div>
  )
}

PortalDetails.authenticate = true
export default PortalDetails
