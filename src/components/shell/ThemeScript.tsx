/**
 * Applies the saved theme before first paint.
 *
 * The preference lives in IndexedDB (async), so a tiny synchronous mirror is
 * kept in localStorage purely to avoid a white flash on a dark-theme device.
 */
const SCRIPT = `
(function () {
  try {
    var t = localStorage.getItem("al-theme") || "system";
    var dark = t === "dark" ||
      (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    var s = localStorage.getItem("al-font-scale");
    if (s) document.documentElement.style.fontSize = (16 * parseFloat(s)) + "px";
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
