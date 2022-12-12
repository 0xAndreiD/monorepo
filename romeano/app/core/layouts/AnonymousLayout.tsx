import { ReactNode } from "react"
import { Head } from "blitz"

type LayoutProps = {
  title?: string
  children: ReactNode
}

export const AnonymousLayout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "romeano"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="mt-16">{children}</div>
      </div>
    </>
  )
}

export default AnonymousLayout
