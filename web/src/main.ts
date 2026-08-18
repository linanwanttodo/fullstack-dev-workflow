import "./style.css";
import { STATIC, PROMPT, INVARIANTS, PRINCIPLES, LIFECYCLE, REF_GROUPS, FLOW_ROWS, FLOW_BRANCH, type Lang } from "./i18n";

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

function renderPrinciples(lang: Lang): void {
  const ul = $("#pri-list");
  ul.innerHTML = PRINCIPLES.map((p, i) => {
    const shame = lang === "zh" ? p.shame.zh : p.shame.en;
    const honor = lang === "zh" ? p.honor.zh : p.honor.en;
    return `<li class="pri-item"><span class="idx">${String(i + 1).padStart(2, "0")}</span><div class="pri-text"><span class="pri-shame">${shame}</span><span class="pri-honor">${honor}</span></div></li>`;
  }).join("");
}

function renderAll(): void {
  renderStatic(lang);
  renderList("#inv-list", INVARIANTS, (d, i) => `<li><span class="idx">${String(i + 1).padStart(2, "0")}</span><span>${lang === "zh" ? d.zh : d.en}</span></li>`);
  renderPrinciples(lang);
  renderList("#life-list", LIFECYCLE, (d, i) => `<li><span class="idx">${String(i + 1).padStart(2, "0")}</span><span>${lang === "zh" ? d.zh : d.en}</span></li>`);
  renderReferences(lang);
  renderFlow(lang);
}

function renderFlow(lang: Lang): void {
  const flow = $("#life-flow");
  flow.innerHTML =
    FLOW_ROWS.map((row) => {
      const cells = row
        .map((n) => {
          const dec = n.decision ? " flow-node-decision" : "";
          const num = n.num ? `<span class="flow-num">${n.num}</span>` : "";
          const ref = n.ref ? `<span class="flow-ref">${n.ref}</span>` : "";
          const content = n.content ? `<div class="flow-content">${n.content[lang]}</div>` : "";
          const out = n.out ? `<span class="flow-out">${n.out[lang]}</span>` : "";
          return `<div class="flow-node${dec}">${num}<div class="flow-label">${n.label[lang]}${ref}</div>${content}${out}</div>`;
        })
        .join('<span class="flow-arrow" aria-hidden="true">→</span>');
      return `<div class="flow-row">${cells}</div>`;
    }).join('<div class="flow-down" aria-hidden="true">↓</div>') +
    `<p class="flow-branch">${FLOW_BRANCH[lang]}</p>`;
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

function flashCopied(btn: HTMLButtonElement): void {
  const original = STATIC[lang]["ins.cta"];
  btn.textContent = lang === "zh" ? "已复制" : "Copied";
  btn.classList.add("is-copied");
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("is-copied");
  }, 1600);
}

function fallbackCopy(text: string, btn: HTMLButtonElement): void {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    flashCopied(btn);
  } catch {
    window.alert(lang === "zh" ? "复制失败，请手动复制" : "Copy failed — copy it manually");
  } finally {
    document.body.removeChild(ta);
  }
}

function initCopyPrompt(): void {
  const btn = $("#copy-prompt") as HTMLButtonElement;
  btn.addEventListener("click", () => {
    const text = PROMPT[lang];
    if (!navigator.clipboard?.writeText) {
      fallbackCopy(text, btn);
      return;
    }
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (!settled) fallbackCopy(text, btn);
    }, 400);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        settled = true;
        window.clearTimeout(timeout);
        flashCopied(btn);
      })
      .catch(() => {
        settled = true;
        window.clearTimeout(timeout);
        fallbackCopy(text, btn);
      });
  });
}

renderAll();
initLangSwitch();
initReveal();
initCopyPrompt();