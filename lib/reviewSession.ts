const SESSION_KEY = "notecards.reviewSession";

export type ReviewSessionState = {
  deckId: string;
  remaining: number;
};

export function getActiveReviewSession(): ReviewSessionState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as ReviewSessionState;
    if (parsed.deckId && typeof parsed.remaining === "number" && parsed.remaining > 0) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function setActiveReviewSession(session: ReviewSessionState) {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearActiveReviewSession() {
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function confirmLeaveReviewSession() {
  const session = getActiveReviewSession();
  if (!session) {
    return true;
  }

  return window.confirm(
    `You still have ${session.remaining} card${session.remaining === 1 ? "" : "s"} left in this review session. Leave anyway?`,
  );
}
