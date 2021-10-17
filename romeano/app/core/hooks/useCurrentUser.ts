import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"

export const useCurrentUser = (portalId: number | undefined = undefined) => {
  const [user] = useQuery(getCurrentUser, { portalId })
  return user
}
