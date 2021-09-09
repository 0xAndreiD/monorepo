import { GetServerSideProps, getSession, invokeWithMiddleware, Routes } from "blitz"
import db, { EventType } from "db"
import { z } from "zod"
import createEvent, { CreateEvent } from "../event/mutations/createEvent"

//localhost:3000/redir?portalId=1&eventType=DocumentOpen&url=https://www.google.com
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { portalId, linkId, type, url } = z
    .object({
      portalId: z.string().transform(parseInt),
      type: z.nativeEnum(EventType),
      url: z.string(),
      linkId: z.string().transform(parseInt).optional(),
    })
    .parse(context.query)
  const session = await getSession(context.req, context.res)
  if (!session.userId) {
    return {
      redirect: {
        destination: Routes.LoginPage().pathname,
        permanent: false,
      },
    }
  }

  await invokeWithMiddleware(
    createEvent,
    {
      type,
      url,
      linkId,
      portalId,
    },
    { req: context.req, res: context.res }
  )

  return {
    redirect: {
      destination: url,
      permanent: false,
    },
  }
}

export default function RedirectPage() {
  return <>You found the redirect page!</>
}
