import { c as createComponent, j as createAstro, m as maybeRenderHead, s as spreadAttributes, l as addAttribute, n as renderSlot, a as renderTemplate, r as renderComponent, o as createTransitionScope, p as renderHead, q as Fragment, u as unescapeHTML } from './astro/server_DhGomCES.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */
import { n as noop, s as subscribe_to_store, a as run_all, b as stringify, c as store_get, d as slot, u as unsubscribe_stores } from './_@astro-renderers_D9-9ZLb9.mjs';
import { $ as $$Image } from './_astro_assets_2zoZUpme.mjs';

const ATTR_REGEX = /[&"<]/g;

/**
 * @template V
 * @param {V} value
 * @param {boolean} [is_attr]
 */
function escape_html(value, is_attr) {
	const str = String(value ?? '');

	const pattern = ATTR_REGEX ;
	pattern.lastIndex = 0;

	let escaped = '';
	let last = 0;

	while (pattern.test(str)) {
		const i = pattern.lastIndex - 1;
		const ch = str[i];
		escaped += str.substring(last, i) + (ch === '&' ? '&amp;' : ch === '"' ? '&quot;' : '&lt;');
		last = i + 1;
	}

	return escaped + str.substring(last);
}

/**
 * `<div translate={false}>` should be rendered as `<div translate="no">` and _not_
 * `<div translate="false">`, which is equivalent to `<div translate="yes">`. There
 * may be other odd cases that need to be added to this list in future
 * @type {Record<string, Map<any, string>>}
 */
const replacements = {
	translate: new Map([
		[true, 'yes'],
		[false, 'no']
	])
};

/**
 * @template V
 * @param {string} name
 * @param {V} value
 * @param {boolean} [is_boolean]
 * @returns {string}
 */
function attr(name, value, is_boolean = false) {
	if (value == null || (!value && is_boolean) || (value === '' && name === 'class')) return '';
	const normalized = (name in replacements && replacements[name].get(value)) || value;
	const assignment = is_boolean ? '' : `="${escape_html(normalized)}"`;
	return ` ${name}${assignment}`;
}

/** @import { Equals } from '#client' */
/** @type {Equals} */

/**
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
function safe_not_equal(a, b) {
	return a != a
		? b == b
		: a !== b || (a !== null && typeof a === 'object') || typeof a === 'function';
}

/** @import { Readable, StartStopNotifier, Subscriber, Unsubscriber, Updater, Writable } from '../public.js' */
/** @import { Stores, StoresValues, SubscribeInvalidateTuple } from '../private.js' */

/**
 * @type {Array<SubscribeInvalidateTuple<any> | any>}
 */
const subscriber_queue = [];

/**
 * Creates a `Readable` store that allows reading by subscription.
 *
 * @template T
 * @param {T} [value] initial value
 * @param {StartStopNotifier<T>} [start]
 * @returns {Readable<T>}
 */
function readable(value, start) {
	return {
		subscribe: writable(value, start).subscribe
	};
}

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 *
 * @template T
 * @param {T} [value] initial value
 * @param {StartStopNotifier<T>} [start]
 * @returns {Writable<T>}
 */
function writable(value, start = noop) {
	/** @type {Unsubscriber | null} */
	let stop = null;

	/** @type {Set<SubscribeInvalidateTuple<T>>} */
	const subscribers = new Set();

	/**
	 * @param {T} new_value
	 * @returns {void}
	 */
	function set(new_value) {
		if (safe_not_equal(value, new_value)) {
			value = new_value;
			if (stop) {
				// store is ready
				const run_queue = !subscriber_queue.length;
				for (const subscriber of subscribers) {
					subscriber[1]();
					subscriber_queue.push(subscriber, value);
				}
				if (run_queue) {
					for (let i = 0; i < subscriber_queue.length; i += 2) {
						subscriber_queue[i][0](subscriber_queue[i + 1]);
					}
					subscriber_queue.length = 0;
				}
			}
		}
	}

	/**
	 * @param {Updater<T>} fn
	 * @returns {void}
	 */
	function update(fn) {
		set(fn(/** @type {T} */ (value)));
	}

	/**
	 * @param {Subscriber<T>} run
	 * @param {() => void} [invalidate]
	 * @returns {Unsubscriber}
	 */
	function subscribe(run, invalidate = noop) {
		/** @type {SubscribeInvalidateTuple<T>} */
		const subscriber = [run, invalidate];
		subscribers.add(subscriber);
		if (subscribers.size === 1) {
			stop = start(set, update) || noop;
		}
		run(/** @type {T} */ (value));
		return () => {
			subscribers.delete(subscriber);
			if (subscribers.size === 0 && stop) {
				stop();
				stop = null;
			}
		};
	}
	return { set, update, subscribe };
}

/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @template {Stores} S
 * @template T
 * @overload
 * @param {S} stores
 * @param {(values: StoresValues<S>, set: (value: T) => void, update: (fn: Updater<T>) => void) => Unsubscriber | void} fn
 * @param {T} [initial_value]
 * @returns {Readable<T>}
 */
/**
 * Derived value store by synchronizing one or more readable stores and
 * applying an aggregation function over its input values.
 *
 * @template {Stores} S
 * @template T
 * @overload
 * @param {S} stores
 * @param {(values: StoresValues<S>) => T} fn
 * @param {T} [initial_value]
 * @returns {Readable<T>}
 */
/**
 * @template {Stores} S
 * @template T
 * @param {S} stores
 * @param {Function} fn
 * @param {T} [initial_value]
 * @returns {Readable<T>}
 */
function derived(stores, fn, initial_value) {
	const single = !Array.isArray(stores);
	/** @type {Array<Readable<any>>} */
	const stores_array = single ? [stores] : stores;
	if (!stores_array.every(Boolean)) {
		throw new Error('derived() expects stores as input, got a falsy value');
	}
	const auto = fn.length < 2;
	return readable(initial_value, (set, update) => {
		let started = false;
		/** @type {T[]} */
		const values = [];
		let pending = 0;
		let cleanup = noop;
		const sync = () => {
			if (pending) {
				return;
			}
			cleanup();
			const result = fn(single ? values[0] : values, set, update);
			if (auto) {
				set(result);
			} else {
				cleanup = typeof result === 'function' ? result : noop;
			}
		};
		const unsubscribers = stores_array.map((store, i) =>
			subscribe_to_store(
				store,
				(value) => {
					values[i] = value;
					pending &= ~(1 << i);
					if (started) {
						sync();
					}
				},
				() => {
					pending |= 1 << i;
				}
			)
		);
		started = true;
		sync();
		return function stop() {
			run_all(unsubscribers);
			cleanup();
			// We need to set this to false because callbacks can still happen despite having unsubscribed:
			// Callbacks might already be placed in the queue which doesn't know it should no longer
			// invoke this derived store.
			started = false;
		};
	});
}

/**
 * Get the current value from a store by subscribing and immediately unsubscribing.
 *
 * @template T
 * @param {Readable<T>} store
 * @returns {T}
 */
function get(store) {
	let value;
	subscribe_to_store(store, (_) => (value = _))();
	// @ts-expect-error
	return value;
}

const Socials = {
  github_title: "Github",
  github_url: "https://github.com/angelurrutdev",
  linkedin_title: "Linkedin",
  linkedin_url: "https://www.linkedin.com/in/angelurrutdev",
  email_title: "Email",
  email_url: "angeljurrut@gmail.com"
};

const $$Astro$m = createAstro();
const $$SocialPill = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$SocialPill;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${spreadAttributes(Astro2.props)} target="_blank" rel="noopener noreferrer" role="link"${addAttribute(`inline-flex items-center space-x-3 justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-700 focus-visible:ring-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 h-9 w-9 opacity-80 transition-opacity duration-150 hover:opacity-100 ${className}`, "class")}> ${renderSlot($$result, $$slots["default"])} </a>`;
}, "/home/user/portfolio/alcambio/src/components/SocialPill.astro", void 0);

const $$Astro$l = createAstro();
const $$LinkedIn = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$LinkedIn;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} width="256" height="256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256"><path d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453" fill="currentColor"></path></svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/LinkedIn.astro", void 0);

const SEO_TITLE$1 = "Angel Urrutia | Porfolio";
const SEO_DESCRIPTION$1 = "I'm Angel, a fullstack web developer from Venezuela with +1 years of experience. I'm passionate about databases, UI/UX design.";
const HEADER_DOWNLOAD$1 = "Download";
const HERO_TITLE$1 = "Hey, I'm Angel";
const HERO_DESCRIPTION$1 = "<strong>+1 Year of experience</strong> as a Web Developer <strong>from Venezuela, Aragua.</strong> I have worked on different <strong>personal projects</strong>. I am passionate about <strong>databases</strong>, <strong>UI/UX design</strong> and <strong>Astro</strong>.";
const EXPERIENCE_PRE_TITLE$1 = "Experience";
const PROJECTS_PRE_TITLE$1 = "Projects";
const PROJECT_DESCRIPTION_ONE$1 = "Currency converter in real-time bolivar to dollar and euro exchange rates ";
const PROJECT_DESCRIPTION_TWO$1 = "A practical and easy guide to Git & GitHub";
const HAVE_PROJECT_TITLE$1 = "Do you have a project ?";
const HAVE_PROJECT_SUBTITLE$1 = "Let's work together";
const HAVE_PROJECT_CONTACT$1 = "Contact me";
const LAST_UPDATE$1 = "Last Update: 05/03/2025";
const MADE_BY$1 = "Made by Angel Using";
const english = {
  SEO_TITLE: SEO_TITLE$1,
  SEO_DESCRIPTION: SEO_DESCRIPTION$1,
  HEADER_DOWNLOAD: HEADER_DOWNLOAD$1,
  HERO_TITLE: HERO_TITLE$1,
  HERO_DESCRIPTION: HERO_DESCRIPTION$1,
  EXPERIENCE_PRE_TITLE: EXPERIENCE_PRE_TITLE$1,
  PROJECTS_PRE_TITLE: PROJECTS_PRE_TITLE$1,
  PROJECT_DESCRIPTION_ONE: PROJECT_DESCRIPTION_ONE$1,
  PROJECT_DESCRIPTION_TWO: PROJECT_DESCRIPTION_TWO$1,
  HAVE_PROJECT_TITLE: HAVE_PROJECT_TITLE$1,
  HAVE_PROJECT_SUBTITLE: HAVE_PROJECT_SUBTITLE$1,
  HAVE_PROJECT_CONTACT: HAVE_PROJECT_CONTACT$1,
  LAST_UPDATE: LAST_UPDATE$1,
  MADE_BY: MADE_BY$1,
};

const SEO_TITLE = "Angel Urrutia | Portafolio";
const SEO_DESCRIPTION = "Soy Angel, un fullstack desarollador web de Venezuela con un año de experiencia. Apasionado de las bases de datos, UI/UX design.";
const HEADER_DOWNLOAD = "Descargar";
const HERO_TITLE = "Hola, soy Angel";
const HERO_DESCRIPTION = " <strong> 1 Año de experiencia </strong> como Desarrollador Web de <strong>Venezuela, Aragua.</strong> He trabajado en diferentes <strong>proyectos personales</strong>. Me apasionan las <strong>bases de datos</strong>, el <strong>diseño UI/UX</strong> y <strong>Astro</strong>.";
const EXPERIENCE_PRE_TITLE = "Experiencia";
const PROJECTS_PRE_TITLE = "Proyectos";
const PROJECT_DESCRIPTION_ONE = "Calculadora de bolívares a dólares y euros en tiempo real";
const PROJECT_DESCRIPTION_TWO = "Una guía practica y sencilla de Git & GitHub";
const HAVE_PROJECT_TITLE = "¿ Tienes algún proyecto ? ";
const HAVE_PROJECT_SUBTITLE = "Trabajemos juntos";
const HAVE_PROJECT_CONTACT = "Contactame";
const LAST_UPDATE = "Ultima actualización: 05/03/2025";
const MADE_BY = "Hecho por Angel con";
const spanish = {
  SEO_TITLE,
  SEO_DESCRIPTION,
  HEADER_DOWNLOAD,
  HERO_TITLE,
  HERO_DESCRIPTION,
  EXPERIENCE_PRE_TITLE,
  PROJECTS_PRE_TITLE,
  PROJECT_DESCRIPTION_ONE,
  PROJECT_DESCRIPTION_TWO,
  HAVE_PROJECT_TITLE,
  HAVE_PROJECT_SUBTITLE,
  HAVE_PROJECT_CONTACT,
  LAST_UPDATE,
  MADE_BY,
};

const LANG = {
  ENGLISH: "en",
  SPANISH: "es"
};
const getI18N = ({
  currentLocale = "es"
}) => {
  if (currentLocale === LANG.SPANISH) return { ...english, ...spanish };
  if (currentLocale === LANG.ENGLISH) return { ...spanish, ...english };
  return spanish;
};

const $$Astro$k = createAstro();
const $$AstroIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$AstroIcon;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} viewBox="0 0 256 366" xmlns="http://www.w3.org/2000/svg" width="19" height="18" class="dark:text-white items-center" preserveAspectRatio="xMidYMid"><path fill="currentColor" d="M182.022 9.147c2.982 3.702 4.502 8.697 7.543 18.687L256 246.074a276.467 276.467 0 0 0-79.426-26.891L133.318 73.008a5.63 5.63 0 0 0-10.802.017L79.784 219.11A276.453 276.453 0 0 0 0 246.04L66.76 27.783c3.051-9.972 4.577-14.959 7.559-18.654a24.541 24.541 0 0 1 9.946-7.358C88.67 0 93.885 0 104.314 0h47.683c10.443 0 15.664 0 20.074 1.774a24.545 24.545 0 0 1 9.95 7.373Z"></path><path fill="#FF5D01" d="M189.972 256.46c-10.952 9.364-32.812 15.751-57.992 15.751-30.904 0-56.807-9.621-63.68-22.56-2.458 7.415-3.009 15.903-3.009 21.324 0 0-1.619 26.623 16.898 45.14 0-9.615 7.795-17.41 17.41-17.41 16.48 0 16.46 14.378 16.446 26.043l-.001 1.041c0 17.705 10.82 32.883 26.21 39.28a35.685 35.685 0 0 1-3.588-15.647c0-16.886 9.913-23.173 21.435-30.48 9.167-5.814 19.353-12.274 26.372-25.232a47.588 47.588 0 0 0 5.742-22.735c0-5.06-.786-9.938-2.243-14.516Z"></path></svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/AstroIcon.astro", void 0);

const $$Astro$j = createAstro();
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$Footer;
  const { currentLocale } = Astro2;
  const i18n = getI18N({ currentLocale });
  return renderTemplate`${maybeRenderHead()}<footer class="group w-full text-xs text-neutral-600 animate-in fade-in-25 dark:text-neutral-400 backdrop-blur-md bottom-0 mt-4 max-w-2xl md:max-w-5xl font-mono"> <div class="mx-4 flex items-center justify-between"> <div class="flex items-center space-x-2"> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart text-red-500 group-hover:transform group-hover:animate-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg><a href="https://astro.build/blog/astro-5-beta/" rel="noreferrer" target="_blank" class="flex items-center space-x-1 text-sm"><p>${i18n.MADE_BY}</p> ${renderComponent($$result, "AstroIcon", $$AstroIcon, {})} </a> </div> <div class="flex items-center space-x-2"> <p class="">${i18n.LAST_UPDATE}</p> ${renderComponent($$result, "SocialPill", $$SocialPill, { "href": Socials.linkedin_url, "title": Socials.linkedin_title, "target": "_blank" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LinkedIn", $$LinkedIn, { "class": "size-5 mx-1" })} ` })} </div> </div> </footer>`;
}, "/home/user/portfolio/alcambio/src/components/Footer.astro", void 0);

const $$Astro$i = createAstro();
const $$Sun = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Sun;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path> <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path> </svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/Sun.astro", void 0);

const $$Astro$h = createAstro();
const $$Moon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$Moon;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/Moon.astro", void 0);

const $$Astro$g = createAstro();
const $$System = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$System;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"></path> <path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10z"></path> <path d="M7 20h10"></path> <path d="M9 16v4"></path> <path d="M15 16v4"></path> </svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/System.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
  const THEMES = ["Light", "Dark", "System"];
  return renderTemplate(_a || (_a = __template(["", '<div class="hidden relative mr-1 ml-1 md:block" data-astro-cid-x3pjskd3> <button id="theme-toggle-btn" class="flex border-none opacity-80 transition-all duration-150 appearance-none hover:rotate-12 hover:opacity-100 hover:cursor-pointer" data-astro-cid-x3pjskd3', '> <span class="sr-only" data-astro-cid-x3pjskd3>Elige el tema</span> ', " ", " ", ' </button> <div id="themes-menu" class="absolute hidden scale-80 top-8 right-0 text-sm p-1 min-w-[8rem] rounded-md border border-gray-100 bg-white/90 dark:bg-gray-900/50 dark:dark:border-neutral-800 shadow-[0_3px_10px_rgb(0,0,0,0.2)] backdrop-blur-md" data-astro-cid-x3pjskd3', "> <ul data-astro-cid-x3pjskd3> ", ' </ul> </div> </div>  <script>\n  let remove = null;\n  const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");\n  const themesMenu = document.getElementById("themes-menu");\n\n  const getThemePreference = () => {\n    if (typeof localStorage !== "undefined") {\n      return localStorage.getItem("theme") ?? "system";\n    }\n\n    return window.matchMedia("(prefers-color-scheme: dark)").matches\n      ? "dark"\n      : "light";\n  };\n\n  const updateIcon = (themePreference) => {\n    document.querySelectorAll(".theme-toggle-icon").forEach((element) => {\n      element.style.scale = element.id === themePreference ? "1" : "0";\n    });\n  };\n\n  const updateTheme = () => {\n    if (remove != null) {\n      remove();\n    }\n    matchMedia.addEventListener("change", updateTheme);\n    remove = () => {\n      matchMedia.removeEventListener("change", updateTheme);\n    };\n\n    const themePreference = getThemePreference();\n    const isDark =\n      themePreference === "dark" ||\n      (themePreference === "system" && matchMedia.matches);\n\n    updateIcon(themePreference);\n    document.documentElement.classList[isDark ? "add" : "remove"]("dark");\n  };\n\n  updateTheme();\n\n  document.addEventListener("click", () => themesMenu.classList.remove("open"));\n\n  document.getElementById("theme-toggle-btn").addEventListener("click", (e) => {\n    e.stopPropagation();\n    const isClosed = !themesMenu.classList.contains("open");\n    themesMenu.classList[isClosed ? "add" : "remove"]("open");\n  });\n\n  document.querySelectorAll(".themes-menu-option").forEach((element) => {\n    element.addEventListener("click", (e) => {\n      localStorage.setItem("theme", e.target.innerText.toLowerCase().trim());\n      updateTheme();\n    });\n  });\n\n  document.addEventListener("astro:after-swap", () => {\n    updateTheme();\n    window.scrollTo({ left: 0, top: 0, behavior: "instant" });\n  });\n<\/script>'])), maybeRenderHead(), addAttribute(createTransitionScope($$result, "ko5uysgj"), "data-astro-transition-persist"), renderComponent($$result, "SunIcon", $$Sun, { "id": "light", "class": "transition-all theme-toggle-icon size-5", "data-astro-cid-x3pjskd3": true }), renderComponent($$result, "MoonIcon", $$Moon, { "id": "dark", "class": "absolute transition-all theme-toggle-icon size-5", "data-astro-cid-x3pjskd3": true }), renderComponent($$result, "SystemIcon", $$System, { "id": "system", "class": "absolute transition-all theme-toggle-icon size-5", "data-astro-cid-x3pjskd3": true }), addAttribute(createTransitionScope($$result, "d5hlxqxh"), "data-astro-transition-persist"), THEMES.map((theme) => renderTemplate`<li class="px-2 py-1.5 rounded-sm cursor-pointer themes-menu-option hover:bg-neutral-400/40 dark:hover:bg-gray-500/50" data-astro-cid-x3pjskd3> ${theme} </li>`));
}, "/home/user/portfolio/alcambio/src/components/ThemeToggle.astro", "self");

