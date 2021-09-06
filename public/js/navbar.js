const homeTab = document.getElementById("home");
const matchesTab = document.getElementById("matches");
const newsTab = document.getElementById("news");
const qnaTab = document.getElementById("qna");
const profileTab = document.getElementById("profile");

const removeActive = () => {
  homeTab.classList.contains("active--tab") &&
    homeTab.classList.remove("active--tab");
  matchesTab.classList.contains("active--tab") &&
    matchesTab.classList.remove("active--tab");
  newsTab.classList.contains("active--tab") &&
    newsTab.classList.remove("active--tab");
  qnaTab.classList.contains("active--tab") &&
    qnaTab.classList.remove("active--tab");
  profileTab.classList.contains("active--tab") &&
    profileTab.classList.remove("active--tab");
};

homeTab.onclick = () => {
  removeActive();
  homeTab.classList.add("active--tab");
};
matchesTab.onclick = () => {
  removeActive();
  matchesTab.classList.add("active--tab");
};
newsTab.onclick = () => {
  removeActive();
  newsTab.classList.add("active--tab");
};
qnaTab.onclick = () => {
  removeActive();
  qnaTab.classList.add("active--tab");
};
profileTab.onclick = () => {
  removeActive();
  profileTab.classList.add("active--tab");
};

window.onload = () => {
  switch (window.location.pathname) {
    case "/":
      removeActive();
      homeTab.classList.add("active--tab");
      break;
    case "/home":
      removeActive();
      homeTab.classList.add("active--tab");
      break;
    case "/matches":
      removeActive();
      matchesTab.classList.add("active--tab");
      break;
    case "/news":
      removeActive();
      newsTab.classList.add("active--tab");
      break;
    case "/qna":
      removeActive();
      qnaTab.classList.add("active--tab");
      break;
    case "/profile/":
      removeActive();
      profileTab.classList.add("active--tab");
      break;

    default:
      break;
  }
};
