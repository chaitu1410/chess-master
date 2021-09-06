window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("verifier");
recaptchaVerifier
  .render()
  .then((widgetId) => (window.recaptchaWidgetId = widgetId));

const getOTP = () => {
  if (
    document.getElementById("phone").value.length < 10 ||
    document.getElementById("phone").value.length > 10
  ) {
    alert("Enter a valid Phone Number");
    return;
  } else {
    firebase
      .firestore()
      .collection("Users")
      .where("phno", "==", document.getElementById("phone").value)
      .get()
      .then((snapshot) => {
        if (!snapshot.docs.length) {
          firebase
            .auth()
            .signInWithPhoneNumber(
              `+91${document.getElementById("phone").value}`,
              window.recaptchaVerifier
            )
            .then((confirmationResult) => {
              window.confirmationResult = confirmationResult;
              codeResult = confirmationResult;

              document.getElementById("otp").disabled = false;
              document.getElementById("otp-button").disabled = false;
            })
            .catch((error) => alert(error.message));
        } else {
          window.location.href = "/login";
        }
      });
  }
};

const verifyOTP = () => {
  codeResult
    .confirm(document.getElementById("otp").value)
    .then((result) => {
      document.getElementById("submit").disabled = false;
      document.getElementById("phno").value = document.getElementById(
        "phone"
      ).value;
    })
    .catch((error) => alert(error.message));
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

const checkUsername = () => {
  firebase
    .firestore()
    .collection("Users")
    .where("username", "==", document.getElementById("username").value)
    .get()
    .then((snapshot) => {
      if (!snapshot.docs.length) {
        document.getElementById("usernameError").innerText = "";
        document.getElementById("submit").disabled = false;
      } else {
        document.getElementById("usernameError").innerText =
          "Username already taken!";
        document.getElementById("submit").disabled = true;
      }
    });
};

document.getElementById("username").addEventListener("input", checkUsername);
