/* empty css                                 */
import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_DhGomCES.mjs';
import 'kleur/colors';
import { $ as $$App } from '../chunks/App_DVhLkbdl.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_D9-9ZLb9.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "App", $$App, {})}`;
}, "/home/user/portfolio/alcambio/src/pages/index.astro", void 0);

const $$file = "/home/user/portfolio/alcambio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
