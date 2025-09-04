const core = require('@actions/core');
const github = require('@actions/github');

async function cleanCaches(post) {
    const asPost = core.getInput('post') === 'true';

    if (asPost === !!post) {

        try {
            const token = core.getInput('token');
            const ref = core.getInput('ref');
            const except = core.getInput('except');
            const include = core.getInput('includePrefix');
            const keep = parseInt(core.getInput('keep'), 10);
            const verbose = core.getInput('verbose') === 'true';

            const octokit = github.getOctokit(token);

            console.log(`ref: ${github.context.ref}`)
            const branches = [];
            if (ref === "") {

                if (github.context.payload.pull_request) {
                    // PR action - process both branch and PR refs
                    // Fetching the branch name for the PR
                    const {data: prData} = await octokit.rest.pulls.get({
                        owner: github.context.repo.owner,
                        repo: github.context.repo.repo,
                        pull_number: github.context.payload.pull_request.number
                    });

                    branches.push(`refs/heads/${prData.head.ref}`, `refs/pull/${(github.context.payload.pull_request.number)}/merge`);
                } else {
                    branches.push(github.context.ref)
                }

            } else {
                branches.push(ref);
            }

            let cachesToDelete = [];
            for (const ref of branches) {
                const result = await octokit.rest.actions.getActionsCacheList({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    ref: ref,
                    sort: 'created_at',
                    direction: 'desc'
                });
                const refCaches = result.data.actions_caches
                console.log(`Cache keys for ${ref}: ${refCaches.length}`);
                cachesToDelete.push(...refCaches);

                if (verbose) {
                    for (const cache of refCaches) {
                        const createdAtStr = new Date(cache.created_at)
                            .toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
                        const lastAccessedAtStr = new Date(cache.last_accessed_at)
                            .toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
                        console.log(`Cache: ${cache.key} created: ${createdAtStr}, accessed: ${lastAccessedAtStr}`);
                    }
                }
            }

            cachesToDelete = cachesToDelete
                .filter(cache => cache.key !== except && cache.key.startsWith(include))
                .slice(keep);

            for (const cache of cachesToDelete) {
                const createdAtStr = new Date(cache.created_at)
                    .toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

                console.log(`Deleting cache: ${cache.key} ${createdAtStr}`);
                await octokit.rest.actions.deleteActionsCacheById({
                    owner: github.context.repo.owner,
                    repo: github.context.repo.repo,
                    cache_id: cache.id
                });
            }
        } catch (error) {
            core.setFailed(error.message);
        }
    }
}

module.exports = { cleanCaches };
