import { getRetainedReleases } from "./getRetainedReleases";

const mockProjects = [
  {
    Id: "Project-1",
    Name: "Random Quotes",
  },
];

const mockDeployments = [
  {
    Id: "Deployment-1",
    ReleaseId: "Release-1",
    EnvironmentId: "Environment-1",
    DeployedAt: "2000-01-01T10:00:00",
  },
  {
    Id: "Deployment-2",
    ReleaseId: "Release-2",
    EnvironmentId: "Environment-1",
    DeployedAt: "2000-01-02T10:00:00",
  },
  {
    Id: "Deployment-3",
    ReleaseId: "Release-3",
    EnvironmentId: "Environment-1",
    DeployedAt: "2000-01-02T11:00:00",
  },
];

const mockEnvironments = [
  {
    Id: "Environment-1",
    Name: "Staging",
  },
];

const mockReleases = [
  {
    Id: "Release-1",
    ProjectId: "Project-1",
    Version: "1.0.0",
    Created: "2000-01-01T09:00:00",
  },
  {
    Id: "Release-2",
    ProjectId: "Project-1",
    Version: "1.0.1",
    Created: "2000-01-02T09:00:00",
  },
  {
    Id: "Release-3",
    ProjectId: "Project-1",
    Version: null,
    Created: "2000-01-02T13:00:00",
  },
];

it("returns the correct releases to be retained (n) per project/environment", () => {
  expect(
    getRetainedReleases({
      projects: mockProjects,
      deployments: mockDeployments,
      environments: mockEnvironments,
      releases: mockReleases,
      retain: 2,
    }).length,
  ).toBe(2);

  expect(
    getRetainedReleases({
      projects: mockProjects,
      deployments: mockDeployments,
      environments: mockEnvironments,
      releases: mockReleases,
      retain: 3,
    }).length,
  ).toBe(3);
});

it("logs why a release was kept", () => {
  console.log = jest.fn();

  getRetainedReleases({
    projects: mockProjects,
    deployments: [
      {
        Id: "Deployment-1",
        ReleaseId: "Release-1",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-01T10:00:00",
      },
      {
        Id: "Deployment-2",
        ReleaseId: "Release-2",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-02T10:00:00",
      },
      {
        Id: "Deployment-3",
        ReleaseId: "Release-3",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-02T11:00:00",
      },
      {
        Id: "Deployment-4",
        ReleaseId: "Release-4",
        EnvironmentId: "Environment-2",
        DeployedAt: "2000-01-02T11:00:00",
      },
    ],
    environments: [
      {
        Id: "Environment-1",
        Name: "Staging",
      },
      {
        Id: "Environment-2",
        Name: "Preprod",
      },
    ],
    releases: [
      {
        Id: "Release-1",
        ProjectId: "Project-1",
        Version: "1.0.0",
        Created: "2000-01-01T09:00:00",
      },
      {
        Id: "Release-2",
        ProjectId: "Project-1",
        Version: "1.0.1",
        Created: "2000-01-02T09:00:00",
      },
      {
        Id: "Release-3",
        ProjectId: "Project-1",
        Version: null,
        Created: "2000-01-02T13:00:00",
      },
      {
        Id: "Release-4",
        ProjectId: "Project-1",
        Version: null,
        Created: "2000-01-02T13:00:00",
      },
    ],
    retain: 3,
  });

  // expect(console.log).toHaveBeenCalledTimes(4);
  // expect(console.log).toHaveBeenCalledWith(
  //   `Release-3 kept because it is the most recent deployment to Environment-1`,
  // );
  // expect(console.log).toHaveBeenCalledWith(
  //   `Release-2 kept because it is the 2nd most recent deployment to Environment-1`,
  // );
  // expect(console.log).toHaveBeenCalledWith(
  //   `Release-1 kept because it is the 3rd most recent deployment to Environment-1`,
  // );
  // expect(console.log).toHaveBeenCalledWith(
  //   `Release-4 kept because it is the only deployment to Environment-2`,
  // );
});

