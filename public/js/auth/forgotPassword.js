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
        if (snapshot.docs.length) {
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
          window.location.href = "/forgot-password";
        }
      });
  }
};

const getUsernameAndPassword = async () => {
  const userSnapshot = await firebase
    .firestore()
    .collection("Users")
    .where("phno", "==", document.getElementById("phone").value)
    .get();
  document.getElementById(
    "username"
  ).value = userSnapshot.docs[0].data().username;
  document.getElementById(
    "password"
  ).value = userSnapshot.docs[0].data().password;
};

const verifyOTP = () => {
  codeResult
    .confirm(document.getElementById("otp").value)
    .then((result) => {
      getUsernameAndPassword().then(() => {
        document.getElementById("submit").disabled = false;
      });
    })
    .catch((error) => alert(error.message));
};
