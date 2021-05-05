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
    return <>
        <ProgressStepper/>
        <NextStepsCardDemo/>
        <DocumentsCardDemo/>
        <ProductInfoCardDemo/>

        <ProposalCardDemo/>
        <ContactsCardDemo/>
        <InternalNotesDemo/>
    </>;
}
