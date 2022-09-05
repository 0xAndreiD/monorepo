import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { SiteRole } from "@prisma/client"

export const useCurrentUser = (portalId?: string) => {
  const [user] = useQuery(getCurrentUser, { portalId })
  return {
    ...user,
    canImpersonate: user.email?.endsWith("@romeano.com") && user.roles?.includes(SiteRole.SiteAdmin),
  }
}
