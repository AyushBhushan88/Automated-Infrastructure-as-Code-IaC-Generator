import { auth } from "@/auth";
import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  // @ts-expect-error accessToken is added to session in callbacks
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // @ts-expect-error accessToken exists here
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // List repositories for the authenticated user's installations
    // GitHub Apps require this specific endpoint to see authorized repos
    const installations = await octokit.rest.apps.listInstallationsForAuthenticatedUser();
    
    const repos = [];
    
    for (const installation of installations.data.installations) {
      const installationRepos = await octokit.rest.apps.listInstallationReposForAuthenticatedUser({
        installation_id: installation.id,
      });
      
      repos.push(...installationRepos.data.repositories.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        default_branch: repo.default_branch,
      })));
    }

    return NextResponse.json({ repositories: repos });
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  }
}
