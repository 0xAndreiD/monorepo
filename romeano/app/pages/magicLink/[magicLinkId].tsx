import { GetServerSideProps, getSession, Routes } from "blitz"
import db, { Role } from "db"
import { z } from "zod"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { magicLinkId } = z.object({ magicLinkId: z.string() }).parse(context.params)
  const magicLink = await db.magicLink.findUnique({
    where: { id: magicLinkId },
    include: {
      userPortal: {
        include: {
          portal: true,
          user: true
        }
      }
    }
  })

  if (!magicLink || magicLink.hasClicked) {
    //TODO: add modal for hasClicked
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  }

  const session = await getSession(context.req, context.res)
  if (magicLink.userPortal) {
    await session.$create({ userId: magicLink.userPortal.userId, role: magicLink.userPortal.user.role as Role })
    await db.magicLink.update({
      where: { id: magicLinkId },
      data: { hasClicked: true }
    })

    switch (magicLink.userPortal.role) {
      case Role.AccountExecutive:
        return {
          redirect: {
            destination: Routes.VendorStats().pathname,
            // destination: Routes.VendorStats(),
            permanent: false
          }
        }
      case Role.Stakeholder:
        return {
          redirect: {
            destination: Routes.CustomerPortal({ portalId: magicLink.userPortal.portalId }).pathname.replace("[portalId]", magicLink.userPortal.portalId.toString()),
            // destination: Routes.CustomerPortal({ portalId: portal.id }),
            permanent: false
          }
        }
    }
  }

  return { props: {} } //no redirect case
}

export default function MagicLinkPage() {
  return <>You found the magic link!</>
}
