function myFunction() {
  var x = document.getElementById("myDIV");
  if (x.innerHTML === "Follow") {
    x.innerHTML = "Unfollow";
  } else {
    x.innerHTML = "Follow";
  }
}

function myFunction1() {
  var x = document.getElementById("myDIV1");
  if (x.innerHTML === "Follow") {
    x.innerHTML = "Unfollow";
  } else {
    x.innerHTML = "Follow";
  }
}

function openNav() {
  document.getElementById("myNav").style.height = "100%";
  document.body.classList.add("stopScroll");
  document.getElementsByClassName("homeSection")[0].classList.add("stopScroll");
}

function closeNav() {
  document.getElementById("myNav").style.height = "0%";
  document.body.classList.remove("stopScroll");
  document
    .getElementsByClassName("homeSection")[0]
    .classList.remove("stopScroll");
}

const insertImage = () => {
  document.getElementById("image").click();
};

const detectLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
      )
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("caption").value += `${
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

const showPreview = (event) => {
  document.getElementById("preview-container").hidden = false;
  const profileImagePreview = document.getElementById("preview-image");
  profileImagePreview.src = URL.createObjectURL(event.target.files[0]);
  profileImagePreview.onload = () => {
    URL.revokeObjectURL(profileImagePreview.src); // free memory
  };
};
