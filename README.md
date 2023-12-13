Project for Octopus Deploy.

Most of the interesting logic can be found in `src/rules/releaseRetention.ts`.

## Get started

`npm install`

`npm run test`

## Assumptions & Notes

1. We are only interested in Projects with Releases and Deployments
1. We don't need to provide metadata about Projects and Releases, if this changes we will need to lookup on input args `environments` and `projects`.
1. Unfortunately, I didn't have time to improve the time complexity algorithm for this,
