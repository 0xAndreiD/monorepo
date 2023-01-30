import createEvent from "app/event/mutations/createEvent"
import { GetServerSideProps, getSession, invoke, NotFoundError } from "blitz"
import db, { EventType, Role } from "db"
import { z } from "zod"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { magicLinkId } = z.object({ magicLinkId: z.string().nonempty() }).parse(context.params)
  const magicLink = await db.magicLink.findUnique({ where: { id: magicLinkId } })

  const session = await getSession(context.req, context.res)
  console.log("Session in MagicLink", session, magicLink)
  if (!magicLink) throw new NotFoundError("Magiclink not found")

  if (!session.userId && magicLink.hasClicked) {
    console.log("Invalid magiclink!", magicLink)
    //TODO: add modal for hasClicked
    return {
      redirect: {
        destination: magicLink.destUrl,
        permanent: false,
      },
    }
  }

  //hasClicked but valid magiclink + cookie should still redirect to destUrl
  await db.magicLink.update({
    where: { id: magicLinkId },
    data: { hasClicked: true },
  })
  await session.$create({
    userId: magicLink.userId!,
    roles: [Role.Stakeholder],
    vendorId: magicLink.vendorId!,
  })
  // Track this event - magic link clicked, session created, stakeholder logged in.
  const portalEncId = magicLink.destUrl.split("/customerPortals/")?.[1]
  invoke(createEvent, { type: EventType.StakeholderLogin, portalId: portalEncId })
  return {
    redirect: {
      destination: magicLink.destUrl,
      permanent: false,
    },
  }
}

export default function MagicLinkPage() {
  return <>You found the magic link!</>
}
