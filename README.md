# Clean Cache Action

Cleans up caches for GitHub Actions by their keys or branches. 

The action is designed to be used in two scenarios with minimal setup necessary:

- on push branch event, where it can delete obsolete cache entries
- on PR close event, where it can delete all cache entries belonging to the branch

## Examples

### Keep only most recent cache while working on a branch

```yaml
on:
  push:
    branches: ['**']

jobs:
  clean:
    runs-on: ubuntu-latest
    permissions:
      actions: write
    steps:
      - uses: opengrabeso/clean-cache@v1.0.1
        with:  
          post: true
          keep: 1
```


```yaml
name: PR Cleanup
on:
  pull_request:
    types:
      - closed

jobs:
  cleanup:
    runs-on: ubuntu-latest
    permissions:
      actions: write
      contents: read
      pull-requests: read
    steps:

      - name: Clean cache for the branch name
        uses: opengrabeso/clean-cache@v1.0.1
```
