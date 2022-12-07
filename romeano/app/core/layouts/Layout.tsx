import { ReactNode, Suspense } from "react"
import { Head, invoke, queryClient, useQuery, useSession } from "blitz"
import stopImpersonating from "app/auth/mutations/stopImpersonating"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { ArrowCircleRightIcon, ExclamationIcon } from "@heroicons/react/outline"
import getTemplates from "app/vendor-stats/queries/getTemplates"
import getVendorStats from "app/vendor-stats/queries/getVendorStats"
import getPortalList from "app/customer-portals/queries/getPortalList"
import { AppHeader } from "../components/AppHeader"
import { CardDivider } from "../components/generic/Card"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const ImpersonatingUserNotice = () => {
  const session = useSession()
  if (!session.impersonatingFromUserId) return null

  return (
    <div className="bg-yellow-300 p-3 text-center font-semibold text-sm">
      <ExclamationIcon className="w-5 h-5 inline mr-2" />
      Currently impersonating another user
      <button
        className="ml-4 bg-red-600 text-white uppercase rounded px-2 py-1"
        onClick={async () => {
          await invoke(stopImpersonating, {})
          queryClient.clear()
        }}
      >
        Exit
      </button>
    </div>
  )
}

const Layout = ({ title, children }: LayoutProps) => {
  const [vendorStats] = useQuery(getVendorStats, {}, { refetchOnWindowFocus: false })
  const [templates] = useQuery(getTemplates, {}, { refetchOnWindowFocus: false })
  const [portalsList, { refetch }] = useQuery(getPortalList, null)
  return (
    <>
      <Head>
        <title>{title || "romeano"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ImpersonatingUserNotice />
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <AppHeader
          vendorLogo={vendorStats.header.vendorLogo || ""}
          templates={templates.templates}
          refetchHandler={refetch}
        />
        <div className="mt-10">{children}</div>
      </div>
    </>
  )
}

export default Layout
