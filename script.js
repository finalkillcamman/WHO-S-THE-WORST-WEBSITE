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

// Wishlist saves locally and prevents repeated clicks from inflating the count.
(() => {
  const button = document.querySelector("[data-wishlist-button]");
  const output = document.querySelector("[data-wishlist-count]");
  if (!button || !output) return;
  const countKey = "whostheworst_wishlist_presses_v1";
  const chosenKey = "whostheworst_wishlisted_v2";
  let count = 0, chosen = false;
  try {
    count = Math.max(0, parseInt(localStorage.getItem(countKey) || "0", 10) || 0);
    chosen = localStorage.getItem(chosenKey) === "yes" || count > 0;
    if (chosen) localStorage.setItem(chosenKey, "yes");
  } catch { /* Private browsing may prevent persistent storage. */ }
  const render = () => {
    output.textContent = count.toLocaleString();
    button.disabled = chosen;
    button.textContent = chosen ? "♥ On Your Wishlist ✓" : "♥ Add to Wishlist";
  };
  render();
  button.addEventListener("click", () => {
    if (chosen) return;
    chosen = true;
    count += 1;
    try {
      localStorage.setItem(countKey, String(count));
      localStorage.setItem(chosenKey, "yes");
    } catch { /* Device storage is not available. */ }
    render();
  });
})();

// Email-based support with a hidden bot trap and basic repeat-submission throttle.
// Email client sends the message; no server-side form endpoint is exposed.
(() => {
  const form = document.getElementById("support-form");
  const status = document.getElementById("support-status");
  if (!form) return;
  let lastSubmit = 0;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    if (String(data.get("company") || "").trim()) return;
    if (Date.now() - lastSubmit < 30000) {
      status.textContent = "Please wait 30 seconds before trying again.";
      return;
    }
    const name = String(data.get("name") || "").trim().slice(0, 80);
    const email = String(data.get("email") || "").trim().slice(0, 180);
    const topic = String(data.get("topic") || "").trim().slice(0, 80);
    const message = String(data.get("message") || "").trim().slice(0, 2000);
    if (!name || !email || message.length < 10 || !form.reportValidity()) return;
    lastSubmit = Date.now();
    const subject = encodeURIComponent("Who's the Worst? Support: " + topic);
    const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nTopic: " + topic + "\n\n" + message);
    status.textContent = "Your email app should open. Press Send there to deliver your message.";
    window.location.href = "mailto:finalkillcamman@gmail.com?subject=" + subject + "&body=" + body;
  });
})();
