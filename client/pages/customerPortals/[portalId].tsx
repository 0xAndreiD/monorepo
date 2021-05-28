import React from 'react';
import 'tailwindcss/tailwind.css';
import NextStepsCard from "../../components/NextStepsCard";
import DocumentsCard from "../../components/DocumentsCard";
import {ProposalCardDemo} from "../../components/ProposalCard";
import LaunchRoadmap from "../../components/LaunchRoadmap";
import {ProductInfoCard} from "../../components/ProductInfoCard";
import {ContactsCardDemo} from "../../components/ContactsCard";
import {InternalNotesDemo} from "../../components/InternalNotes";
import {Footer} from "../../components/Footer";
import {Header} from "../../components/Header";
import CardDivider from "../../components/generic/Card";
import {gql} from "@apollo/client";
import {useRouter} from 'next/router';
import {usePortalQuery} from "../../src/generated/graphql";
import {APOLLO_CLIENT} from "../../config";


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
                    <ProposalCardDemo/>
                    <ContactsCardDemo/>
                    <InternalNotesDemo/>
                </div>
            </div>
            <div className="pt-4">
                <Footer/>
            </div>
        </div>
    </>;
}
