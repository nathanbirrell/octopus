import { logger } from "../utils/logger";
import { retentionReason } from "../utils/releaseHelpers";
import { sortByDate } from "../utils/dateHelpers";

type Args = {
  retain: number;
  deployments: Deployment[];
  environments: Environment[];
  projects: Project[];
  releases: Release[];
};

type DecoratedDeployment = Deployment & { release: Release };
type ProjectEnvIndex = `${ProjectId}_${EnvironmentId}`;
type DeploymentsIndexedByProjectAndEnvironment = Record<
  ProjectEnvIndex,
  DecoratedDeployment[]
>;

/**
 * Determine which releases should be retained
 *
 * @returns Release[] Releases to be retained
 */
export const getRetainedReleases = ({
  retain,
  deployments = [],
  releases = [],
  // See assumption #2
  environments = [],
  projects = [],
}: Args) => {
  // index releases by ID to make retrieval of quicker
  const releaseIndex: Record<ReleaseId, Release> = releases.reduce(
    (acc, release) => {
      return {
        ...acc,
        [release.Id]: release,
      };
    },
    {},
  );

  // TODO: check usages of this API, if they require metadata for "environments" and "projects"
  //    add a similar index lookup for each and return them

  const deploymentsIndexedByProjectEnv: DeploymentsIndexedByProjectAndEnvironment =
    deployments.sort(sortByDate("DeployedAt")).reduce((acc, deployment) => {
      const release = releaseIndex[deployment.ReleaseId];

      // TODO: break separator out into a constant (the underscore "_")
      const index: ProjectEnvIndex = `${release.ProjectId}_${deployment.EnvironmentId}`;
      const existingDeployments = acc[index] || [];

      const deploymentWithRelease: DecoratedDeployment = {
        ...deployment,
        release,
      };

      return {
        ...acc,
        [index]: [...existingDeployments, deploymentWithRelease],
      };
    }, {} as DeploymentsIndexedByProjectAndEnvironment);

  const result: Release[] = [];

  Object.entries(deploymentsIndexedByProjectEnv).forEach(
    ([index, deploymentsToEnvironment]) => {
      const [projectId, environmentId] = index.split("_");

      // TODO: avoid this loop inside loop, will cause time complexity issues
      //    consider limiting releases added to the project-env index to avoid
      //    iterating over these items multiple times
      for (let i = 0; i < retain && i < deploymentsToEnvironment.length; i++) {
        const releaseToRetain = deploymentsToEnvironment[i].release;

        if (releaseToRetain) {
          result.push(releaseToRetain);

          logger.log(
            retentionReason(
              releaseToRetain,
              environmentId,
              deploymentsToEnvironment.length === 1 ? undefined : i,
            ),
          );
        } else {
          logger.error(
            `Release ${deploymentsToEnvironment[0].ReleaseId} not found.`,
          );
        }
      }
    },
  );

  return result;
};
