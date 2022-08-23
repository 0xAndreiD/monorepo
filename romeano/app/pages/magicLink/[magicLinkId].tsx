import { GetServerSideProps, getSession, NotFoundError } from "blitz"
import db, { Role } from "db"
import { z } from "zod"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { magicLinkId } = z.object({ magicLinkId: z.string().nonempty() }).parse(context.params)
  const magicLink = await db.magicLink.findUnique({ where: { id: magicLinkId } })

  const session = await getSession(context.req, context.res)
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
  // TODO: Remove undefined vendorId when all data is migrated and column is made NON-NULLABLE
  await session.$create({
    userId: magicLink.userId,
    roles: [Role.Stakeholder],
    vendorId: magicLink.vendorId || undefined,
  })
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
