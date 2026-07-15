import { useEffect, useRef, useState } from 'react';

import { colors } from '@/design-tokens';

import type { SaveForLaterProps } from './types';

/** How long the "Saved ✓" confirmation stays up before reverting to the link. */
const SAVED_FEEDBACK_MS = 2000;

/** Save-for-later feedback: idle link, transient success, or a persistent error. */
type SaveStatus = 'idle' | 'saved' | 'error';

const SAVE_LABELS: Record<SaveStatus, string> = {
  idle: 'Save my system for later',
  saved: 'Saved ✓',
  error: "Couldn't save — check browser storage settings",
};

/**
 * Save-for-later link that doubles as its own feedback slot: it persists the
 * system via the injected `onSave` callback and owns the transient "Saved ✓"
 * success (auto-reverting after {@link SAVED_FEEDBACK_MS}) or a persistent error.
 */
export function SaveForLater({ onSave }: SaveForLaterProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (revertTimer.current) clearTimeout(revertTimer.current);
    },
    [],
  );

  const handleSave = () => {
    if (revertTimer.current) clearTimeout(revertTimer.current);
    const succeeded = onSave();
    if (succeeded) {
      setSaveStatus('saved');
      revertTimer.current = setTimeout(() => setSaveStatus('idle'), SAVED_FEEDBACK_MS);
    } else {
      setSaveStatus('error');
    }
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saveStatus === 'saved'}
      aria-live="polite"
      className="text-save-link mx-auto underline disabled:cursor-default disabled:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:rounded-sm"
      style={{
        color: saveStatus === 'error' ? colors.status.error : colors.primary.DEFAULT,
      }}
    >
      {SAVE_LABELS[saveStatus]}
    </button>
  );
}
