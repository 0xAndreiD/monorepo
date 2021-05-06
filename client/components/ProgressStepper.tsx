/* This example requires Tailwind CSS v2.0+ */

import {format} from "date-fns";


enum CompletionStatus {
    Complete,
    InProgress,
    Upcoming
}

type ProgressStep = {
    name: string,
    items: string[],
    date?: Date,
    href?: { body: string, href: string },
    status: CompletionStatus
}
const steps: ProgressStep[] = [
    {
        name: 'Intro Meeting',
        items: ["Go over Mira's platform."],
        date: new Date(2021, 9, 8),
        href: {body: "Mira's Slide Deck", href: "#"},
        status: CompletionStatus.Complete
    },
    {
        name: 'AR Headset Demo',
        items: ["Demonstrate a live Mira Connect call from headset."],
        date: new Date(2021, 10, 11),
        href: {body: "Join Zoom 📞", href: "#"},
        status: CompletionStatus.InProgress
    },
    {
        name: 'Use-Case Planning Workshop',
        items: ["Define problem and primary use-case Mira will be used for."],
        status: CompletionStatus.Upcoming
    },
    {
        name: 'Pilot Package Purchase',
        items: ["Quote attached below"],
        status: CompletionStatus.Upcoming
    },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function ProgressStepper() {

    //className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'flex flex-col items-center relative')}>
    return (
        <nav aria-label="Progress">
            <ul className="flex justify-between py-5">
                {steps.map((step, stepIdx) => (
                    <div className="flex flex-1 flex-col items-center" key={stepIdx}>

                        <ProgressStepperElement step={step} stepNum={stepIdx + 1}/>
                        <div className="text-gray-500 text-xs">
                            {step.date ? format(step.date, "MMM d") : "TBD"}
                        </div>
                        <div className="font-bold text-center">{step.name}</div>
                        <ul className="list-disc pl-7">
                            {
                                step.items.map((item) => <li>{item}</li>)
                            }
                        </ul>
                        <div className="text-center py-3">
                        {
                            step.href && <a className="text-blue-500 underline"
                                            href={step.href.href}>
                                {step.href.body}
                            </a>
                        }
                        </div>
                    </div>
                ))}
            </ul>
        </nav>
    );
}

function ProgressStepperElement({step, stepNum}: { step: ProgressStep, stepNum: number }) {
    switch (step.status) {
        case CompletionStatus.Complete:
            return <>
                {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
                {/*    <div className="h-0.5 w-full bg-green-600"/>*/}
                {/*</div>*/}

                <div
                    className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-green-600 rounded-full"
                    aria-current="step"
                >
                    <span className="text-green-600">{stepNum}</span>
                </div>
            </>;

        case CompletionStatus.InProgress:
            return <>
                {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
                {/*    <div className="h-0.5 w-full bg-gray-200"/>*/}
                {/*</div>*/}
                <div
                    className="relative w-8 h-8 flex items-center justify-center bg-green-600 rounded-full hover:bg-green-900"
                >
                    <span className="text-white">{stepNum}</span>
                </div>
            </>;

        case CompletionStatus.Upcoming:
            return <>
                {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
                {/*    <div className="h-0.5 w-full bg-gray-200"/>*/}
                {/*</div>*/}
                <div
                    className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
                >
                  <span className="bg-transparent rounded-full group-hover:bg-gray-300">
                      {stepNum}
                  </span>
                </div>
            </>;
    }
}