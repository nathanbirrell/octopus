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
  environments = [],
  projects = [],
}: Args) => {
  const projectEnvironmentPairs = projects.flatMap((project) =>
    environments.map((environment) => [project.Id, environment.Id]),
  );

  console.log({ projectEnvironmentPairs });

  const sortedDeployments = deployments.sort(sortByDate("DeployedAt"));

  const result: Release[] = [];

  for (let index = 0; index < projectEnvironmentPairs.length; index++) {
    const [projectId, environmentId] = projectEnvironmentPairs[index];
    const releasesToKeep: Release[] = [];

    // FIXME create a hash map and lookup there
    const projectReleases = releases.filter((i) => i.ProjectId === projectId);
    // FIXME create a hash map and lookup there
    const environmentDeploys = sortedDeployments.filter(
      (i) => i.EnvironmentId === environmentId,
    );

    // FIXME: loop inside loop here, quadratic time complexity
    for (
      let j = 0;
      j < environmentDeploys.length && releasesToKeep.length < retain;
      j++
    ) {
      const deploy = environmentDeploys[j];
      const release = projectReleases.find((i) => i.Id === deploy.ReleaseId);

      if (!release) continue;
      releasesToKeep.push(release);
    }

    console.log({ releasesToKeep });

    result.push(...releasesToKeep);
  }

  console.log({ result });

  return result;

  // const projEnMap: Record<string, Release[]> = {};

  // for (let index = 0; index < releases.length; index++) {
  //   const release = releases[index];
  //   const deploymentsForRelease = deploymentsByRelease[release.Id];
  //   if (!deploymentsForRelease) continue;
  //   const environmentsForRelease = deploymentsForRelease.map(
  //     (i) => i.EnvironmentId,
  //   );

  //   // FIXME: time complexity issues here
  //   for (let j = 0; j < environmentsForRelease.length; j++) {
  //     const environment = environmentsForRelease[j];

  //     console.log(retentionReason(release, environment, index))

  //     releasesToRetain.push(...releasesForProject.slice(0, retain));

  //     // const id = `${release.ProjectId}_${environment}`;
  //     // projEnMap[id] = [...(projEnMap[id] || []), release];
  //   }
  // }

  // console.log({ projEnMap });

  // projectEnvs.forEach((id) => {
  //   const releasesForProject = projEnMap[id];
  //   if (!releasesForProject || releasesForProject.length < 1) return;
  //   releasesToRetain.push(...releasesForProject.slice(0, retain));
  // });

  // return releasesToRetain;
};
