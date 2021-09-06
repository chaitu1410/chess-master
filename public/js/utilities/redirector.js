const userID = localStorage.getItem("userID");

if (userID || userID !== null) {
  location.href = "/";
}
