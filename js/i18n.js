// Simple i18n handler
function getCurrentLang() {
  const params = new URLSearchParams(window.location.search);
  return params.get('lang') || 'zh';
}

function setLang(lang) {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.location.href = url.toString();
}

function applyLang() {
  const lang = getCurrentLang();
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
  const elements = document.querySelectorAll('[data-en]');
  elements.forEach(el => {
    if (lang === 'en') {
      if (!el.dataset.zh) {
        el.dataset.zh = el.innerHTML;
      }
      if (el.dataset.en) {
        el.innerHTML = el.dataset.en;
      } else {
        el.innerHTML = el.getAttribute('data-en');
      }
    } else if (el.dataset.zh) {
      el.innerHTML = el.dataset.zh;
    }
  });
  const select = document.getElementById('language-select');
  if (select) {
    select.value = lang;
    select.addEventListener('change', function() {
      setLang(this.value);
    });
  }
}

document.addEventListener('DOMContentLoaded', applyLang);
