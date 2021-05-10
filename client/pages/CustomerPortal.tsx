import React from 'react';
import 'tailwindcss/tailwind.css';
import {NextStepsCardDemo} from "../components/NextStepsCard";
import {DocumentsCardDemo} from "../components/DocumentsCard";
import {ProposalCardDemo} from "../components/ProposalCard";
import LaunchRoadmap from "../components/LaunchRoadmap";
import {ProductInfoCardDemo} from "../components/ProductInfoCard";
import {ContactsCardDemo} from "../components/ContactsCard";
import {InternalNotesDemo} from "../components/InternalNotes";
import {Footer} from "../components/Footer";
import {Header} from "../components/Header";
import CardDivider from "../components/generic/Card";

export default function CustomerPortal() {
    //container: https://tailwindui.com/components/application-ui/layout/containers
    return <>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
            <Header/>
            <div className="py-3"><CardDivider/></div>
            <LaunchRoadmap/>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                    <NextStepsCardDemo/>
                    <DocumentsCardDemo/>
                    <ProductInfoCardDemo/>
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
