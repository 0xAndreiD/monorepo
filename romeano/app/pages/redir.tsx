import { GetServerSideProps, getSession, invokeWithMiddleware, Routes } from "blitz"
import db, { EventType } from "db"
import { z } from "zod"
import createEvent from "../event/mutations/createEvent"

//localhost:3000/redir?portalId=1&eventType=DocumentOpen&url=https://www.google.com
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { portalId, documentId, eventType, url } = z.object({
    portalId: z.string().transform(parseInt),
    eventType: z.nativeEnum(EventType),
    documentId: z.string().transform(parseInt).optional(),
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

  await invokeWithMiddleware(createEvent,{
    type: eventType,
    url,
    documentId,
    portalId,
  }, {req:context.req, res:context.res})

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
