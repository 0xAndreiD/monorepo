import { GetServerSideProps, getSession, Routes } from "blitz"
import db, { Role } from "db"
import { z } from "zod"
import { sendMagicLink } from "../../core/util/email"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { magicLinkId } = z.object({ magicLinkId: z.string() }).parse(context.params)
  const data = await db.magicLink.findFirst({
    where: { id: magicLinkId },
    include: {
      user: {
        include: {
          userPortals: {
            include: {
              portal: true
            }
          }
        }!
      }
    }
  })

  const portal = data?.user.userPortals[0].portal
  if (!data || !portal) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const session = await getSession(context.req, context.res)
  if (portal.id) {
    await session.$create({ userId: data.user.id, role: data.user.role as Role })
    return {
      redirect: {
        destination: Routes.CustomerPortal({ portalId: portal.id }).pathname.replace("[portalId]", portal.id.toString()),
        // destination: Routes.CustomerPortal({ portalId: portal.id }), //FIXME
        permanent: false
      }
    }
  }
  return { props: {} } //no redirect case
}

export default function MagicLinkPage() {
  return <>You found the magic link!</>
}
