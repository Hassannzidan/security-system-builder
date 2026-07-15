/**
 * Tailwind plugin: semantic typography role classes.
 *
 * Generates exactly one component class per role in `textStyles`, kebab-cased and
 * prefixed with `text-` (e.g. `eyebrow` → `.text-eyebrow`, `reviewTitle` →
 * `.text-review-title`). Each class carries the role's `base` declarations plus a
 * `@media (min-width: …)` block for each of sm / lg / wide the role overrides.
 *
 * Typography-only: the roles never emit color / text-align / vertical-align, so
 * these classes are safe to combine with the color/layout classes already on the
 * call sites. Emitted into the `components` layer, so any leftover Tailwind
 * *utility* on the same element still wins — migrations remove the utilities the
 * role replaces.
 *
 * Single source of truth: role data + breakpoints come from `./typography`, which
 * derives its breakpoints from `./breakpoints`. Nothing is duplicated here.
 */
import plugin from 'tailwindcss/plugin';

import { textStyles, typographyScreens } from './typography';

/** camelCase style key → kebab CSS property name. */
const CSS_PROP = {
  fontFamily: 'font-family',
  fontWeight: 'font-weight',
  fontSize: 'font-size',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  textTransform: 'text-transform',
  textDecoration: 'text-decoration',
  fontStyle: 'font-style',
  fontVariantNumeric: 'font-variant-numeric',
};

/** `stepTitle` → `text-step-title` (the class selector minus the leading dot). */
function toClassName(role) {
  const kebab = role.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  return `text-${kebab}`;
}

/** Turn a role variant into a CSS declaration object with kebab property names. */
function toDeclarations(variant) {
  const out = {};
  for (const [key, value] of Object.entries(variant)) {
    const prop = CSS_PROP[key];
    if (!prop || value === undefined) continue;
    out[prop] = typeof value === 'number' ? String(value) : value;
  }
  return out;
}

export default plugin(({ addComponents }) => {
  // Ascending min-width order so wider overrides win via source order.
  const screenOrder = ['sm', 'lg', 'wide'];
  const components = {};

  for (const [role, def] of Object.entries(textStyles)) {
    const rule = { ...toDeclarations(def.base) };

    for (const screen of screenOrder) {
      if (!def[screen]) continue;
      const decls = toDeclarations(def[screen]);
      if (Object.keys(decls).length === 0) continue;
      rule[`@media (min-width: ${typographyScreens[screen]})`] = decls;
    }

    components[`.${toClassName(role)}`] = rule;
  }

  addComponents(components);
});
