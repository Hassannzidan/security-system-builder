/**
 * Split a plan title into a leading part and an accent part for two-tone rendering,
 * breaking at the LAST space so the final word is emphasised ("Cam" + "Unlimited").
 *
 * Edge cases: a single-word title (no space) yields an empty `head` and the whole
 * title as `tail`; an empty string yields both empty; a trailing space puts the
 * spaces in `head` and leaves `tail` empty. The separating space is not included
 * in either field — call sites re-insert it as their own markup requires.
 */
export function splitTitleForTwoTone(title: string): { head: string; tail: string } {
  const lastSpace = title.lastIndexOf(' ');
  if (lastSpace < 0) {
    return { head: '', tail: title };
  }
  return { head: title.slice(0, lastSpace), tail: title.slice(lastSpace + 1) };
}
