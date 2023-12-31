import React, { useState } from "react"
import "tailwindcss/tailwind.css"

import { ActivePortals } from "app/core/components/vendorStats/ActivePortals"
import { OpportunityEngagement } from "app/core/components/vendorStats/OpportunityEngagement"
import { StakeholderActivity } from "app/core/components/vendorStats/StakeholderActivity"
import { Link, Routes, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import getTemplates from "app/vendor-stats/queries/getTemplates"
import getVendorStats from "app/vendor-stats/queries/getVendorStats"
import { encodeHashId } from "app/core/util/crypto"
import Modal from "app/core/components/generic/Modal"
import AddTemplateModal from "app/core/components/vendorStats/edit/addTemplateModal"

function VendorStats() {
  const [vendorStats, { refetch }] = useQuery(getVendorStats, {}, { refetchOnWindowFocus: true })
  const [templates] = useQuery(getTemplates, {}, { refetchOnWindowFocus: true })
  const [addTemplateProps, setAddTemplateProps] = useState<{ isOpen: false } | { isOpen: true }>({
    isOpen: false,
  })
  console.log("ActivePortals", vendorStats.activePortals, templates)
  return templates?.templates?.length > 0 || vendorStats.activePortals?.length > 0 ? (
    <div className="">
      <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-16">
        <OpportunityEngagement data={vendorStats.opportunityEngagement} />
        <StakeholderActivity data={vendorStats.stakeholderActivityLog} />
      </div>
      <div style={{ backgroundColor: "#F7F7F9" }}>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div style={{ backgroundColor: "#F7F7F9" }}>
            <ActivePortals
              defaultPortalId={vendorStats.defaultPortal?.id}
              data={vendorStats.activePortals}
              templates={templates.templates}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div className="grid grid-cols-1 gap-y-4 gap-x-8 mb-16">
        <div className="py-10 mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">Welcome to Romeano!</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">You have no portals created yet.</p>
          <div className="mt-8 flex gap-x-4 sm:justify-center">
            {vendorStats.defaultPortal && (
              <Link href={Routes.CustomerPortal({ portalId: encodeHashId(vendorStats.defaultPortal.id) })}>
                <button className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-green-900/10 hover:ring-green-900/20">
                  Preview Demo Portal{" "}
                  <span className="text-green-400 ml-2" aria-hidden="true">
                    →
                  </span>
                </button>
              </Link>
            )}
            <a
              href="#"
              onClick={() => setAddTemplateProps({ isOpen: true })}
              className="inline-block rounded-lg bg-green-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-green-600 hover:bg-green-700 hover:ring-green-700"
            >
              Create Template
            </a>
          </div>
        </div>
      </div>
      {/* <Modal
        isOpen={addTemplateProps.isOpen}
        onClose={() => setAddTemplateProps({ isOpen: false, templateId: undefined })}
      >
        <AddPortalModal onLinkComplete={async (portal) => {}} templates={templates.templates} />
      </Modal> */}
      <Modal isOpen={addTemplateProps.isOpen} onClose={() => setAddTemplateProps({ isOpen: false })}>
        <AddTemplateModal onLinkComplete={async (portalData) => {}} />
      </Modal>
    </div>
  )
}

VendorStats.authenticate = true
VendorStats.getLayout = (page: React.ReactChild) => <Layout title="Vendor Stats">{page}</Layout>
export default VendorStats
