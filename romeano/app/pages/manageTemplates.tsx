import React, { ReactChild } from "react"
import "tailwindcss/tailwind.css"
import { CardDivider } from "app/core/components/generic/Card"
import { useQuery } from "blitz"
import getTemplates from "app/vendor-stats/queries/getTemplates"
import getVendorStats from "app/vendor-stats/queries/getVendorStats"
import { TemplateList } from "app/core/components/manageTemplates/TemplateList"
import Layout from "app/core/layouts/Layout"
import getPortalList from "app/customer-portals/queries/getPortalList"

function ManageTemplate() {
  const [templates] = useQuery(getTemplates, {}, { refetchOnWindowFocus: false })
  return (
    <>
      <TemplateList data={templates.templates} />
    </>
  )
}

ManageTemplate.authenticate = true
ManageTemplate.getLayout = (page: ReactChild) => <Layout title="Manage Templates">{page}</Layout>
export default ManageTemplate