const $$Astro$f = createAstro();
const $$GitHub = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$GitHub;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} viewBox="0 0 256 250" width="256" height="250" fill="currentColor" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"> <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z"></path> </svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/GitHub.astro", void 0);

const $$Astro$e = createAstro();
const $$Mail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Mail;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/Mail.astro", void 0);

const $$Astro$d = createAstro();
const $$Cv = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Cv;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-file-download"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path><path d="M12 17v-6"></path><path d="M9.5 14.5l2.5 2.5l2.5 -2.5"></path></svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/Cv.astro", void 0);

const $$Chevron = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<svg class="-mr-1 h-5 w-5 text-white group-hover:rotate-180 transition-all duration-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"> <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"></path> </svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/Chevron.astro", void 0);

const LANGUAGES = {
  en: {
    code: "en",
    name: "EN"
  },
  es: {
    code: "es",
    name: "ES"
  }
};
const defaultLang = "es";
const ui = {
  es: {},
  en: {}
};
const routes = {
  es: {},
  en: {}
};

function getLangFromUrl(url) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang;
  return defaultLang;
}
function useTranslatedPath(lang) {
  return function translatePath(path, l = lang) {
    const pathName = path.replaceAll("/", "");
    const hasTranslation = defaultLang !== l && routes[l][pathName] !== void 0;
    const translatedPath = hasTranslation ? "/" + routes[l][pathName] : path;
    return l === defaultLang ? translatedPath : `/${l}${translatedPath}`;
  };
}
function getRouteFromUrl(url) {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split("/");
  const path = parts.pop() || parts.pop();
  if (path === void 0) {
    return void 0;
  }
  const currentLang = getLangFromUrl(url);
  if (defaultLang === currentLang) {
    const route = Object.values(routes)[0];
    return route[path] !== void 0 ? route[path] : void 0;
  }
  const getKeyByValue = (obj, value) => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };
  const reversedKey = getKeyByValue(routes[currentLang], path);
  if (reversedKey !== void 0) {
    return reversedKey;
  }
  return void 0;
}

