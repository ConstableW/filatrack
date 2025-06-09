"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import TabButton from "./TabButton";

interface Props {
    tabs: string[];
    activeTab?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Tablist(props: Props) {
    const params = useParams();

    if (!props.activeTab)
        props.activeTab = props.tabs[0];

    const [activeTab, setActiveTab] = useState(props.activeTab);

    useEffect(() => {
        if (!window.location.hash)
            return;
        const hash = window.location.hash.slice(1);
        if (props.tabs.find(tab => tab.toLowerCase() === hash.toLowerCase())) {
            setActiveTab(props.tabs.find(tab => tab.toLowerCase() === hash.toLowerCase())!);
        }
    }, [params]);

    return (<>
        <div className={`flex gap-1 overflow-x-auto bg-bg-light px-2 py-1 rounded-lg ${props.className}`}>
            {props.tabs.map(tab => (
                <TabButton
                    key={tab}
                    active={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                >{tab}</TabButton>
            ))}
        </div>

        {React.Children.map(props.children, child => {
            if (React.isValidElement(child)) {
                const childElement = child as React.ReactElement<any>;
                const props = childElement.props as { [key: string]: any };
                if (props["data-tab"] === activeTab || props.name === activeTab) {
                    return child;
                }
            }
        })}
    </>);
}
