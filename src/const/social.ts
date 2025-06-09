import github from "@/assets/social/github.svg";
import linkedin from "@/assets/social/linkedin.svg";
import email from "@/assets/social/email.svg";
import type { Social } from './types';

export const SOCIAL: Social[] = [
    {
      id: "linkedin",
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/angelurrutdev",
      image: {
        logo: linkedin,
      },
    },

    {
        id: "email",
        name: "Email",
        url: "angeljurrut@gmail.com",
        image: {
          logo: email,
        },
      },

    {
        id: "github",
        name: "GitHub",
        url: "https://github.com/angelurrutdev",
        image: {
          logo: github,
        },
      },


  ];

