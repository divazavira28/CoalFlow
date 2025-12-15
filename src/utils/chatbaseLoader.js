export function loadChatbase() {
  // Cegah double load
  if (window.chatbaseLoaded) return;
  window.chatbaseLoaded = true;

  const script = document.createElement("script");
  script.src = "https://www.chatbase.co/embed.min.js";
  script.id = "OYayCplL6t5JdSxgMZB4-";
  script.domain = "www.chatbase.co";

  document.body.appendChild(script);
}
