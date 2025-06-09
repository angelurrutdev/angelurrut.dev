// src/const/projects.ts
import { TAGS } from './tags'; 
import { getI18N } from "@/i18n";
import type { Project } from './types';

export function getProjects(currentLocale: string): Project[] {
  const i18n = getI18N({ currentLocale });

  return [
    {
      num: 3,
      id: "nothing-web",
      icon: "/projects/icons/nothing-web.svg",
      title: "Nothing Phone",
      description: `🌻 ${i18n.PROJECT_DESCRIPTION_THREE}`,
      full_description: `🌻 ${i18n.PROJECT_FULL_DESCRIPTION_THREE}`,
      url: "https://clone-nothing-web.vercel.app",
      github_url: "https://github.com/angelurrutdev/nothing-web",
      project_image: "/projects/nothing-web-project.webp",
      tags: [TAGS.ASTRO, TAGS.TAILWIND, TAGS.CSS, TAGS.JAVASCRIPT],
      latest: true,
    },

    {
      num: 2,
      id: "gitguide",
      icon: "/projects/icons/gitguide.webp",
      title: "GitGuide",
      description: `✨ ${i18n.PROJECT_DESCRIPTION_TWO}`,
      full_description: `✨ ${i18n.PROJECT_FULL_DESCRIPTION_TWO}`,
      url: "https://gitguide.vercel.app",
      github_url: "https://github.com/angelurrutdev/gitguide",
      project_image: "/projects/gitguide-project.webp",
      tags: [TAGS.ASTRO, TAGS.MDX, TAGS.TAILWIND],
      updated: true,
    },

    {
      num: 1,
      id: "vecambio",
      icon: "/projects/icons/vecambio.svg",
      title: "VeCambio",
      description: `💸 ${i18n.PROJECT_DESCRIPTION_ONE}`,
      full_description: `💸 ${i18n.PROJECT_FULL_DESCRIPTION_ONE}`,
      url: "https://vecambio.vercel.app",
      github_url: "https://github.com/angelurrutdev/vecambio",
      project_image: "/projects/vecambio-project.webp",
      tags: [TAGS.NEXTJS, TAGS.REACT, TAGS.TYPESCRIPT, TAGS.TAILWIND],
      updated: true,
    },
  ];
}
