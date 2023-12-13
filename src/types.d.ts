type ProjectId = string;
type ReleaseId = string;
type EnvironmentId = string;

type Project = {
  Id: ProjectId;
  Name: string;
};

type Release = {
  Id: ReleaseId;
  ProjectId: string;
  Version: string | null;
  Created: string; // ISO-8601 Date
};

type Deployment = {
  Id: string;
  ReleaseId: ReleaseId;
  EnvironmentId: EnvironmentId;
  DeployedAt: string; // ISO-8601 Date
};

type Environment = {
  Id: EnvironmentId;
  Name: string;
};
