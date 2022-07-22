import { Fragment, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { UserCircleIcon } from "@heroicons/react/solid"
import Modal from "app/core/components/generic/Modal"
import AddPortalModal from "app/core/components/vendorStats/edit/addPortalModal"
import { Link as BlitzLink, useMutation, Routes } from "blitz"
import logout from "app/auth/mutations/logout"
import { Template } from "db"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function UserDropDown(props: { templates: Template[] }) {
  const [addTemplateProps, setAddTemplateProps] = useState<
    { isOpen: false; templateId: undefined } | { isOpen: true; templateId: number }
  >({
    isOpen: false,
    templateId: undefined,
  })

  const [logoutMutation] = useMutation(logout)
  const user = useCurrentUser()
  return (
    <>
      <Menu as="div" className="relative inline-block text-left" style={{ zIndex: 100 }}>
        <div>
          <Menu.Button className="inline-flex justify-center w-full rounded-md px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
            <UserCircleIcon className="-mr-1 h-6 w-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                <span className="bg-gray-100 text-gray-900 block px-4 py-2 text-xs">
                  Welcome, {user?.firstName} {user?.lastName}
                  <br />
                  {user?.email}
                </span>
              </Menu.Item>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    <BlitzLink href={Routes.Home()}>Home</BlitzLink>
                  </a>
                )}
              </Menu.Item>
            </div>

            {props.templates && (
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => setAddTemplateProps({ isOpen: true, templateId: 1 })}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      Add Portal
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                    >
                      <BlitzLink href={Routes.ManageTemplate()}>Manage Templates</BlitzLink>
                    </a>
                  )}
                </Menu.Item>
              </div>
            )}

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => logoutMutation()}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Logout
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <Modal
        isOpen={addTemplateProps.isOpen}
        onClose={() => setAddTemplateProps({ isOpen: false, templateId: undefined })}
      >
        <AddPortalModal onLinkComplete={async (portalData) => {}} templates={props.templates} />
      </Modal>
    </>
  )
}
