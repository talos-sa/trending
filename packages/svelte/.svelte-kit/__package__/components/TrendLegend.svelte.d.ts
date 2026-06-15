type $$ComponentProps = {
    series: {
        id: number;
        name: string;
        color: string;
        unit?: string;
        visible: boolean;
    }[];
    onToggleSeries: (seriesId: number) => void;
};
declare const TrendLegend: import("svelte").Component<$$ComponentProps, {}, "">;
type TrendLegend = ReturnType<typeof TrendLegend>;
export default TrendLegend;
//# sourceMappingURL=TrendLegend.svelte.d.ts.map