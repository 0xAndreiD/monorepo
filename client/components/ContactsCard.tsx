import {MailIcon} from "@heroicons/react/outline";
import {Card, CardHeader} from "./generic/Card";
import {titleCase} from "../util/text";
import Link from 'next/link';

type ContactCard = {
    contacts: Array<{
        name: string
        email: string
        role: string
        imageUrl: string
    }>
}

//idx is 0 based
//from: https://en.wikipedia.org/wiki/Ordinal_numeral#English
function getPrecedence(idx: number): string | undefined {
    const nums = ["primary", "secondary", "tertiary", "quaternary"];
    return nums[idx];
}

export function ContactsCardDemo() {
    const data: ContactCard = {
        contacts: [
            {
                name: 'Greg Miller',
                email: 'greg@mira.com',
                role: 'Account Executive',
                imageUrl:
                    'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1002&q=80',
            }, {
                name: 'Alexis Linton',
                email: 'alexis@mira.com',
                role: 'Customer Success Manager',
                imageUrl:
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            },
        ]
    };
    return <ContactsCard {...data}/>;
}

export default function ContactsCard(props: ContactCard) {
    return <Card>
        <CardHeader>Contacts</CardHeader>
        <div className="divide-y divide-gray-300">
            {
                props.contacts.map((contact, idx) =>
                    <div className="py-3" key={idx}>
                        <div className="text-sm text-gray-600 pb-2">{titleCase(getPrecedence(idx) ?? "")}:</div>
                        <div className="relative bg-white flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src={contact.imageUrl} alt=""/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900">{contact.name}</p>
                                <p className="text-sm truncate">{contact.role}</p>
                            </div>
                            <Link href={`mailto:${contact.email}`}>
                                <div
                                    className="w-10 h-10 border-2 flex items-center justify-center border-grey-600 rounded-full ">
                                    <MailIcon className="h-4 w-4 text-gray-400"/>
                                </div>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
    </Card>;
}