const $$Astro$c = createAstro();
const $$LanguageSelector = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$LanguageSelector;
  const route = getRouteFromUrl(Astro2.url);
  const lang = getLangFromUrl(Astro2.url);
  const translatePath = useTranslatedPath(lang);
  const currentLocaleData = LANGUAGES[lang];
  const otherLocales = Object.values(LANGUAGES).filter(
    (locale) => locale.code !== lang
  );
  return renderTemplate`${maybeRenderHead()}<div class="relative inline-block text-left"> <div class="group text-white rounded-md text-xs font-semibold bg-black/20 hover:bg-black/70 transition-all"> <button type="button" class="inline-flex justify-start items-center w-full gap-x-2 px-3 py-2" aria-expanded="true" aria-haspopup="true"> ${currentLocaleData.name} ${renderComponent($$result, "ChevronIcon", $$Chevron, {})} </button> <ul class="group-hover:block group-hover:animate-fade-down group-hover:animate-duration-200 hidden pt-0.5 absolute w-full"> ${otherLocales.map((locale) => renderTemplate`<li class="py-[2px]"> <a class="rounded-md bg-black/30 hover:bg-black/70 dark:bg-neutral-900 dark:hover:bg-neutral-800  whitespace-no-wrap inline-flex justify-start items-center w-full gap-x-2 px-3 py-2"${addAttribute(translatePath(`/${route ? route : ""}`, locale.code), "href")}> ${locale.name} </a> </li>`)} </ul> </div> </div>`;
}, "/home/user/portfolio/alcambio/src/components/LanguageSelector.astro", void 0);

