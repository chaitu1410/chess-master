const editProfileButton = document.getElementById("edit-button");
const profile = document.getElementById("my-profile");
const editProfile = document.getElementById("edit-profile");
const profileImageUploader = document.getElementById("profile-image-uploader");
const profileImagePreview = document.getElementById("profile-image-preview");
// const nameProfile = document.getElementById("name-profile");
const addBio = document.getElementById("add-bio");

const showEditProfile = () => {
  profile.style.display = "none";
  editProfile.style.display = "flex";
};

const hideEditProfile = () => {
  profile.style.display = "flex";
  editProfile.style.display = "none";
};

profileImagePreview.onclick = () => {
  profileImageUploader.click();
};

// nameProfile.onclick = () => {
//   alert("clicked");
//   profileImageUploader.click();
// };

const showPreview = (event) => {
  profileImagePreview.src = URL.createObjectURL(event.target.files[0]);
  profileImagePreview.onload = () => {
    URL.revokeObjectURL(profileImagePreview.src); // free memory
  };
};

const detectLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
      )
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("location").value = `${
            data["city"] && data["city"] + ", "
          }${data["locality"] && data["locality"] + ", "}${
            data["principalSubdivision"] && data["principalSubdivision"] + ", "
          }${data["countryName"] && data["countryName"] + ""}`;
        });
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

const deletePost = async (postID) => {
  if (confirm("Are you sure you want to delete this post?")) {
    const postData = await firebase
      .firestore()
      .collection("Posts")
      .doc(postID)
      .get();

    if (postData.data().type === "captionOnly") {
      firebase
        .firestore()
        .collection("Posts")
        .doc(postID)
        .delete()
        .then(() => window.location.reload());
    } else if (
      postData.data().type === "imageOnly" ||
      postData.data().type === "imageAndCaption"
    ) {
      firebase
        .app()
        .storage()
        .refFromURL(postData.data().image)
        .delete()
        .then(() => {
          firebase
            .firestore()
            .collection("Posts")
            .doc(postID)
            .delete()
            .then(() => window.location.reload());
        });
    }
  } else {
  }
};
