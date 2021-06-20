import { GetServerSideProps, getSession, Routes } from "blitz"
import db, { EventType } from "db"
import { z } from "zod"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { portalId, url } = z.object({ portalId: z.number(), url: z.string() }).parse(context.params)
  const session = await getSession(context.req, context.res)
  if (!session.userId) {
    return {
      redirect: {
        destination: Routes.LoginPage().pathname,
        permanent: false
      }
    }
  }
  db.event.create({
    data: {
      ip: context.req.socket.remoteAddress ?? "0.0.0.0", //null if client disconnects: https://nodejs.org/api/net.html#net_socket_remoteaddress
      type: EventType.DocumentOpen,
      documentId: undefined,
      portalId,
      userId: session.userId
    }
  })

  return {
    redirect: {
      destination: decodeURI(url),
      permanent: false
    }
  }
}

export default function RedirectPage() {
  return <>You found the redirect page!</>
}
