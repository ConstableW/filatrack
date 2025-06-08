import React from "react";

export default function Skeleton({ width, height, ...props }:
    { width: number, height: number } & React.HTMLAttributes<HTMLDivElement>) {
    return (<div {...props} className={`bg-bg-light rounded-lg ${props.className}`} style={{ width, height }} />);
}
