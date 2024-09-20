const core = require('@actions/core');
const github = require('@actions/github');

async function cleanCaches(post) {
    const asPost = core.getInput('post') === 'true';

    if (asPost === !!post) {

        try {
            const token = core.getInput('token');
            const ref = core.getInput('ref');
            const except = core.getInput('except');
            const keep = parseInt(core.getInput('keep'), 10);

            const octokit = github.getOctokit(token);

            const result = await octokit.rest.actions.getActionsCacheList({
                owner: github.context.repo.owner,
                repo: github.context.repo.repo,
                ref: ref
            });

            const caches = result.data.actions_caches;
            console.log(`Cache keys for ${ref}: ${caches.length}, keep ${keep}`);
            const cachesToDelete = caches.slice(keep);

            for (const cache of cachesToDelete) {
                if (cache.key !== except) {
                    console.log(`Deleting cache: ${cache.key}`);
                    await octokit.rest.actions.deleteActionsCacheById({
                        owner: github.context.repo.owner,
                        repo: github.context.repo.repo,
                        cache_id: cache.id
                    });
                }
            }
        } catch (error) {
            core.setFailed(error.message);
        }
    }
}

module.exports = { cleanCaches };
