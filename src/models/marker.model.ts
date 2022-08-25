export type MarkerModel = {
    count: number;
    label: string;
    scans: ScanModel[];
    wd: string;
}

export type ScanModel = {
    id: string;
    title: string;
    url: string;
    description: string;
}