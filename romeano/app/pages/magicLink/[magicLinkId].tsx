import { GetServerSideProps, NotFoundError, Routes } from "blitz"
import db from "db"
import { z } from "zod"

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
  if(!portal) throw new NotFoundError();

  if (portal.id) {
    return {
      redirect: {
        destination: Routes.CustomerPortal({ portalId: portal.id }).pathname.replace('[portalId]',portal.id.toString()),
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
