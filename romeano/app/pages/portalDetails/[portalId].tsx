import React from 'react';
import 'tailwindcss/tailwind.css';
import DocumentsCard from "app/core/components/portalDetails/DocumentsCard";
import OpportunityOverview from "app/core/components/portalDetails/OpportunityOverview";
import {ContactsCard} from "app/core/components/ContactsCard";
import {Footer} from "app/core/components/Footer";
import {Header} from "app/core/components/portalDetails/Header";
import { CardDivider } from "app/core/components/generic/Card";
import {useRouter} from 'next/router';
import LineChart from "app/core/components/portalDetails/LineChart";
import {StakeholderEngagementDemo} from "app/core/components/portalDetails/StakeholderEngagementDemo";
import {StakeholderActivityLogDemo} from "app/core/components/portalDetails/StakeholderActivityLogDemo";


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
