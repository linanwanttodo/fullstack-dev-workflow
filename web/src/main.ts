import "./style.css";
import { STATIC, INVARIANTS, PRINCIPLES, LIFECYCLE, REF_GROUPS, type Lang } from "./i18n";

let lang: Lang = "zh";

const $ = <T extends HTMLElement>(sel: string): T => {
  const el = document.querySelector<T>(sel);
  if (!el) throw new Error(`missing element: ${sel}`);
  return el;
};

function renderStatic(lang: Lang): void {
  const t = STATIC[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key && t[key]) el.textContent = t[key];
  });
}

function renderList(sel: string, data: { zh: string; en: string }[], template: (d: { zh: string; en: string }, i: number) => string): void {
  const el = $(sel);
  el.innerHTML = data.map(template).join("");
}

function renderReferences(lang: Lang): void {
  const grid = $("#ref-grid");
  grid.innerHTML = REF_GROUPS.map((group) => {
    const groupName = lang === "zh" ? group.zh : group.en;
    const items = group.items
      .map((item) => {
        const label = lang === "zh" ? item.zh : item.en;
        return `<li class="ref-item"><code class="ref-file">${item.file}</code><span class="ref-label">${label}</span></li>`;
      })
      .join("");
    return `<div class="ref-group"><h3 class="ref-group-title">${groupName}</h3><ul class="ref-items">${items}</ul></div>`;
  }).join("");
}

function renderAll(): void {
  renderStatic(lang);
  renderList("#inv-list", INVARIANTS, (d, i) => `<li><span class="idx">${String(i + 1).padStart(2, "0")}</span><span>${lang === "zh" ? d.zh : d.en}</span></li>`);
  renderList("#pri-list", PRINCIPLES, (d, i) => `<li><span class="idx">${String(i + 1).padStart(2, "0")}</span><span>${lang === "zh" ? d.zh : d.en}</span></li>`);
  renderList("#life-list", LIFECYCLE, (d, i) => `<li><span class="idx">${String(i + 1).padStart(2, "0")}</span><span>${lang === "zh" ? d.zh : d.en}</span></li>`);
  renderReferences(lang);
}

function setLang(next: Lang): void {
  if (next === lang) return;
  lang = next;
  renderAll();
  $("#lang-zh").classList.toggle("is-active", lang === "zh");
  $("#lang-en").classList.toggle("is-active", lang === "en");
}

function initLangSwitch(): void {
  $("#lang-zh").addEventListener("click", () => setLang("zh"));
  $("#lang-en").addEventListener("click", () => setLang("en"));
}

function initReveal(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll<HTMLElement>(".section").forEach((el) => observer.observe(el));
  document.querySelectorAll<HTMLElement>(".hero").forEach((el) => el.classList.add("is-revealed"));
}

renderAll();
initLangSwitch();
initReveal();