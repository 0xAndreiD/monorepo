import React from 'react';
import 'tailwindcss/tailwind.css';
import {NextStepsCardDemo} from "../components/NextStepsCard";
import {DocumentsCardDemo} from "../components/DocumentsCard";
import {ProposalCardDemo} from "../components/ProposalCard";
import ProgressStepper from "../components/ProgressStepper";
import {ProductInfoCardDemo} from "../components/ProductInfoCard";
import {ContactsCardDemo} from "../components/ContactsCard";
import {InternalNotesDemo} from "../components/InternalNotes";

export default function CustomerPortal() {
    //container: https://tailwindui.com/components/application-ui/layout/containers
    return <>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4">
            <ProgressStepper/>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-4 bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-4">
                    <NextStepsCardDemo/>
                    <DocumentsCardDemo/>
                    <ProductInfoCardDemo/>
                </div>
                <div className="grid gap-4">
                    <ProposalCardDemo/>
                    <ContactsCardDemo/>
                    <InternalNotesDemo/>
                </div>
            </div>
        </div>
    </>;
}
