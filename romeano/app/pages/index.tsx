import { BlitzPage, Link, Routes, useQuery, useRouter } from "blitz"

import React from "react"
import "tailwindcss/tailwind.css"
import { Card, CardDivider, CardHeader } from "app/core/components/generic/Card"
import { Header } from "app/core/components/vendorStats/Header"
import { Footer } from "app/core/components/Footer"
import getPortalList from "../customer-portals/queries/getPortalList"
import { getName } from "../core/util/text"
import { CheckIcon, QuestionMarkCircleIcon, XIcon } from "@heroicons/react/solid"
import { useCurrentUser } from "../core/hooks/useCurrentUser"
import VendorStats from "./vendorStats"
import { StyledLink } from "app/core/components/generic/Link"

function PortalsList() {
  const [portalsList] = useQuery(getPortalList, null)
  return <>
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <Header />
      <div className="py-3"><CardDivider /></div>
    </div>
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
      <Card>
        <CardHeader>
          My Portals
        </CardHeader>
        <div className="flex flex-col pt-4">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Vendor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Primary Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Portal
                    </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {
                    portalsList.map((portal, idx) =>
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {portal.vendorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StyledLink
                            href={`mailto:${portal.email}`}>{getName(portal.firstName, portal.lastName)}</StyledLink>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {
                            portal.hasStakeholderApproved === true ?
                              <span
                                className="flex items-center justify-center h-5 w-5 text-green-800 font-medium bg-green-100 rounded-full">
                                  <CheckIcon className="h-4 w-4" />
                                </span>
                              : portal.hasStakeholderApproved === false ?
                                <span
                                  className="flex items-center justify-center h-5 w-5 text-red-800 font-medium bg-red-100 rounded-full">
                                    <XIcon className="h-4 w-4" />
                                  </span>
                                : <span
                                  className="flex items-center justify-center h-5 w-5 text-gray-500 font-medium bg-gray-100 rounded-full">
                                      <QuestionMarkCircleIcon className="h-4 w-4" />
                                    </span>
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={Routes.CustomerPortal({ portalId: portal.portalId })}>
                            <a
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              View Portal
                            </a>
                          </Link>
                        </td>
                      </tr>
                    )
                  }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
    <Footer />
  </>
}

const Home: BlitzPage = () => {
  // useAuthorize()
  const router = useRouter()
  const user = useCurrentUser()
  console.log("the user", user)
  if (!user) return <>no user found :(</>

  if (user.accountExecutive) {
    return <VendorStats />
  } else if (user.stakeholder &&
    user.userPortals?.length === 1) {
    router.push(Routes.CustomerPortal({ portalId: user.userPortals[0] }))
    return <>Loading Portal!</>
  } else if (user.stakeholder) {
    return <PortalsList />
  } else {
    return <>Sorry, could not pull up your use details :(</>
  }
}

// Home.suppressFirstRenderFlicker = true
Home.authenticate = true
// Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
