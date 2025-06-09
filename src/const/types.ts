import type { TAGS } from "./tags";

export interface otherProjects {
    id?: string;
    title: string;
    description: string;
    href: string;
}


export interface Project {
    num: number;
    id: string;
    icon: string;
    title: string;
    description: string;
    full_description: string;
    url: string;
    github_url?: string;
    project_image?: string;
    tags: (typeof TAGS)[keyof typeof TAGS][]; 
    latest?: boolean;
    updated?: boolean;
  }

  type SocialId = "linkedin" | "github" | "email";

  type SocialName = "LinkedIn" | "GitHub" | "Email";

  export interface Social {
      id: SocialId;
      name: SocialName;
      url: string;
      label?: string;
      image: {
        logo: any;
      }
  }

export interface SKILLS {
    tags: (typeof TAGS)[keyof typeof TAGS][]; 
    name: string;
    
}

export interface Certifications {
    url?: string;
    title: string;
    certification: string;
}