import { auth } from "@/auth";
import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();

  // @ts-expect-error accessToken is added to session in callbacks
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { files, repository, branch, projectName } = await request.json();

  if (!repository || !files || Object.keys(files).length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [owner, repo] = repository.split("/");
  const targetBranch = branch || "main";
  const newBranchName = `iac-gen-${projectName}-${Date.now()}`;

  // @ts-expect-error accessToken exists
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // 1. Get the latest commit SHA from the target branch
    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${targetBranch}`,
    });
    const baseSha = refData.object.sha;

    // 2. Create a new branch
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranchName}`,
      sha: baseSha,
    });

    // 3. Create a tree with the new files
    const tree = Object.entries(files).map(([path, content]) => ({
      path,
      mode: "100644" as const,
      type: "blob" as const,
      content: content as string,
    }));

    const { data: treeData } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: baseSha,
      tree,
    });

    // 4. Create a commit
    const { data: commitData } = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `feat: add generated infrastructure for ${projectName}`,
      tree: treeData.sha,
      parents: [baseSha],
    });

    // 5. Update the branch ref to the new commit
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${newBranchName}`,
      sha: commitData.sha,
    });

    // 6. Create a Pull Request
    const { data: prData } = await octokit.rest.pulls.create({
      owner,
      repo,
      title: `Infrastructure: ${projectName}`,
      head: newBranchName,
      base: targetBranch,
      body: `This PR adds the generated infrastructure code for project **${projectName}**.

Generated components:
${Object.keys(files).map(f => `- ${f}`).join("\n")}

Validated by: Checkov, Trivy`,
    });

    return NextResponse.json({ 
      success: true, 
      branch: newBranchName,
      pullRequestUrl: prData.html_url 
    });
  } catch (error: any) {
    console.error("GitHub Commit Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to commit to GitHub" 
    }, { status: 500 });
  }
}
