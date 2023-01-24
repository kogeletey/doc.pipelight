import { defineConfig } from "simpcicd";

const localFiles = `.vitepress/dist/*`;
const remoteFoler = `Static/Perso/docs.simp.cicd`;

export const defaultConfig = defineConfig({
  pipelines: [
    {
      name: "default:deploy",
      steps: [
        {
          name: "build",
          commands: ["pnpm install", "pnpm build"]
        },
        {
          name: "deploy",
          commands: [
            `ssh linode -t \"rm -rf\ ${remoteFoler}/*"`,
            `rsync -ar ${localFiles} linode:${remoteFoler}`
          ]
        }
      ],
      triggers: [
        {
          branches: ["master", "main"],
          actions: ["pre-push"]
        }
      ]
    }
  ]
});
