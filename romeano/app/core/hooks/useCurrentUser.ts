import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"

export const useCurrentUser = (portalId: string) => {
  const [user] = useQuery(getCurrentUser, { portalId })
  return user
}