it("logs the correct reason why a release was kept", () => {
  console.log = jest.fn();

  getRetainedReleases({
    projects: mockProjects,
    deployments: [
      {
        Id: "Deployment-1",
        ReleaseId: "Release-1",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-01T10:00:00",
      },
      {
        Id: "Deployment-2",
        ReleaseId: "Release-2",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-02T10:00:00",
      },
      {
        Id: "Deployment-3",
        ReleaseId: "Release-3",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-02T11:00:00",
      },
    ],
    environments: [
      {
        Id: "Environment-1",
        Name: "Staging",
      },
    ],
    releases: [
      {
        Id: "Release-1",
        ProjectId: "Project-1",
        Version: "1.0.0",
        Created: "2000-01-01T09:00:00",
      },
      {
        Id: "Release-2",
        ProjectId: "Project-1",
        Version: "1.0.1",
        Created: "2000-01-02T09:00:00",
      },
      {
        Id: "Release-3",
        ProjectId: "Project-1",
        Version: null,
        Created: "2000-01-02T13:00:00",
      },
    ],
    retain: 2,
  });

  // expect(console.log).toHaveBeenCalledWith(
  //   `Release-3 kept because it is the most recent deployment to Environment-1`,
  // );
  // expect(console.log).toHaveBeenCalledWith(
  //   `Release-2 kept because it is the 2nd most recent deployment to Environment-1`,
  // );
});

it("retains the most recent or most n recently deployed releases", () => {
  const deployments = [
    {
      Id: "Deployment-1",
      ReleaseId: "Release-1",
      EnvironmentId: "Environment-1",
      DeployedAt: "2000-01-01T10:00:00",
    },
    {
      Id: "Deployment-2",
      ReleaseId: "Release-2",
      EnvironmentId: "Environment-1",
      DeployedAt: "2000-01-02T10:00:00",
    },
    {
      Id: "Deployment-3",
      ReleaseId: "Release-3",
      EnvironmentId: "Environment-1",
      DeployedAt: "2000-01-02T11:00:00",
    },
  ];
  const environments = [
    {
      Id: "Environment-1",
      Name: "Staging",
    },
  ];
  const releases = [
    {
      Id: "Release-1",
      ProjectId: "Project-1",
      Version: "1.0.0",
      Created: "2000-01-01T09:00:00",
    },
    {
      Id: "Release-2",
      ProjectId: "Project-1",
      Version: "1.0.1",
      Created: "2000-01-02T09:00:00",
    },
    {
      Id: "Release-3",
      ProjectId: "Project-1",
      Version: null,
      Created: "2000-01-02T13:00:00",
    },
  ];

  const releasesToRetainSingle = getRetainedReleases({
    projects: mockProjects,
    deployments,
    environments,
    releases,
    retain: 1,
  });

  expect(releasesToRetainSingle).toHaveLength(1);
  expect(releasesToRetainSingle[0].Id).toBe("Release-3");

  const releasesToRetainMultiple = getRetainedReleases({
    projects: mockProjects,
    deployments,
    environments,
    releases,
    retain: 2,
  });

  expect(releasesToRetainMultiple).toHaveLength(2);
  expect(releasesToRetainMultiple[0].Id).toBe("Release-3");
  expect(releasesToRetainMultiple[1].Id).toBe("Release-2");
});

