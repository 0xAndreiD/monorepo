import { Link, Routes } from "blitz"
import { HomeIcon } from "@heroicons/react/outline"

export function Header(props: { vendorLogo?: string }) {
  return (
    <div className="grid grid-cols-2 grid-rows-1 items-center">
      {props.vendorLogo && <img alt="vendor logo" src={props.vendorLogo} width={150} height={121} />}

      <div className="flex justify-self-end gap-x-3">
        <button>
          <Link href={Routes.Home()}>
            <div
              className="inline-flex items-center px-3 py-2 border border-gray-300  text-sm
                    leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
            >
              <HomeIcon className="h-4 w-4" />
            </div>
          </Link>
        </button>
      </div>
    </div>
  )
}
