import ReactSkeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Skeleton({ width, height, count }: { width: number, height: number, count: number }) {
    return (
        <ReactSkeleton
            containerClassName={`flex-1 leading-none max-w-[${width}px] max-h-[${height}px]`}
            width={width}
            height={height}
            count={count}
            enableAnimation
            baseColor="var(--color-bg-light)"
            highlightColor="var(--color-bg-lighter)"
        />
    );
}
