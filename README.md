# Clean Cache Action

Cleans up caches for GitHub Actions by their keys or branches. 

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
      - uses: opengrabeso/clean-cache@v1
        with:  
          post: true
          keep: 1
```