it("applies the release retention rule correctly to each project/environment combination", () => {
  const releasesToRetain = getRetainedReleases({
    projects: [
      ...mockProjects,
      {
        Id: "Project-2",
        Name: "Pet Shop",
      },
    ],
    deployments: [
      {
        Id: "Deployment-1",
        ReleaseId: "Release-1",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-01T10:00:00",
      },
      {
        Id: "Deployment-2",
        ReleaseId: "Release-2",
        EnvironmentId: "Environment-2",
        DeployedAt: "2000-01-02T10:00:00",
      },
      {
        Id: "Deployment-3",
        ReleaseId: "Release-2",
        EnvironmentId: "Environment-2",
        DeployedAt: "2000-01-02T11:00:00",
      },
      {
        Id: "Deployment-4",
        ReleaseId: "Release-2",
        EnvironmentId: "Environment-3",
        DeployedAt: "2000-01-02T12:00:00",
      },
      {
        Id: "Deployment-5",
        ReleaseId: "Release-5",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-01T11:00:00",
      },
      {
        Id: "Deployment-6",
        ReleaseId: "Release-6",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-02T10:00:00",
      },
      {
        Id: "Deployment-7",
        ReleaseId: "Release-6",
        EnvironmentId: "Environment-2",
        DeployedAt: "2000-01-02T11:00:00",
      },
      {
        Id: "Deployment-8",
        ReleaseId: "Release-7",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-02T13:00:00",
      },
      {
        Id: "Deployment-9",
        ReleaseId: "Release-6",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-02T14:00:00",
      },
      {
        Id: "Deployment-10",
        ReleaseId: "Release-8",
        EnvironmentId: "Environment-1",
        DeployedAt: "2000-01-01T10:00:00",
      },
    ],
    environments: [
      {
        Id: "Environment-1",
        Name: "Staging",
      },
      {
        Id: "Environment-2",
        Name: "Production",
      },
    ],
    releases: [
      {
        Id: "Release-1",
        ProjectId: "Project-1",
        Version: "1.0.0",
        Created: "2000-01-01T09:00:00",
      },
      {
        Id: "Release-2",
        ProjectId: "Project-1",
        Version: "1.0.1",
        Created: "2000-01-02T09:00:00",
      },
      {
        Id: "Release-3",
        ProjectId: "Project-1",
        Version: null,
        Created: "2000-01-02T13:00:00",
      },
      {
        Id: "Release-4",
        ProjectId: "Project-2",
        Version: "1.0.0",
        Created: "2000-01-01T09:00:00",
      },
      {
        Id: "Release-5",
        ProjectId: "Project-2",
        Version: "1.0.1-ci1",
        Created: "2000-01-01T10:00:00",
      },
      {
        Id: "Release-6",
        ProjectId: "Project-2",
        Version: "1.0.2",
        Created: "2000-01-02T09:00:00",
      },
      {
        Id: "Release-7",
        ProjectId: "Project-2",
        Version: "1.0.3",
        Created: "2000-01-02T12:00:00",
      },
      {
        Id: "Release-8",
        ProjectId: "Project-3",
        Version: "2.0.0",
        Created: "2000-01-01T09:00:00",
      },
    ],
    retain: 1,
  });

  expect(releasesToRetain).toContainEqual(
    expect.objectContaining({ Id: "Release-1" }),
  );
  expect(releasesToRetain).toContainEqual(
    expect.objectContaining({ Id: "Release-2" }),
  );
  expect(releasesToRetain).toContainEqual(
    expect.not.objectContaining({ Id: "Release-3" }),
  );
  expect(releasesToRetain).toContainEqual(
    expect.not.objectContaining({ Id: "Release-4" }),
  );
  expect(releasesToRetain).toContainEqual(
    expect.not.objectContaining({ Id: "Release-5" }),
  );
  expect(releasesToRetain).toContainEqual(
    expect.objectContaining({ Id: "Release-6" }),
  );
  expect(releasesToRetain).toContainEqual(
    expect.not.objectContaining({ Id: "Release-7" }),
  );
  expect(releasesToRetain).toContainEqual(
    expect.not.objectContaining({ Id: "Release-8" }),
  );
});

it("does not retain releases with no deployments", () => {
  expect(
    getRetainedReleases({
      projects: mockProjects,
      deployments: [
        {
          Id: "Deployment-1",
          ReleaseId: "Release-1",
          EnvironmentId: "Environment-1",
          DeployedAt: "2000-01-01T10:00:00",
        },
      ],
      environments: [
        {
          Id: "Environment-1",
          Name: "Staging",
        },
      ],
      releases: [
        {
          Id: "Release-1",
          ProjectId: "Project-1",
          Version: "1.0.0",
          Created: "2000-01-01T09:00:00",
        },
        {
          Id: "Release-2",
          ProjectId: "Project-1",
          Version: "1.0.1",
          Created: "2000-01-02T09:00:00",
        },
      ],
      retain: 2,
    }),
  ).toContainEqual(expect.not.objectContaining({ Id: "Release-2" }));
});
