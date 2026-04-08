const {error} = require("@actions/core");
const {exit} = require("node:process");
const { cleanCaches } = require('./common');

(async () => {
    await cleanCaches(true);
})().then().catch((e) => {
    error(e);
    exit(1);
});
