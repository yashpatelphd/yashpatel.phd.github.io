'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables (optional)
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// EMAIL REVEAL & COPY
document.addEventListener("DOMContentLoaded", () => {
  const emailLink = document.getElementById("emailLink");

  if (!emailLink) return;

  const email = "yashpatelphd@gmail.com";
  let revealed = false;
  let hideTimer = null;

  emailLink.addEventListener("click", async (e) => {
    e.preventDefault();

    // First click: reveal email
    if (!revealed) {
      revealed = true;
      emailLink.textContent = email;
      emailLink.title = "Click again to copy";

      hideTimer = setTimeout(() => {
        emailLink.textContent = "Click to reveal email";
        emailLink.title = "";
        revealed = false;
      }, 5000);

      return;
    }

    // Second click: copy email
    try {
      await navigator.clipboard.writeText(email);

      clearTimeout(hideTimer);

      emailLink.textContent = "✓ Copied!";

      setTimeout(() => {
        emailLink.textContent = "Click to reveal email";
        emailLink.title = "";
        revealed = false;
      }, 1500);

    } catch (error) {
      console.error("Copy failed:", error);

      // Fallback for older browsers
      prompt("Copy this email:", email);

      emailLink.textContent = "Click to reveal email";
      revealed = false;
    }
  });
});

// ===== RESEARCH SECTION FILTER =====
(function () {
  const groups = document.querySelectorAll("[data-research-group]");
  const filterBtns = document.querySelectorAll(".research-filter-btn");
  const selectBtn = document.querySelector("[data-research-select]");
  const selectValue = document.querySelector("[data-research-select-value]");
  const selectItems = document.querySelectorAll(".research-select-item");

  if (!groups.length) return;

  function applyFilter(value, label) {
    groups.forEach(g => {
      const match = value === "all" || g.dataset.researchGroup === value;
      g.classList.toggle("is-hidden", !match);
    });
    filterBtns.forEach(b => b.classList.toggle("active", b.dataset.researchFilter === value));
    if (selectValue && label) selectValue.textContent = label;
  }

  filterBtns.forEach(b => b.addEventListener("click", () => applyFilter(b.dataset.researchFilter, b.textContent)));
  if (selectBtn) selectBtn.addEventListener("click", () => selectBtn.classList.toggle("active"));
  selectItems.forEach(item => item.addEventListener("click", () => {
    applyFilter(item.dataset.researchFilter, item.textContent);
    if (selectBtn) selectBtn.classList.remove("active");
  }));
})();

// ===== PUBLICATIONS SUB-FILTER =====
(function () {
  const subBtns = document.querySelectorAll(".pub-subfilter-btn");
  const subs = document.querySelectorAll(".pub-sub");
  if (!subBtns.length) return;

  subBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.pubSubfilter;
      subs.forEach(s => {
        s.classList.toggle("is-hidden", !(value === "all" || s.dataset.pubType === value));
      });
      subBtns.forEach(b => b.classList.toggle("active", b === btn));
    });
  });
})();

// ===== BIBTEX (click to reveal, click again to copy) =====
(function () {
  document.querySelectorAll(".research-bib-btn").forEach(btn => {
    const entry = btn.closest(".research-entry");
    if (!entry) return;

    const bib = entry.dataset.bibtex || "";
    const preview = entry.querySelector(".research-bib-preview");
    if (!preview) return;

    // populate preview text once (decodes &#10; into real newlines)
    preview.textContent = bib;

    let revealed = false;

    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      // First click: reveal
      if (!revealed) {
        preview.classList.add("is-open");
        btn.innerHTML = '<ion-icon name="copy-outline"></ion-icon> Copy';
        revealed = true;
        return;
      }

      // Second click: copy
      try {
        await navigator.clipboard.writeText(bib);
        btn.classList.add("copied");
        btn.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon> Copied';
        setTimeout(() => {
          btn.classList.remove("copied");
          btn.innerHTML = '<ion-icon name="copy-outline"></ion-icon> Copy';
        }, 1500);
      } catch (err) {
        prompt("Copy this BibTeX:", bib);
      }
    });
  });
})();
