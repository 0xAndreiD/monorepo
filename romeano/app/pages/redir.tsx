import { GetServerSideProps, getSession, Routes } from "blitz"
import db, { EventType } from "db"
import { z } from "zod"

//localhost:3000/redir?portalId=1&eventType=DocumentOpen&url=https://www.google.com
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { portalId, eventType, url } = z.object({
    portalId: z.string().transform(parseInt),
    eventType: z.nativeEnum(EventType),
    url: z.string()
  }).parse(context.query)
  const session = await getSession(context.req, context.res)
  if (!session.userId) {
    return {
      redirect: {
        destination: Routes.LoginPage().pathname,
        permanent: false
      }
    }
  }

  //log event
  await db.event.create({
    data: {
      ip: context.req.socket.remoteAddress ?? "0.0.0.0", //null if client disconnects: https://nodejs.org/api/net.html#net_socket_remoteaddress
      type: eventType, //FIXME store other event types,
      url: context.resolvedUrl,
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
