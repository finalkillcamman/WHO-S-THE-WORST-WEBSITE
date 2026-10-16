const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// Local wishlist interest counter. This is intentionally not a site-wide count.
(() => {
  const button = document.querySelector("[data-wishlist-button]");
  const output = document.querySelector("[data-wishlist-count]");
  if (!button || !output) return;
  const key = "whostheworst_wishlist_presses_v1";
  const read = () => {
    try { return Math.max(0, Number.parseInt(localStorage.getItem(key) || "0", 10) || 0); }
    catch { return 0; }
  };
  let count = read();
  output.textContent = count.toLocaleString();
  button.addEventListener("click", () => {
    count += 1;
    try { localStorage.setItem(key, String(count)); }
    catch { /* Counter still works for this session. */ }
    output.textContent = count.toLocaleString();
    button.textContent = "♥ Added! Add Another";
  });
})();
