# Lona Clean GitHub Action

A Github Action to clean the deployment made by the main Lona GitHub Action.

## Usage

```yaml
name: Lona
on: delete

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: Lona/lona-clean-github-action@v1
        id: lona
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          ref_type: ${{ github.event.ref_type }}
          ref_name: ${{ github.event.ref }}
```

### Inputs

- **`github_token`** _(required)_ - Required for permission to tag the repo. Usually `${{ secrets.GITHUB_TOKEN }}`.
- **`ref_type`** _(required)_ - The object that was deleted. Can be `branch` or `tag`. Usually `${{ github.event.ref_type }}`.
- **`ref_name`** _(required)_ - The git ref that was deleted. Usually `${{ github.event.ref }}`.
- **`lona_api_base_url`** - The Lona API server URL.
