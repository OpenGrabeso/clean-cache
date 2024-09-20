const { cleanCaches } = require('./common');
const {error} = require("@actions/core");
const {exit} = require("node:process");

(async () => {
    await cleanCaches(true);
})().then().catch((e) => {
    error(e);
    exit(1);
});