const $$Astro$b = createAstro();
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Header;
  const { currentLocale } = Astro2;
  const i18n = getI18N({ currentLocale });
  const CV_ENGLISH = "/CV_Angel_Urrutia(English).pdf";
  const CV_SPANISH = "/CV_Angel_Urrutia(Spanish).pdf";
  const currentURL = new URL(Astro2.request.url);
  const mostrarEN = currentURL.pathname.startsWith("/en/");
  return renderTemplate`${maybeRenderHead()}<nav class="container flex sticky top-0 z-10 justify-between items-center py-4 mb-1 w-full max-w-2xl backdrop-blur-md md:max-w-5xl dark:bg-neutral-900/80"> <a href="/" class="flex items-center space-x-2 font-medium tracking-tight opacity-80 transition-opacity duration-150 text-md hover:opacity-100"> <span class="ml-2">angelurrutdev</span> </a> <div class="flex items-center space-x-1"> ${renderComponent($$result, "SocialPill", $$SocialPill, { "class": "flex justify-center items-center p-1 text-sm font-medium whitespace-nowrap rounded-md opacity-80 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-700 focus-visible:ring-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 hover:opacity-100", "href": mostrarEN ? CV_ENGLISH : CV_SPANISH, "target": "_blank" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Cv", $$Cv, { "class": "size-6" })} <div class="flex items-center"> <span class="hidden ml-1 lg:flex"> ${i18n.HEADER_DOWNLOAD} &nbsp; </span> <span>CV</span> </div> ` })} ${renderComponent($$result, "SocialPill", $$SocialPill, { "href": Socials.github_url, "title": Socials.github_title, "target": "_blank" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "GitHub", $$GitHub, { "class": "mx-2 size-6" })} ` })} ${renderComponent($$result, "SocialPill", $$SocialPill, { "href": Socials.linkedin_url, "title": Socials.linkedin_title, "target": "_blank" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LinkedIn", $$LinkedIn, { "class": "mx-1 size-5" })} ` })} ${renderComponent($$result, "SocialPill", $$SocialPill, { "href": `mailto:${Socials.email_url}`, "title": Socials.email_title, "target": "_blank", "className": "md:inline-flex hidden" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Mail", $$Mail, { "class": "mx-1 size-5" })} ` })} ${renderComponent($$result, "LanguageSelector", $$LanguageSelector, {})} ${renderComponent($$result, "ThemeToggle", $$ThemeToggle, {})} </div> </nav>`;
}, "/home/user/portfolio/alcambio/src/components/Header.astro", void 0);

const $$Astro$a = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Layout;
  const { description, title } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="viewport" content="width=device-width, initial-scale=1.0"><!-- Primary Meta Tags --><title>${title}</title><meta name="title"${addAttribute(title, "content")}><meta name="description"${addAttribute(description, "content")}><meta name="keywords" content="Angel Urrutia, Software Developer, Web Developer, Front-end Developer, React, Next.js, Angular, TypeScript, JavaScript, Vite, TailwindCSS, UX/UI"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url" content="https://angelurrutdev.vercel.app/"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:site_name"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><!-- Twitter --><meta property="twitter:card" content="large_image"><meta property="twitter:url" content="https://angelurutdev.vercel.app/"><meta property="twitter:title"${addAttribute(title, "content")}><meta property="twitter:description"${addAttribute(description, "content")}>${renderHead()}</head> <body class="flex flex-col gap-5 items-center px-4 space-y-4 w-full font-sans fill-mode-backwards bg-neutral-300 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 scroll-smooth"> ${renderComponent($$result, "Header", $$Header, {})} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Footer", $$Footer, {})}  </body> </html>`;
}, "/home/user/portfolio/alcambio/src/layouts/Layout.astro", void 0);

const $$Astro$9 = createAstro();
const $$Link = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Link;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide lucide-arrow-up-right opacity-50 duration-200 group-hover:translate-x-[1.5px] group-hover:opacity-100"> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <path d="M7 7h10v10"></path> <path d="M7 17 17 7"></path> ` })} </svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/Link.astro", void 0);

const $$ShinyBadge = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="animate-shine cursor-default inline-flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-800 bg-[linear-gradient(110deg,#f5f5f5,45%,#d4d4d4,55%,#f5f5f5)] dark:bg-[linear-gradient(110deg,#171717,45%,#262626,55%,#171717)] bg-[length:200%_100%] px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:text-neutral-200 transition-colors animate"> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/home/user/portfolio/alcambio/src/components/ShinyBadge.astro", void 0);

