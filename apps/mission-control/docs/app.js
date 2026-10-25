(() => {
  const cfg = window.HR_RUSH_CONFIG;
  const tokenKey = "hr_rush_id_token";
  const app = document.querySelector("#app");
  const auth = document.querySelector("#auth");
  let selectedMission = null;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#039;"}[c]));
  const token = () => localStorage.getItem(tokenKey);
  const api = async (path, options = {}) => {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (token()) headers.Authorization = `Bearer ${token()}`;
    const res = await fetch(cfg.apiBaseUrl + path, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Заявката не успя");
    return data;
  };
  const loginUrl = () => `${cfg.cognitoDomain}/oauth2/authorize?client_id=${encodeURIComponent(cfg.clientId)}&response_type=token&scope=openid+email+profile&redirect_uri=${encodeURIComponent(cfg.redirectUri)}&identity_provider=Google`;
  const logout = () => { localStorage.removeItem(tokenKey); location.reload(); };
  const readHashToken = () => { const params = new URLSearchParams(location.hash.slice(1)); const value = params.get("id_token"); if (value) { localStorage.setItem(tokenKey, value); history.replaceState(null, "", location.pathname); } };
  const statusLabel = status => ({ pending:"За проверка", approved:"Одобрена", changes_requested:"За корекция", rejected:"Отхвърлена" }[status] || "Не е изпратена");

  async function render() {
    readHashToken();
    if (!token() || cfg.apiBaseUrl.startsWith("REPLACE")) {
      auth.innerHTML = `<button id="login">Вход с Google</button>`;
      document.querySelector("#login").onclick = () => location.href = loginUrl();
      return;
    }
    auth.innerHTML = `<button class="secondary" id="logout">Изход</button>`;
    document.querySelector("#logout").onclick = logout;
    try {
      const [missions, submissions, team, notifications] = await Promise.all([api("/missions"), api("/my-submissions"), api("/team"), api("/notifications")]);
      const byMission = Object.fromEntries(submissions.map(s => [s.missionId, s]));
      const unread = notifications.filter(n => !n.isRead).length;
      app.innerHTML = `<div class="topline"><div><h1>Твоите мисии</h1><p class="muted">Изпращай доказателства, следи бележките и печели точки.</p></div><strong>🔔 ${unread}</strong></div>${notifications.length ? `<div class="card"><h2>Известия</h2>${notifications.slice(0, 5).map(n => `<p><strong>${esc(n.title)}</strong> — ${esc(n.message)}</p>`).join("")}</div>` : ""}${team.team ? `<div class="card"><h2>${esc(team.team.name || "Моят отбор")}</h2><p>${Number(team.team.missionPoints || 0)} точки от мисии · ${team.members.length} участници</p></div>` : ""}<h2>Мисии</h2><div class="grid">${missions.map(m => { const s = byMission[m.id]; return `<article class="card"><div class="topline"><span class="status">${esc(statusLabel(s?.status))}</span><strong>${Number(m.points || 0)} т.</strong></div><h3>${esc(m.title)}</h3><p class="muted">${esc(m.description)}</p><p><small>${esc(m.category || "Мисия")}</small></p>${s?.reviewComment ? `<p><strong>Бележка:</strong> ${esc(s.reviewComment)}</p>` : ""}${m.contactUrl ? `<p><a href="${esc(m.contactUrl)}" target="_blank" rel="noreferrer">${esc(m.contactLabel || "Свържи се със създателя")}</a></p>` : ""}<button data-mission="${esc(m.id)}">${s?.status === "approved" ? "Виж изпълнението" : "Изпрати доказателство"}</button></article>`; }).join("")}</div>`;
      document.querySelectorAll("[data-mission]").forEach(btn => btn.onclick = () => openSubmit(missions.find(m => m.id === btn.dataset.mission), byMission[btn.dataset.mission]));
    } catch (error) { app.innerHTML = `<div class="card"><h2>Неуспешно зареждане</h2><p>${esc(error.message)}</p></div>`; }
  }
  function openSubmit(mission, submission) {
    selectedMission = mission; document.querySelector("#dialogTitle").textContent = mission.title; document.querySelector("#evidenceLink").value = submission?.evidence?.link || ""; document.querySelector("#evidenceNote").value = submission?.evidence?.note || ""; document.querySelector("#submitDialog").showModal();
  }
  document.querySelector("#submitForm").addEventListener("submit", async e => { e.preventDefault(); try { await api(`/missions/${selectedMission.id}/submit`, { method:"POST", body: JSON.stringify({ link: document.querySelector("#evidenceLink").value, note: document.querySelector("#evidenceNote").value }) }); document.querySelector("#submitDialog").close(); await render(); } catch (error) { alert(error.message); } });
  render();
})();
