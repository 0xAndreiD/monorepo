/* This example requires Tailwind CSS v2.0+ */

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
        date: new Date("Oct 8th"),
        status: CompletionStatus.Complete
    },
    {
        name: 'AR Headset Demo',
        items: ["Demonstrate a live Mira Connect call from headset."],
        date: new Date("Nov 11"),
        status: CompletionStatus.InProgress
    },
    {
        name: 'Use-Case Planning Workshop',
        items: ["Define problem and primary use-case Mira will be used for."],
        status: CompletionStatus.Upcoming
    },
    {name: 'Pilot Package Purchase', items: ["Quote attached below"], status: CompletionStatus.Upcoming},
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function ProgressStepper() {
    return (
        <nav aria-label="Progress">
            <ol className="flex items-center">
                {steps.map((step, stepIdx) => (
                    <li key={step.name}
                        className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
                        <ProgressStepperElement step={step} stepNum={stepIdx + 1}/>
                    </li>
                ))}
            </ol>
        </nav>
    );
}


function ProgressStepperElement({step, stepNum}: { step: ProgressStep, stepNum: number }) {
    switch (step.status) {
        case CompletionStatus.Complete:
            return <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-green-600"/>
                </div>
                <a href="#"
                   className="relative w-8 h-8 flex items-center justify-center bg-green-600 rounded-full hover:bg-green-900"
                >
                    <span className="w-5 h-5 text-white" aria-hidden="true">{stepNum + 1}</span>
                    <br/>
                    <div>{step.name}</div>
                    <ul>
                        {
                            step.items.map((item) => <li>{item}</li>)
                        }
                    </ul>
                </a>
            </>;

        case CompletionStatus.InProgress:
            return <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200"/>
                </div>
                <a href="#"
                   className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-green-600 rounded-full"
                   aria-current="step"
                >
                    <span className="h-2.5 w-2.5 bg-green-600 rounded-full" aria-hidden="true"/>
                    <span className="sr-only">{step.name}</span>
                </a>
            </>;

        case CompletionStatus.Upcoming:
            return <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-200"/>
                </div>
                <a href="#"
                   className="group relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
                >
                  <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300"
                        aria-hidden="true"
                  />
                    <span className="sr-only">{step.name}</span>
                </a>
            </>;
    }
}