import {useRouter} from "next/router";
import React from "react";
import 'tailwindcss/tailwind.css';
import {ActivePortalsDemo} from "./ActivePortals";
import CardDivider from "../../components/generic/Card";
import {Header} from "./Header";
import {Footer} from "../../components/Footer";
import {OpportunityEngagementDemo} from "./OpportunityEngagementDemo";
import {StakeholderActivityLogDemo} from "./StakeholderActivityLogDemo";

export default function VendorStats() {
    const router = useRouter();
    const {portalId} = router.query;
    // const {data, loading, error} = usePortalQuery({
    //     skip: (typeof portalId !== "string" || !portalId),
    //     variables: {portalId: portalId as string}, //cast should be safe with 'skip'
    //     client: APOLLO_CLIENT,
    // });
    //
    // if (loading) {
    //     return <>Loading!</>;
    // }
    //
    // if (error) {
    //     return <>Error! {JSON.stringify(error)}</>;
    // }
    //
    // if (!portalId || typeof portalId !== "string") {
    //     return <>Wrong Portal Id!</>;
    // }
    //
    // if (!data) {
    //     return <>No Data!</>;
    // }

    return <>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
            <Header/>
            <div className="py-3"><CardDivider/></div>
        </div>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OpportunityEngagementDemo/>
                <StakeholderActivityLogDemo/>
            </div>
            <ActivePortalsDemo/>
        </div>
        <Footer/>
    </>;
}
