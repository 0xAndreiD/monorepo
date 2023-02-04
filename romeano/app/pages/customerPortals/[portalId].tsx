import "tailwindcss/tailwind.css"
import NextStepsCard from "app/core/components/customerPortals/NextStepsCard"
import DocumentsCard from "app/core/components/customerPortals/DocumentsCard"
import { ProposalCard } from "app/core/components/customerPortals/ProposalCard"
import LaunchRoadmap from "app/core/components/customerPortals/LaunchRoadmap"
import { ProductInfoCard } from "app/core/components/customerPortals/ProductInfoCard"
import { ContactsCard } from "app/core/components/ContactsCard"
import { LoadingSpinner } from "app/core/components/LoadingSpinner"
import { Header } from "app/core/components/customerPortals/Header"
import { CardDivider } from "app/core/components/generic/Card"
import { Link, Routes, useParam, useQuery, useSession } from "blitz"
import getCustomerPortal from "../../customer-portals/queries/getCustomerPortal"
import StakeholderLoginForm from "../../auth/components/StakeholderLoginForm"
import Layout from "app/core/layouts/Layout"
import SaveTemplateModal from "app/core/components/customerPortals/edit/saveTemplateModal"
import Modal from "app/core/components/generic/Modal"
import { useState } from "react"
import { decodeHashId } from "app/core/util/crypto"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { EventType, Role } from "@prisma/client"
import createEvent from "app/event/mutations/createEvent"
import { invoke } from "blitz"

function CustomerPortal() {
  const portalId = useParam("portalId", "string")!
  const session = useSession()
  const [addTemplateProps, setAddTemplateProps] = useState<
    { isOpen: false; templateId: undefined } | { isOpen: true; templateId: number }
  >({
    isOpen: false,
    templateId: undefined,
  })
  // const user = useCurrentUser()
  const [data, { refetch }] = useQuery(
    getCustomerPortal,
    { portalId },
    {
      refetchOnWindowFocus: false,
      enabled: !!portalId && !session.isLoading && !!session.userId,
    }
  )
  console.log("Session...", session)
  if (!session.isLoading && !session.userId) {
    return <StakeholderLoginForm />
  }

  if (!portalId || !data) {
    return <LoadingSpinner />
  }

  // Track portal open event if user is stakeholder
  if (!session.isLoading && session.roles?.includes(Role.Stakeholder)) {
    console.log("Tracking stakeholder portal access event")
    invoke(createEvent, { type: EventType.StakeholderPortalOpen, portalId: portalId })
  }

  //container: https://tailwindui.com/components/application-ui/layout/containers
  return (
    <>
      {session.roles?.includes(Role.AccountExecutive) && (
        <div className="bg-yellow-100 -mt-16 px-2 py-4 mb-2">
          <div className="grid grid-cols-2">
            <div className="text-sm py-2">
              <span>You are previewing {data.header.customerName} customer portal.</span>
            </div>
            <div className="flex justify-end">
              <div className="inline-flex flex px-2 gap-2">
                {!data.isGlobal && (
                  <Link href={Routes.EditCustomerPortal({ portalId: portalId })}>
                    <button
                      className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm
                        leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Edit Portal
                    </button>
                  </Link>
                )}

                {data.isGlobal && (
                  <button
                    className="inline-flex items-center px-2 py-2 border border-gray-300 text-sm
                      leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => setAddTemplateProps({ isOpen: true, templateId: decodeHashId(portalId) })}
                  >
                    Save as Template
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Header
        template={data.template}
        portalId={portalId}
        vendorLogo={data.header.vendorLogo || ""}
        customerName={data.header.customerName}
        customerLogo={data.header.customerLogo}
        data={data.proposal.stakeholders}
        editingEnabled={false}
        refetchHandler={refetch}
      />
      <CardDivider />
      <LaunchRoadmap
        portalId={portalId}
        refetchHandler={refetch}
        editingEnabled={false}
        stageData={data.launchRoadmap.stages}
        currentRoadmapStage={data.launchRoadmap.currentRoadmapStage}
      />

      {/* <div className="max-w-8xl mx-40 bg-gray-100"> */}
      <div className="max-w-12xl mx-auto py-2 bg-gray-100">
        <div className="max-w-6xl lg:px-8 mx-auto mt-10 mb-10 grid grid-cols-1 md:grid-cols-2 gap-9">
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
      </div>
      {/* </div> */}

      <Modal
        isOpen={addTemplateProps.isOpen}
        onClose={() => setAddTemplateProps({ isOpen: false, templateId: undefined })}
      >
        <SaveTemplateModal
          portalId={portalId}
          onLinkComplete={async () => {
            setAddTemplateProps({ isOpen: false, templateId: undefined })
          }}
        />
      </Modal>
    </>
  )
}

// CustomerPortal.authenticate = true
CustomerPortal.getLayout = (page: React.ReactChild) => <Layout title={`Customer Portal`}>{page}</Layout>
export default CustomerPortal