const $$Astro$8 = createAstro();
const $$TailwindIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$TailwindIcon;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 54 33"><g clip-path="url(#a)"><path fill="#38bdf8" fill-rule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z" clip-rule="evenodd"></path></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h54v32.4H0z"></path></clipPath></defs></svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/TailwindIcon.astro", void 0);

const $$Astro$7 = createAstro();
const $$ReactIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$ReactIcon;
  return renderTemplate`<!--?xml version="1.0" encoding="UTF-8"?-->${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} width="569px" height="512px" viewBox="0 0 569 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <g fill="none" fill-rule="evenodd"> <g fill="#087EA4" fill-rule="nonzero"> <path d="M285.5,201 C255.400481,201 231,225.400481 231,255.5 C231,285.599519 255.400481,310 285.5,310 C315.599519,310 340,285.599519 340,255.5 C340,225.400481 315.599519,201 285.5,201" id="Path"></path> <path d="M568.959856,255.99437 C568.959856,213.207656 529.337802,175.68144 466.251623,150.985214 C467.094645,145.423543 467.85738,139.922107 468.399323,134.521063 C474.621631,73.0415145 459.808523,28.6686204 426.709856,9.5541429 C389.677085,-11.8291748 337.36955,3.69129898 284.479928,46.0162134 C231.590306,3.69129898 179.282771,-11.8291748 142.25,9.5541429 C109.151333,28.6686204 94.3382249,73.0415145 100.560533,134.521063 C101.102476,139.922107 101.845139,145.443621 102.708233,151.02537 C97.4493791,153.033193 92.2908847,155.161486 87.3331099,157.39017 C31.0111824,182.708821 0,217.765415 0,255.99437 C0,298.781084 39.6220545,336.307301 102.708233,361.003527 C101.845139,366.565197 101.102476,372.066633 100.560533,377.467678 C94.3382249,438.947226 109.151333,483.32012 142.25,502.434597 C153.629683,508.887578 166.52439,512.186771 179.603923,511.991836 C210.956328,511.991836 247.567589,495.487529 284.479928,465.972527 C321.372196,495.487529 358.003528,511.991836 389.396077,511.991836 C402.475265,512.183856 415.36922,508.884856 426.75,502.434597 C459.848667,483.32012 474.661775,438.947226 468.439467,377.467678 C467.897524,372.066633 467.134789,366.565197 466.291767,361.003527 C529.377946,336.347457 569,298.761006 569,255.99437 M389.155214,27.1025182 C397.565154,26.899606 405.877839,28.9368502 413.241569,33.0055186 C436.223966,46.2772304 446.540955,82.2775015 441.522965,131.770345 C441.181741,135.143488 440.780302,138.556788 440.298575,141.990165 C414.066922,134.08804 387.205771,128.452154 360.010724,125.144528 C343.525021,103.224055 325.192524,82.7564475 305.214266,63.9661533 C336.586743,39.7116483 366.032313,27.1025182 389.135142,27.1025182 M378.356498,310.205598 C368.204912,327.830733 357.150626,344.919965 345.237759,361.405091 C325.045049,363.479997 304.758818,364.51205 284.459856,364.497299 C264.167589,364.51136 243.888075,363.479308 223.702025,361.405091 C211.820914,344.919381 200.80007,327.83006 190.683646,310.205598 C180.532593,292.629285 171.306974,274.534187 163.044553,255.99437 C171.306974,237.454554 180.532593,219.359455 190.683646,201.783142 C200.784121,184.229367 211.770999,167.201087 223.601665,150.764353 C243.824636,148.63809 264.145559,147.579168 284.479928,147.591877 C304.772146,147.579725 325.051559,148.611772 345.237759,150.68404 C357.109048,167.14607 368.136094,184.201112 378.27621,201.783142 C388.419418,219.363718 397.644825,237.458403 405.915303,255.99437 C397.644825,274.530337 388.419418,292.625022 378.27621,310.205598 M419.724813,290.127366 C426.09516,307.503536 431.324985,325.277083 435.380944,343.334682 C417.779633,348.823635 399.836793,353.149774 381.668372,356.285142 C388.573127,345.871232 395.263781,335.035679 401.740334,323.778483 C408.143291,312.655143 414.144807,301.431411 419.805101,290.207679 M246.363271,390.377981 C258.848032,391.140954 271.593728,391.582675 284.5,391.582675 C297.406272,391.582675 310.232256,391.140954 322.737089,390.377981 C310.880643,404.583418 298.10766,417.997563 284.5,430.534446 C270.921643,417.999548 258.18192,404.585125 246.363271,390.377981 Z M187.311556,356.244986 C169.137286,353.123646 151.187726,348.810918 133.578912,343.334682 C137.618549,325.305649 142.828222,307.559058 149.174827,290.207679 C154.754833,301.431411 160.736278,312.655143 167.239594,323.778483 C173.74291,334.901824 180.467017,345.864539 187.311556,356.285142 M149.174827,221.760984 C142.850954,204.473938 137.654787,186.794745 133.619056,168.834762 C151.18418,163.352378 169.085653,159.013101 187.211197,155.844146 C180.346585,166.224592 173.622478,176.986525 167.139234,188.210257 C160.65599,199.433989 154.734761,210.517173 149.074467,221.760984 M322.616657,121.590681 C310.131896,120.827708 297.3862,120.385987 284.379568,120.385987 C271.479987,120.385987 258.767744,120.787552 246.242839,121.590681 C258.061488,107.383537 270.801211,93.9691137 284.379568,81.4342157 C297.99241,93.9658277 310.765727,107.380324 322.616657,121.590681 Z M401.70019,188.210257 C395.196875,176.939676 388.472767,166.09743 381.527868,155.68352 C399.744224,158.819049 417.734224,163.151949 435.380944,168.654058 C431.331963,186.680673 426.122466,204.426664 419.785029,221.781062 C414.205023,210.55733 408.203506,199.333598 401.720262,188.230335 M127.517179,131.790423 C122.438973,82.3176579 132.816178,46.2973086 155.778503,33.0255968 C163.144699,28.9632474 171.455651,26.9264282 179.864858,27.1225964 C202.967687,27.1225964 232.413257,39.7317265 263.785734,63.9862316 C243.794133,82.7898734 225.448298,103.270812 208.949132,125.204763 C181.761691,128.528025 154.90355,134.14313 128.661281,141.990165 C128.199626,138.556788 127.778115,135.163566 127.456963,131.790423 M98.4529773,182.106474 C101.54406,180.767925 104.695358,179.429376 107.906872,178.090828 C114.220532,204.735668 122.781793,230.7969 133.498624,255.99437 C122.761529,281.241316 114.193296,307.357063 107.8868,334.058539 C56.7434387,313.076786 27.0971497,284.003505 27.0971497,255.99437 C27.0971497,229.450947 53.1907013,202.526037 98.4529773,182.106474 Z M155.778503,478.963143 C132.816178,465.691432 122.438973,429.671082 127.517179,380.198317 C127.838331,376.825174 128.259842,373.431953 128.721497,369.978497 C154.953686,377.878517 181.814655,383.514365 209.009348,386.824134 C225.500295,408.752719 243.832321,429.233234 263.805806,448.042665 C220.069,481.834331 180.105722,492.97775 155.838719,478.963143 M441.502893,380.198317 C446.520883,429.691161 436.203894,465.691432 413.221497,478.963143 C388.974566,493.017906 348.991216,481.834331 305.274481,448.042665 C325.241364,429.232737 343.566681,408.752215 360.050868,386.824134 C387.245915,383.516508 414.107066,377.880622 440.338719,369.978497 C440.820446,373.431953 441.221885,376.825174 441.563109,380.198317 M461.193488,334.018382 C454.869166,307.332523 446.294494,281.231049 435.561592,255.99437 C446.289797,230.744081 454.857778,204.629101 461.173416,177.930202 C512.216417,198.911955 541.942994,227.985236 541.942994,255.99437 C541.942994,284.003505 512.296705,313.076786 461.153344,334.058539" id="Shape"></path> </g> </g> </svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/ReactIcon.astro", void 0);

const $$Astro$6 = createAstro();
const $$NextJSIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$NextJSIcon;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} xmlns="http://www.w3.org/2000/svg" width="256" height="256" preserveAspectRatio="xMidYMid" viewBox="0 0 256 256"> <defs> <linearGradient id="c" x1="55.633%" x2="83.228%" y1="56.385%" y2="96.08%"> <stop offset="0%" stop-color="#FFF"></stop> <stop offset="100%" stop-color="#FFF" stop-opacity="0"></stop> </linearGradient> <linearGradient id="d" x1="50%" x2="49.953%" y1="0%" y2="73.438%"> <stop offset="0%" stop-color="#FFF"></stop> <stop offset="100%" stop-color="#FFF" stop-opacity="0"></stop> </linearGradient> <circle id="a" cx="128" cy="128" r="128"></circle> </defs> <mask id="b" fill="#fff"> <use xlink:href="#a"></use> </mask> <g mask="url(#b)"> <circle cx="128" cy="128" r="128"></circle> <path fill="url(#c)" d="M212.634 224.028 98.335 76.8H76.8v102.357h17.228V98.68L199.11 234.446a128.433 128.433 0 0 0 13.524-10.418Z"></path> <path fill="url(#d)" d="M163.556 76.8h17.067v102.4h-17.067z"></path> </g> </svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/NextJSIcon.astro", void 0);

const $$Astro$5 = createAstro();
const $$TypeScriptIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$TypeScriptIcon;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} viewBox="0 0 256 256" width="256" height="256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M20 0h216c11.046 0 20 8.954 20 20v216c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0Z" fill="#3178C6"></path><path d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179 6.133 1.151 12.597 1.726 19.393 1.726 6.622 0 12.914-.633 18.874-1.899 5.96-1.266 11.187-3.352 15.678-6.257 4.492-2.906 8.048-6.704 10.669-11.394 2.62-4.689 3.93-10.486 3.93-17.391 0-5.006-.749-9.394-2.246-13.163a30.748 30.748 0 0 0-6.479-10.055c-2.821-2.935-6.205-5.567-10.149-7.898-3.945-2.33-8.394-4.531-13.347-6.602-3.628-1.497-6.881-2.949-9.761-4.359-2.879-1.41-5.327-2.848-7.342-4.316-2.016-1.467-3.571-3.021-4.665-4.661-1.094-1.64-1.641-3.495-1.641-5.567 0-1.899.489-3.61 1.468-5.135s2.362-2.834 4.147-3.927c1.785-1.094 3.973-1.942 6.565-2.547 2.591-.604 5.471-.906 8.638-.906 2.304 0 4.737.173 7.299.518 2.563.345 5.14.877 7.732 1.597a53.669 53.669 0 0 1 7.558 2.719 41.7 41.7 0 0 1 6.781 3.797v-25.807c-4.204-1.611-8.797-2.805-13.778-3.582-4.981-.777-10.697-1.165-17.147-1.165-6.565 0-12.784.705-18.658 2.115-5.874 1.409-11.043 3.61-15.506 6.602-4.463 2.993-7.99 6.805-10.582 11.437-2.591 4.632-3.887 10.17-3.887 16.615 0 8.228 2.375 15.248 7.127 21.06 4.751 5.811 11.963 10.731 21.638 14.759a291.458 291.458 0 0 1 10.625 4.575c3.283 1.496 6.119 3.049 8.509 4.66 2.39 1.611 4.276 3.366 5.658 5.265 1.382 1.899 2.073 4.057 2.073 6.474a9.901 9.901 0 0 1-1.296 4.963c-.863 1.524-2.174 2.848-3.93 3.97-1.756 1.122-3.945 1.999-6.565 2.632-2.62.633-5.687.95-9.2.95-5.989 0-11.92-1.05-17.794-3.151-5.875-2.1-11.317-5.25-16.327-9.451Zm-46.036-68.733H140V109H41v22.742h35.345V233h28.137V131.742Z" fill="#FFF"></path></svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/TypeScriptIcon.astro", void 0);

const $$Astro$4 = createAstro();
const $$JavaScriptIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$JavaScriptIcon;
  return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(Astro2.props)} xmlns="http://www.w3.org/2000/svg" width="2500" height="2500" viewBox="0 0 1052 1052"><path fill="#f0db4f" d="M0 0h1052v1052H0z"></path><path d="M965.9 801.1c-7.7-48-39-88.3-131.7-125.9-32.2-14.8-68.1-25.399-78.8-49.8-3.8-14.2-4.3-22.2-1.9-30.8 6.9-27.9 40.2-36.6 66.6-28.6 17 5.7 33.1 18.801 42.8 39.7 45.4-29.399 45.3-29.2 77-49.399-11.6-18-17.8-26.301-25.4-34-27.3-30.5-64.5-46.2-124-45-10.3 1.3-20.699 2.699-31 4-29.699 7.5-58 23.1-74.6 44-49.8 56.5-35.6 155.399 25 196.1 59.7 44.8 147.4 55 158.6 96.9 10.9 51.3-37.699 67.899-86 62-35.6-7.4-55.399-25.5-76.8-58.4-39.399 22.8-39.399 22.8-79.899 46.1 9.6 21 19.699 30.5 35.8 48.7 76.2 77.3 266.899 73.5 301.1-43.5 1.399-4.001 10.6-30.801 3.199-72.101zm-394-317.6h-98.4c0 85-.399 169.4-.399 254.4 0 54.1 2.8 103.7-6 118.9-14.4 29.899-51.7 26.2-68.7 20.399-17.3-8.5-26.1-20.6-36.3-37.699-2.8-4.9-4.9-8.7-5.601-9-26.699 16.3-53.3 32.699-80 49 13.301 27.3 32.9 51 58 66.399 37.5 22.5 87.9 29.4 140.601 17.3 34.3-10 63.899-30.699 79.399-62.199 22.4-41.3 17.6-91.3 17.4-146.6.5-90.2 0-180.4 0-270.9z" fill="#323330"></path></svg>`;
}, "/home/user/portfolio/alcambio/src/components/icons/JavaScriptIcon.astro", void 0);

