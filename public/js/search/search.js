const goBack = () => {
  window.location.href = "/";
};

const getSecondLetter = (name) => {
  if (name.length > 1) {
    return name[1][0];
  } else {
    return "";
  }
};

let users;
const loadUsers = async () => {
  const snapshot = await firebase.firestore().collection("Users").get();
  users = snapshot.docs.map((doc) => ({
    id: doc.id,
    profileImage: doc.data().profileImage,
    name: doc.data().name,
    username: doc.data().username,
  }));

  document.getElementById("users").innerHTML = "";
  users.forEach(
    (user) =>
      (document.getElementById("users").innerHTML += `<a href="/profile/${
        user.id
      }" id="${user.id}" class="search_user">
  <div class="profile-image">
    ${
      user.profileImage === ""
        ? `<div class="name-profile">
          <p class="profile-text">
          ${user.name.split(" ")[0][0]}${getSecondLetter(user.name.split(" "))}
          </p>
        </div>`
        : `<img src="${user.profileImage}" alt=" " />`
    } 
  </div>
  <div class="profile-name">
    <p>${user.username}</p>
  </div>
</a>`)
  );
};
window.onload = loadUsers();

const showUsers = (id) => {
  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(document.getElementById(id).value.toLowerCase()) ||
      user.username
        .toLowerCase()
        .includes(document.getElementById(id).value.toLowerCase())
  );

  document.getElementById("users").innerHTML = "";
  filteredUsers.forEach(
    (user) =>
      (document.getElementById("users").innerHTML += `<a href="/profile/${
        user.id
      }" id="${user.id}" class="search_user">
  <div class="profile-image">
    ${
      user.profileImage === ""
        ? `<div class="name-profile">
          <p class="profile-text">
          ${user.name.split(" ")[0][0]}${getSecondLetter(user.name.split(" "))}
          </p>
        </div>`
        : `<img src="${user.profileImage}" alt=" " />`
    } 
  </div>
  <div class="profile-name">
    <p>${user.username}</p>
  </div>
</a>`)
  );
};
