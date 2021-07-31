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
    console.log("Invalid magiclink!!!", magicLink)
    //TODO: add modal for hasClicked
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  const session = await getSession(context.req, context.res)
  if (magicLink.userPortal) {
    await db.magicLink.update({
      where: { id: magicLinkId },
      data: { hasClicked: true }
    })
    await session.$create({ userId: magicLink.userPortal.userId, role: magicLink.userPortal.user.role as Role })
    return {
      redirect: {
        destination: Routes.CustomerPortal({ portalId: magicLink.userPortal.portalId }).pathname.replace("[portalId]", magicLink.userPortal.portalId.toString()),
        // destination: Routes.CustomerPortal({ portalId: portal.id }),
        permanent: false
      }
    }
  }

  //no associated portal, send to user's home
  await session.$create({ userId: magicLink.userId, role: Role.Stakeholder }) //FIXME: check if role is correct
  return {
    redirect: {
      destination: Routes.Home().pathname,
      permanent: false
    }
  }
}

export default function MagicLinkPage() {
  return <>You found the magic link!</>
}
