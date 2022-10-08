import { Fragment, useState } from "react"
import { Menu, Transition } from "@headlessui/react"
import { UserCircleIcon } from "@heroicons/react/solid"
import Modal from "app/core/components/generic/Modal"
import AddPortalModal from "app/core/components/vendorStats/edit/addPortalModal"
import AddTemplateModal from "app/core/components/vendorStats/edit/addTemplateModal"
import { Link as BlitzLink, useMutation, Routes, queryClient } from "blitz"
import logout from "app/auth/mutations/logout"
import { SiteRole, Template } from "db"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import LabeledTextField from "./LabeledTextField"
import Form, { FORM_ERROR } from "./Form"
import impersonateUser, { ImpersonateUserInput } from "app/auth/mutations/impersonateUser"
import { ArrowCircleRightIcon, ArrowsExpandIcon } from "@heroicons/react/outline"
import SwitchUserModal from "app/auth/components/SwitchUserModal"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function UserDropDown(props: { templates: Template[] }) {
  const [addPortalProps, setAddPortalProps] = useState<{ isOpen: boolean; templateId: number | undefined }>({
    isOpen: false,
    templateId: undefined,
  })
  const [addTemplateProps, setAddTemplateProps] = useState<{ isOpen: boolean }>({
    isOpen: false,
  })
  const [isSwitcherModalOpen, setIsSwitcherModalOpen] = useState(false)
  const [logoutMutation] = useMutation(logout)
  const user = useCurrentUser()
  return (
    <>
      <Menu as="div" className="relative inline-block text-left" style={{ zIndex: 100 }}>
        <div>
          <Menu.Button className="bg-gray-100 inline-flex justify-center w-full rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
            <span className="text-gray-900 block px-4 py-2 text-xs">
              {user?.firstName} {user?.lastName}
            </span>
            {user?.photoUrl ? (
              <img
                className="rounded-full"
                src={user.photoUrl}
                width={30}
                height={30}
                style={{ width: "30px", height: "30px", marginTop: "1px" }}
              />
            ) : (
              <UserCircleIcon className="h-7 w-7" aria-hidden="true" />
            )}
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
                <div className="flex justify-between">
                  <span className="text-gray-900 block px-4 py-2 text-sm">{user?.email}</span>
                  {user.canImpersonate && (
                    <span className="mt-2 pr-4">
                      <a
                        href="#"
                        onClick={() => {
                          setIsSwitcherModalOpen(true)
                        }}
                        className="text-blue-600"
                      >
                        <ArrowCircleRightIcon className="w-5 h-5" />
                      </a>
                    </span>
                  )}
                </div>
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

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => setAddTemplateProps({ isOpen: true })}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Create Template
                  </a>
                )}
              </Menu.Item>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => setAddPortalProps({ isOpen: true, templateId: 1 })}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm"
                    )}
                  >
                    Add Portal
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
      <Modal isOpen={addPortalProps.isOpen} onClose={() => setAddPortalProps({ isOpen: false, templateId: undefined })}>
        <AddPortalModal onLinkComplete={async (portalData) => {}} templates={props.templates} />
      </Modal>
      <Modal isOpen={addTemplateProps.isOpen} onClose={() => setAddTemplateProps({ isOpen: false })}>
        <AddTemplateModal onLinkComplete={async (portalData) => {}} />
      </Modal>

      {user.canImpersonate && (
        <Modal isOpen={isSwitcherModalOpen} onClose={() => setIsSwitcherModalOpen(false)}>
          <SwitchUserModal />
        </Modal>
      )}
    </>
  )
}
