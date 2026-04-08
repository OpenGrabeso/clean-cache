import { error } from '@actions/core';
import { exit } from 'node:process';

import { cleanCaches } from './common.js';

(async () => {
    await cleanCaches(false);
})().then().catch((e) => {
    error(e);
    exit(1);
});
