import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';
import { promisify } from 'util';
import { Session } from 'inspector';

import * as TestExclude from 'test-exclude';

import { Config } from './types/Config';
import { DateFormat } from './utils/DateFormat';

export class Inspector {
    private session = new Session();

    private filePath = `${process.cwd()}/coverage/tmp`;

    private logger: any;

    private filter = new TestExclude();

    private result: any[] = [];

    private isReportHtml = false;
    private reportExclude: string[] = [];

    constructor (config: Config = {}, logger: any = console) {

        const defaultConfig: Config = {
            coverageFilePath: `${process.cwd()}/coverage/tmp`,
            exclude: [
                'internal/**',
                'node_modules/**',
            ],
            include: [
                'file:**',
            ],
            enable: true,
            reportHtml: false,
            reportExclude: [],
        };

        config = Object.assign(defaultConfig, config);
        const { coverageFilePath, exclude, include, reportHtml, reportExclude } = config;

        if (coverageFilePath)
            this.filePath = coverageFilePath;

        this.logger = logger;

        this.isReportHtml = !!reportHtml;

        this.filter = new TestExclude({
            exclude,
            include: include ? include.map(rule => rule.startsWith('file:') ? rule : `file:/**/${rule.replace(/^\//, '')}`) : include,
        });

        this.reportExclude = reportExclude || [];

        this.session.post = <any>promisify(this.session.post);
        this.session.connect();
    }

    async start () {
        this.logger.info('[coverage] Profiler.enable');
        await this.session.post('Profiler.enable');

        this.logger.info('[coverage] Profiler.startPreciseCoverage');
        await this.session.post('Profiler.startPreciseCoverage', { callCount: true, detailed: true });
    }

    /**
     * @description alias for createCoverage
     * @returns
     */
    async dump () {
        if (!fs.existsSync(this.filePath))
            fs.mkdirSync(this.filePath, { recursive: true });

        const filePath = path.resolve(this.filePath, `coverage-${process.pid}-${DateFormat(new Date())}.json`);

        this.logger.info(`[coverage] dump coverage json data to ${filePath}`);
        fs.writeFileSync(filePath, JSON.stringify({ result: this.result }, null, 2));

        if (this.isReportHtml) {
            const command = `npx`;
            const args = ['c8', 'report', '--all', '-r', 'html', '--exclude=.vscode', '--exclude=typings', '--exclude=coverage', ...this.reportExclude.map(rule => `--exclude=${rule}`)];

            spawnSync(command, args, {
                cwd: process.cwd(),
            });
        }
    }

    async collect () {
        this.logger.info('[coverage] Profiler.takePreciseCoverage');
        const { result } = await <any>this.session.post('Profiler.takePreciseCoverage');

        this.result = [];

        for (const item of result) {
            if (!this.filter.shouldInstrument(item.url)) continue;

            if (item.url.includes('coverage-inspector')) continue;
            this.result.push(item);
        }
    }

    clean () {
        fs.rmdirSync(this.filePath, { recursive: true });
    }
}
