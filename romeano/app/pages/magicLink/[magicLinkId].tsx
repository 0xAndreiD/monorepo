import { GetServerSideProps, getSession, Routes } from "blitz"
import db, { Role } from "db"
import { z } from "zod"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { magicLinkId } = z.object({ magicLinkId: z.string() }).parse(context.params)
  const magicLink = await db.magicLink.findFirst({
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

  const portal = magicLink?.user.userPortals[0].portal
  if (!magicLink || magicLink.hasClicked || !portal) {
    //TODO: add modal for hasClicked
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  }

  const session = await getSession(context.req, context.res)
  if (portal.id) {
    await session.$create({ userId: magicLink.user.id, role: magicLink.user.role as Role })
    await db.magicLink.update({
      where: { id: magicLinkId },
      data: { hasClicked: true }
    })
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
