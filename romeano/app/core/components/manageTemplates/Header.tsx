import { Link, Routes } from "blitz"
// import { HomeIcon } from "@heroicons/react/outline"
import HomeIcon from "../../assets/HomeIcon"
import RomeanoLogo from "app/core/assets/RomeanoLogo"
import UserDropDown from "../UserDropDown"

export function Header(props: { vendorLogo?: string }) {
  return (
    <div className="grid grid-cols-2 grid-rows-1 items-center">
      {props.vendorLogo ? (
        <img alt="vendor logo" src={props.vendorLogo} style={{ maxHeight: "50px", maxWidth: "150px", width: "auto" }} />
      ) : (
        <RomeanoLogo alt="Romeano Logo" className="" width={150} height={30} />
      )}

      <div className="flex justify-self-end gap-x-3">
        <UserDropDown {...props} />
      </div>
    </div>
  )
}
