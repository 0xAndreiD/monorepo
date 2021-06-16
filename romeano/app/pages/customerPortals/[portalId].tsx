import React from 'react';
import 'tailwindcss/tailwind.css';
import NextStepsCard from "app/core/components/NextStepsCard";
import DocumentsCard from "app/core/components/DocumentsCard";
import {ProposalCard} from "app/core/components/ProposalCard";
import LaunchRoadmap from "app/core/components/customerPortals/LaunchRoadmap";
import {ProductInfoCard} from "app/core/components/ProductInfoCard";
import {ContactsCard} from "app/core/components/ContactsCard";
import {InternalNotes} from "app/core/components/InternalNotes";
import {Footer} from "app/core/components/Footer";
import {Header} from "app/core/components/customerPortals/Header";
import { CardDivider } from "app/core/components/generic/Card";
import {useRouter} from 'next/router';
const CLIENT_QUERY = gql`
    query portal($portalId: ID!) {
        getLaunchRoadmap(id: $portalId) {
            heading
            date
            tasks
            ctaLink {
                body
                href
            }
            status
        }

        getNextSteps(id: $portalId) {
            customer {
                ...CompanyTaskListFragment
            }
            vendor {
                ...CompanyTaskListFragment
            }
        }

        getDocuments(id: $portalId) {
            customer {
                name
                documents {
                    ...DocumentsListFragment
                }
            }
            vendor {
                name
                documents {
                    ...DocumentsListFragment
                }
            }
        }
        getProductInfo(id: $portalId) {
            images
            sections {
                heading
                links {
                    body
                    href
                }
            }
        }
        getProposalCard(id: $portalId) {
            heading
            subheading
            quoteLink
            stakeholders {
                name
                jobTitle
                email
                isApprovedBy
            }
        }
        getContactsCard(id: $portalId) {
            contacts {
                name
                jobTitle
                email
                photoUrl
            }
        }
        getInternalNotes(id: $portalId) {
            users {
                id
                name
            }
            messages {
                id
                user
                body
                timestamp
            }
        }
    }

    fragment DocumentsListFragment on PortalDocument {
        id
        title
        href
        isCompleted
    }

    fragment CompanyTaskListFragment on CompanyTaskList {
        name
        tasks {
            id
            description
            isCompleted
        }
    }
`;

export default function CustomerPortal() {
    const router = useRouter();
    const {portalId} = router.query;
    const {data, loading, error} = usePortalQuery({
        skip: (typeof portalId !== "string" || !portalId),
        variables: {portalId: portalId as string}, //cast should be safe with 'skip'
        client: APOLLO_CLIENT,
    });

    if (loading) {
        return <>Loading!</>;
    }

    if (error) {
        return <>Error! {JSON.stringify(error)}</>;
    }

    if (!portalId || typeof portalId !== "string") {
        return <>Wrong Portal Id!</>;
    }

    if (!data) {
        return <>No Data!</>;
    }

    //container: https://tailwindui.com/components/application-ui/layout/containers
    return <>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
            <Header/>
            <div className="py-3"><CardDivider/></div>
            <LaunchRoadmap data={data.getLaunchRoadmap}/>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <NextStepsCard data={data.getNextSteps}/>
                    <DocumentsCard portalId={portalId} data={data.getDocuments}/>
                    <ProductInfoCard data={data.getProductInfo}/>
                </div>
                <div className="flex flex-col gap-4">
                    <ProposalCard data={data.getProposalCard}/>
                    <ContactsCard data={data.getContactsCard}/>
                    <InternalNotes data={data.getInternalNotes}/>
                </div>
            </div>
            <div className="pt-4">
                <Footer/>
            </div>
        </div>
    </>;
}
