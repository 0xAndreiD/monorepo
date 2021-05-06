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
    return <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 bg-gray-400">
        <ProgressStepper/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600">
                <NextStepsCardDemo/>
                <DocumentsCardDemo/>
                <ProductInfoCardDemo/>
            </div>
            <div className="bg-red-500">
                <ProposalCardDemo/>
                <ContactsCardDemo/>
                <InternalNotesDemo/>
            </div>
        </div>
    </div>;
}
