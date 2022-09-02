import { ReactNode, Suspense } from "react"
import { Head, invoke, queryClient, useSession } from "blitz"
import stopImpersonating from "app/auth/mutations/stopImpersonating"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { ArrowCircleRightIcon, ExclamationIcon } from "@heroicons/react/outline"

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
  return (
    <>
      <Head>
        <title>{title || "romeano"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ImpersonatingUserNotice />
      {children}
    </>
  )
}

export default Layout
