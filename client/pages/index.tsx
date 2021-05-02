import React from 'react';
import 'tailwindcss/tailwind.css';
import {NextStepsCardDemo} from "../components/NextStepsCard";
import {DocumentsCardDemo} from "../components/DocumentsCard";
import {ProposalCardDemo} from "../components/ProposalCard";
import ProgressStepper from "../components/ProgressStepper";

export default function Home() {
    return <>
        {/*<ProgressStepper/>*/}
        {/*<NextStepsCardDemo/>*/}
        {/*<DocumentsCardDemo/>*/}
        <ProposalCardDemo/>
    </>;
}
