import * as core from "@actions/core";
import { GitHub } from "@actions/github";
import fetch from "node-fetch";

async function run() {
  try {
    const token = core.getInput("github_token", { required: true });
    const baseURL = core.getInput("lona_api_base_url");
    const refName = core.getInput("ref_name", { required: true });
    const refType = core.getInput("ref_type", { required: true });

    const { GITHUB_REPOSITORY, GITHUB_SHA } = process.env;

    if (!GITHUB_REPOSITORY) {
      core.setFailed("Missing GITHUB_REPOSITORY");
      return;
    }

    if (!GITHUB_SHA) {
      core.setFailed("Missing GITHUB_SHA");
      return;
    }

    const ref = `refs/${refType === "tag" ? "tags" : "heads"}/${refName}`;

    const [owner, repo] = GITHUB_REPOSITORY.split("/");

    const github = new GitHub(token);
    const deployments = await github.repos.listDeployments({
      repo,
      owner,
      ref
    });

    console.log(deployments.data);

    if (deployments && deployments.data.length) {
      await github.repos.createDeploymentStatus({
        deployment_id: deployments.data[0].id,
        repo,
        owner,
        state: "inactive",
        description: "Deleted the GitHub ref",
        headers: {
          Accept: "application/vnd.github.ant-man-preview+json"
        }
      });
    }

    const res = await fetch(
      `${baseURL}/cleanGitRef?github_token=${encodeURIComponent(
        token
      )}&owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(
        repo
      )}&ref=${encodeURIComponent(ref)}`
    );

    if (!res.ok) {
      const error = await res.json();
      core.setFailed(error.message);
      return;
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