const $$Subtitle = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="flex w-full items-center justify-between"> <h2 class="text-xl font-medium mt-12 mb-3"> ${renderSlot($$result, $$slots["default"])} </h2> </div>`;
}, "/home/user/portfolio/alcambio/src/components/Subtitle.astro", void 0);

// Original Source: https://reemus.dev/article/disable-css-transition-color-scheme-change#heading-ultimate-solution-for-changing-color-scheme-without-transitions
let timeoutAction;
let timeoutEnable;
// Perform a task without any css transitions
// eslint-disable-next-line ts/no-explicit-any
function withoutTransition(action) {
    if (typeof document === "undefined")
        return;
    // Clear fallback timeouts
    clearTimeout(timeoutAction);
    clearTimeout(timeoutEnable);
    // Create style element to disable transitions
    const style = document.createElement("style");
    const css = document.createTextNode(`* {
     -webkit-transition: none !important;
     -moz-transition: none !important;
     -o-transition: none !important;
     -ms-transition: none !important;
     transition: none !important;
  }`);
    style.appendChild(css);
    // Functions to insert and remove style element
    const disable = () => document.head.appendChild(style);
    const enable = () => document.head.removeChild(style);
    // Best method, getComputedStyle forces browser to repaint
    if (typeof window.getComputedStyle !== "undefined") {
        disable();
        action();
        // eslint-disable-next-line ts/no-unused-expressions -- this is a side effect
        window.getComputedStyle(style).opacity;
        enable();
        return;
    }
    // Better method, requestAnimationFrame processes function before next repaint
    if (typeof window.requestAnimationFrame !== "undefined") {
        disable();
        action();
        window.requestAnimationFrame(enable);
        return;
    }
    // Fallback
    disable();
    timeoutAction = window.setTimeout(() => {
        action();
        timeoutEnable = window.setTimeout(enable, 120);
    }, 120);
}

/**
 * Santizes an array of classnames by removing any empty strings.
 */
function sanitizeClassNames(classNames) {
    return classNames.filter((className) => className.length > 0);
}

// saves having to branch for server vs client
const noopStorage = {
    getItem: (_key) => null,
    setItem: (_key, _value) => { },
};
// whether we are running on server vs client
const isBrowser = typeof document !== "undefined";
/**  the modes that are supported, used for validation & type derivation */
const modes = ["dark", "light", "system"];
/**
 * The key used to store the `mode` in localStorage.
 */
const modeStorageKey = writable("mode-watcher-mode");
/**
 * The key used to store the `theme` in localStorage.
 */
const themeStorageKey = writable("mode-watcher-theme");
/**
 * Writable store that represents the user's preferred mode (`"dark"`, `"light"` or `"system"`)
 */
const userPrefersMode = createUserPrefersMode();
/**
 * Readable store that represents the system's preferred mode (`"dark"`, `"light"` or `undefined`)
 */
const systemPrefersMode = createSystemMode();
/**
 * Theme colors for light and dark modes.
 */
const themeColors = writable(undefined);
/**
 * A custom theme to apply and persist to the root `html` element.
 */
const theme = createCustomTheme();
/**
 * Whether to disable transitions when changing the mode.
 */
const disableTransitions = writable(true);
/**
 * The classnames to add to the root `html` element when the mode is dark.
 */
const darkClassNames = writable([]);
/**
 * The classnames to add to the root `html` element when the mode is light.
 */
const lightClassNames = writable([]);
/**
 * Derived store that represents the current mode (`"dark"`, `"light"` or `undefined`)
 */
const derivedMode = createDerivedMode();
/**
 * Derived store that represents the current custom theme
 */
createDerivedTheme();
// derived from: https://github.com/CaptainCodeman/svelte-web-storage
function createUserPrefersMode() {
    const defaultValue = "system";
    const storage = isBrowser ? localStorage : noopStorage;
    const initialValue = storage.getItem(getModeStorageKey());
    let value = isValidMode(initialValue) ? initialValue : defaultValue;
    function getModeStorageKey() {
        return get(modeStorageKey);
    }
    const { subscribe, set: _set } = writable(value, () => {
        if (!isBrowser)
            return;
        const handler = (e) => {
            if (e.key !== getModeStorageKey())
                return;
            const newValue = e.newValue;
            if (isValidMode(newValue)) {
                _set((value = newValue));
            }
            else {
                _set((value = defaultValue));
            }
        };
        addEventListener("storage", handler);
        return () => removeEventListener("storage", handler);
    });
    function set(v) {
        _set((value = v));
        storage.setItem(getModeStorageKey(), value);
    }
    return {
        subscribe,
        set,
    };
}
function createCustomTheme() {
    const storage = isBrowser ? localStorage : noopStorage;
    const initialValue = storage.getItem(getThemeStorageKey());
    let value = initialValue === null || initialValue === undefined ? "" : initialValue;
    function getThemeStorageKey() {
        return get(themeStorageKey);
    }
    const { subscribe, set: _set } = writable(value, () => {
        if (!isBrowser)
            return;
        const handler = (e) => {
            if (e.key !== getThemeStorageKey())
                return;
            const newValue = e.newValue;
            if (newValue === null) {
                _set((value = ""));
            }
            else {
                _set((value = newValue));
            }
        };
        addEventListener("storage", handler);
        return () => removeEventListener("storage", handler);
    });
    function set(v) {
        _set((value = v));
        storage.setItem(getThemeStorageKey(), value);
    }
    return {
        subscribe,
        set,
    };
}
function createSystemMode() {
    const defaultValue = undefined;
    let track = true;
    const { subscribe, set } = writable(defaultValue, () => {
        if (!isBrowser)
            return;
        const handler = (e) => {
            if (!track)
                return;
            set(e.matches ? "light" : "dark");
        };
        const mediaQueryState = window.matchMedia("(prefers-color-scheme: light)");
        mediaQueryState.addEventListener("change", handler);
        return () => mediaQueryState.removeEventListener("change", handler);
    });
    /**
     * Query system preferences and update the store.
     */
    function query() {
        if (!isBrowser)
            return;
        const mediaQueryState = window.matchMedia("(prefers-color-scheme: light)");
        set(mediaQueryState.matches ? "light" : "dark");
    }
    /**
     * Enable or disable tracking of system preference changes.
     */
    function tracking(active) {
        track = active;
    }
    return {
        subscribe,
        query,
        tracking,
    };
}
function createDerivedMode() {
    const { subscribe } = derived([
        userPrefersMode,
        systemPrefersMode,
        themeColors,
        disableTransitions,
        darkClassNames,
        lightClassNames,
    ], ([$userPrefersMode, $systemPrefersMode, $themeColors, $disableTransitions, $darkClassNames, $lightClassNames,]) => {
        if (!isBrowser)
            return undefined;
        const derivedMode = $userPrefersMode === "system" ? $systemPrefersMode : $userPrefersMode;
        const sanitizedDarkClassNames = sanitizeClassNames($darkClassNames);
        const sanitizedLightClassNames = sanitizeClassNames($lightClassNames);
        function update() {
            const htmlEl = document.documentElement;
            const themeColorEl = document.querySelector('meta[name="theme-color"]');
            if (derivedMode === "light") {
                if (sanitizedDarkClassNames.length)
                    htmlEl.classList.remove(...sanitizedDarkClassNames);
                if (sanitizedLightClassNames.length)
                    htmlEl.classList.add(...sanitizedLightClassNames);
                htmlEl.style.colorScheme = "light";
                if (themeColorEl && $themeColors) {
                    themeColorEl.setAttribute("content", $themeColors.light);
                }
            }
            else {
                if (sanitizedLightClassNames.length)
                    htmlEl.classList.remove(...sanitizedLightClassNames);
                if (sanitizedDarkClassNames.length)
                    htmlEl.classList.add(...sanitizedDarkClassNames);
                htmlEl.style.colorScheme = "dark";
                if (themeColorEl && $themeColors) {
                    themeColorEl.setAttribute("content", $themeColors.dark);
                }
            }
        }
        if ($disableTransitions) {
            withoutTransition(update);
        }
        else {
            update();
        }
        return derivedMode;
    });
    return {
        subscribe,
    };
}
function createDerivedTheme() {
    const { subscribe } = derived([theme, disableTransitions], ([$theme, $disableTransitions]) => {
        if (!isBrowser)
            return undefined;
        function update() {
            const htmlEl = document.documentElement;
            htmlEl.setAttribute("data-theme", $theme);
        }
        if ($disableTransitions) {
            withoutTransition(update);
        }
        else {
            update();
        }
        return $theme;
    });
    return {
        subscribe,
    };
}
function isValidMode(value) {
    if (typeof value !== "string")
        return false;
    return modes.includes(value);
}

function Test($$payload, $$props) {
	var $$store_subs;
	let position = { x: 0, y: 0 };
	let opacity = 0;

	$$payload.out += `<div role="contentinfo" class="relative flex flex-col rounded-md border-[1px] border-neutral-300 px-3 py-4 shadow-sm dark:border-neutral-800 bg-neutral-200/80 dark:bg-neutral-900"><input aria-hidden="true"${attr('class', `pointer-events-none absolute left-0 top-0 z-10 h-full w-full cursor-default rounded-[0.310rem] border transition-opacity duration-500 placeholder:select-none ${stringify(store_get($$store_subs ??= {}, '$mode', derivedMode) === 'dark' ? 'border-white/50' : 'border-gray-500')} `)}${attr('style', ` opacity: ${stringify(opacity)}; -webkit-mask-image: radial-gradient(30% 30px at ${stringify(position.x)}px ${stringify(position.y)}px, black 45%, transparent); background-color: transparent; `)}> <div class="absolute -inset-px rounded-md opacity-0 transition duration-300 pointer-events-none"${attr('style', ` opacity: ${stringify(opacity)}; background: radial-gradient(600px circle at ${stringify(position.x)}px ${stringify(position.y)}px, rgba(97, 97, 97, 0.1), transparent 60%); `)}></div> <!---->`;
	slot($$payload, $$props, 'default', {});
	$$payload.out += `<!----></div>`;
	if ($$store_subs) unsubscribe_stores($$store_subs);
}

const $$Astro$3 = createAstro();
const $$ProjectCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ProjectCard;
  const { currentLocale } = Astro2;
  const i18n = getI18N({ currentLocale });
  const TAGS = {
    ASTRO: {
      name: "Astro 5",
      class: "bg-neutral-800 text-white",
      icon: $$AstroIcon
    },
    TAILWIND: {
      name: "TailwindCSS",
      class: "bg-neutral-800 text-white",
      icon: $$TailwindIcon
    },
    NEXTJS: {
      name: "Next.js",
      class: "bg-neutral-800 text-white",
      icon: $$NextJSIcon
    },
    TYPESCRIPT: {
      name: "TypeScript",
      class: "bg-neutral-800 text-white",
      icon: $$TypeScriptIcon
    },
    REACT: {
      name: "React",
      class: "bg-neutral-800 text-white",
      icon: $$ReactIcon
    }
  };
  const PROJECTS = [
    {
      icon: "/projects/icons/vecambio.svg",
      title: "VeCambio",
      description: `${i18n.PROJECT_DESCRIPTION_ONE}`,
      url: "https://vecambio.vercel.app",
      project_image: "/projects/vecambio-project.webp",
      tags: [TAGS.NEXTJS, TAGS.REACT, TAGS.TYPESCRIPT, TAGS.TAILWIND],
      latest: true
    },
    {
      icon: "/projects/icons/gitguide.webp",
      title: "GitGuide",
      description: `${i18n.PROJECT_DESCRIPTION_TWO}`,
      url: "https://gitguide.vercel.app",
      github_url: "https://github.com/angelurrutdev/gitguide",
      project_image: "/projects/gitguide-project.webp",
      tags: [TAGS.ASTRO],
      updated: true
    }
  ];
  function getBadgeText(project) {
    if (project.latest) return "latest";
    if (project.updated) return "updated";
    return "";
  }
  return renderTemplate`${renderComponent($$result, "Subtitle", $$Subtitle, {}, { "default": ($$result2) => renderTemplate`${i18n.PROJECTS_PRE_TITLE}` })} ${maybeRenderHead()}<section class="grid flex-col grid-cols-1 gap-3 max-w-2xl duration-500 delay-100 fill-mode-backwards md:max-w-5xl md:grid-cols-2"> ${PROJECTS.map(
    ({
      icon,
      title,
      description,
      github_url,
      url,
      tags,
      latest,
      updated,
      project_image
    }) => renderTemplate`${renderComponent($$result, "Test", Test, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/user/portfolio/alcambio/src/components/Test.svelte", "client:component-export": "default" }, { "default": ($$result2) => renderTemplate` <div class="flex flex-col space-y-3"> <div class="flex justify-between items-center w-full"> <div class="flex items-center space-x-[10px]"> <img${addAttribute(icon, "src")}${addAttribute(title, "alt")} class="rounded-md size-6"> <a${addAttribute(url, "href")} target="_blank" rel="noopener noreferrer" class="group flex items-center gap-[6px] font-medium decoration-neutral-500 decoration-dotted underline-offset-[5px] hover:underline"> <span>${title}</span> ${renderComponent($$result2, "Link", $$Link, {})} </a> </div> <div class="flex gap-2 items-center"> ${renderComponent($$result2, "ShinyBadge", $$ShinyBadge, {}, { "default": ($$result3) => renderTemplate`${getBadgeText({ latest, updated })}` })} ${github_url && renderTemplate`<a${addAttribute(github_url, "href")}${addAttribute(`View ${title} repository on GitHub`, "title")} target="_blank" rel="noopener noreferrer" class="opacity-75 transition-opacity duration-100 hover:opacity-100"> ${renderComponent($$result2, "GitHub", $$GitHub, { "class": "inline-flex justify-center items-center space-x-3 text-sm font-medium whitespace-nowrap rounded-md opacity-80 transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-700 focus-visible:ring-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 hover:opacity-100 size-5" })} </a>`} </div> </div> <p class="text-sm font-semibold truncate dark:text-neutral-400"> ${description} </p> ${project_image && renderTemplate`<a${addAttribute(url, "href")}> ${renderComponent($$result2, "Image", $$Image, { "src": project_image, "alt": `Imagen de ${title}`, "width": 480, "height": 270, "loading": "lazy", "class": "object-cover rounded-md transition duration-500 hover:scale-90" })} </a>`} <div class="flex overflow-x-auto items-center py-1 md:space-x-2"> ${tags.map((tag) => renderTemplate`<div class="flex items-center space-x-1"> <span${addAttribute(`inline-flex items-center px-2 py-1 space-x-2 font-mono text-xs font-medium rounded-md border border-neutral-300 bg-neutral-200/50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300 ${tag.class}`, "class")}> ${renderComponent($$result2, "tag.icon", tag.icon, { "class": "mx-1 size-4" })} ${tag.name} </span> </div>`)} </div> </div> ` })}`
  )} </section>`;
}, "/home/user/portfolio/alcambio/src/components/ProjectCard.astro", void 0);

const $$Astro$2 = createAstro();
const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$HeroSection;
  const { currentLocale } = Astro2;
  const i18n = getI18N({ currentLocale });
  return renderTemplate`${maybeRenderHead()}<div class="max-w-2xl md:max-w-5xl"> <div class="mb-1 justify-center items-center flex"> <a${addAttribute(Socials.linkedin_url, "href")} target="_blank" rel="noopener" class="flex items-center transition md:justify-center md:hover:scale-105"></a> </div> <h1 class="text-center text-4xl font-bold tracking-tight text-gray-800 sm:text-5xl dark:text-white mb-2"> ${i18n.HERO_TITLE} </h1> <p class="max-w-xl mx-auto items-center justify-center text-center text-pretty">${unescapeHTML(i18n.HERO_DESCRIPTION)}</p> </div>`;
}, "/home/user/portfolio/alcambio/src/components/HeroSection.astro", void 0);

const $$Astro$1 = createAstro();
const $$HaveAProject = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$HaveAProject;
  const { currentLocale } = Astro2;
  const i18n = getI18N({ currentLocale });
  return renderTemplate`${maybeRenderHead()}<section class="py-12 flex flex-col justify-center items-center text-neutral-700 dark:text-neutral-300"> <div class=""> <h2 class="font-bold md:text-5xl text-4xl text-center my-8 md:my-0 text-pretty"> ${i18n.HAVE_PROJECT_TITLE} </h2> <p class="text-center text-4xl font-semibold mb-2"> ${i18n.HAVE_PROJECT_SUBTITLE} </p> </div> <div class="my-2 flex items-center flex-row"> ${renderComponent($$result, "SocialPill", $$SocialPill, { "href": "", "title": Socials.email_title, "target": "_blank", "class": "flex items-center p-2 justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-700 focus-visible:ring-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 opacity-80 transition-opacity duration-150 hover:opacity-100" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LinkedIn", $$LinkedIn, { "class": "size-5 mx-1" })} <div class="flex items-center"> <span class="lg:flex ml-1">LinkedIn </span> </div> ` })} ${renderComponent($$result, "SocialPill", $$SocialPill, { "href": `mailto:${Socials.email_url}?Subject=Interesado%20en%20en%20trabajar%20juntos%20en%20un%20proyecto`, "`": true, "title": Socials.email_title, "target": "_blank", "class": "flex items-center p-2 justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-700 focus-visible:ring-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 opacity-80 transition-opacity duration-150 hover:opacity-100" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Mail", $$Mail, { "class": "size-5 mx-1" })} <div class="flex items-center"> <span class="lg:flex ml-1">${i18n.HAVE_PROJECT_CONTACT} </span> </div> ` })} </div> </section>`;
}, "/home/user/portfolio/alcambio/src/components/HaveAProject.astro", void 0);

const $$Astro = createAstro();
const $$App = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$App;
  const { currentLocale } = Astro2;
  const i18n = getI18N({ currentLocale });
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${i18n.SEO_TITLE}`, "description": `${i18n.SEO_DESCRIPTION}` }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderComponent($$result2, "HeroSection", $$HeroSection, {})} ${renderComponent($$result2, "Projects", $$ProjectCard, {})} ${renderComponent($$result2, "HaveAProject", $$HaveAProject, {})} </main> ` })}`;
}, "/home/user/portfolio/alcambio/src/components/App.astro", void 0);

export { $$App as $ };
