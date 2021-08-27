# Coverage Inspect

Node.js Runing code coverage inspect.

## Installation
```bash
yarn add coverage-inspect

npm install coverage-inspect [--save]
```


## Usage

```ts
impprt { Inspector } from 'coverage-inspect';

const inspector = new Inspector(config: Config);

inspector.start();  // start code coverage check

....

inspector.collect(); // coverage collect

inspector.dump(); // dump coverage data, file will dump to path: ${project}/coverage/tmp
```

### Type Config

```ts
type Config = {
    exclude?: string[];  // file exclude, default: ['internal/**', 'node_modules/**']
    include?: string[];  // file include, default: ['file:**']

    enable?: boolean;    // enable code coverage inspect?, default: true

    reportHtml?: boolean;// convert dump data to html, default: false
    reportInclude?: string[];// report include file dirs, default: []
    reportExclude?: string[];// report exclude file dirs, default: []
}
```