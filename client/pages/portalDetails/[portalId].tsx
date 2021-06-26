import React from 'react';
import 'tailwindcss/tailwind.css';
import DocumentsCard from "../../components/portalDetails/DocumentsCard";
import OpportunityOverview from "../../components/portalDetails/OpportunityOverview";
import {ContactsCard} from "../../components/ContactsCard";
import {Footer} from "../../components/Footer";
import {Header} from "../../components/portalDetails/Header";
import CardDivider from "../../components/generic/Card";
import {gql} from "@apollo/client";
import {useRouter} from 'next/router';
import {usePortalQuery} from "../../src/generated/graphql";
import {APOLLO_CLIENT} from "../../config";
import LineChart from "../../components/portalDetails/LineChart";
import {StakeholderEngagementDemo} from "../../components/portalDetails/StakeholderEngagementDemo";
import {StakeholderActivityLogDemo} from "../../components/portalDetails/StakeholderActivityLogDemo";


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
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <OpportunityOverview data={data.getLaunchRoadmap}/>
                    <ContactsCard data={data.getContactsCard}
                                  numContactsToDisplay={1}
                                  narrowLayout/>
                </div>
                <div className="flex flex-col gap-4">
                    <LineChart/>
                </div>
            </div>
            <CardDivider/>
            <DocumentsCard portalId={portalId} data={data.getDocuments}/>
            <CardDivider/>
            <StakeholderEngagementDemo/>
            <StakeholderActivityLogDemo/>
            <Footer/>
        </div>
    </>;
}