let currentSession = null;

function setSession(session) {
  currentSession = session;
}

function getSession() {
  return currentSession;
}

function clearSession() {
  currentSession = null;
}

function hasSession() {
  return Boolean(currentSession);
}

module.exports = {
  setSession,
  getSession,
  clearSession,
  hasSession
};