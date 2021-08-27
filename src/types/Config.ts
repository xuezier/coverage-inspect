export type Config = {
    coverageFilePath?: string;
    exclude?: string[];
    include?: string[];

    enable?: boolean;

    reportHtml?: boolean;
    reportExclude?: string[];
    reportInclude?: string[];
};
