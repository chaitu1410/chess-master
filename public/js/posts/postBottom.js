const likePost = async (id, selfID) => {
  const postSnapshot = await firebase
    .firestore()
    .collection("Posts")
    .doc(id)
    .get();
  let likedBy = postSnapshot.data().likedBy;

  const index = likedBy.indexOf(selfID);

  if (index > -1) {
    firebase
      .firestore()
      .collection("Posts")
      .doc(id)
      .update({
        likedBy: firebase.firestore.FieldValue.arrayRemove(selfID),
      });
  } else {
    firebase
      .firestore()
      .collection("Posts")
      .doc(id)
      .update({
        likedBy: firebase.firestore.FieldValue.arrayUnion(selfID),
      });
  }
};

const sharePost = async (id, userID) => {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = `${window.location.hostname}/profile/${userID}#post-${id}`;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);

  document.getElementById(`share-icon-${id}`).innerText = "check_circle";
  document.getElementById(`share-icon-${id}`).style.transform =
    "rotate(360deg)";
  document.getElementById(`share-icon-${id}`).style.color = "green";
  setTimeout(() => {
    document.getElementById(`share-icon-${id}`).innerText = "share";
    document.getElementById(`share-icon-${id}`).style.transform =
      "rotate(0deg)";
    document.getElementById(`share-icon-${id}`).style.color = "gray";
  }, 1111);

  const postSnapshot = await firebase
    .firestore()
    .collection("Posts")
    .doc(id)
    .get();
  let shares = postSnapshot.data().shares;

  firebase
    .firestore()
    .collection("Posts")
    .doc(id)
    .update({
      shares: Number(shares) + 1,
    });
};

const toggleComment = (id) => {
  document.getElementById(`comment-section-${id}`).style.transition =
    "all 271ms !important";

  if (
    document
      .getElementById(`comment-section-${id}`)
      .classList.contains("collapse")
  ) {
    document
      .getElementById(`comment-section-${id}`)
      .classList.remove("collapse");
    document.getElementById(`comment-section-${id}`).classList.add("expand");
  } else {
    document.getElementById(`comment-section-${id}`).classList.remove("expand");
    document.getElementById(`comment-section-${id}`).classList.add("collapse");
  }
};
const toggleReply = (id) => {
  document.getElementById(`reply-section-${id}`).style.transition =
    "all 271ms !important";

  if (
    document
      .getElementById(`reply-section-${id}`)
      .classList.contains("collapse")
  ) {
    document.getElementById(`reply-section-${id}`).classList.remove("collapse");
    document.getElementById(`reply-section-${id}`).classList.add("expand");
  } else {
    document.getElementById(`reply-section-${id}`).classList.remove("expand");
    document.getElementById(`reply-section-${id}`).classList.add("collapse");
  }
};

const comment = async (id, selfID) => {
  if (document.getElementById(`comment-${id}`).value.trim()) {
    firebase
      .firestore()
      .collection("Posts")
      .doc(id)
      .collection("Comments")
      .add({
        by: selfID,
        comment: document.getElementById(`comment-${id}`).value,
        at: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        document.getElementById(`comment-${id}`).value = "";
        document.getElementById(
          `all-comments-${id}`
        ).scrollTop = document.getElementById(
          `all-comments-${id}`
        ).scrollHeight;
      });
  } else {
    alert("You must enter a comment first");
  }
};

const reply = async (id, commentID, selfID) => {
  if (document.getElementById(`reply-${commentID}`).value.trim()) {
    firebase
      .firestore()
      .collection("Posts")
      .doc(id)
      .collection("Comments")
      .doc(commentID)
      .collection("Replies")
      .add({
        by: selfID,
        reply: document.getElementById(`reply-${commentID}`).value,
        at: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        document.getElementById(`reply-${commentID}`).value = "";
        // document.getElementById(
        //   `all-replies-${id}`
        // ).scrollTop = document.getElementById(`all-replies-${id}`).scrollHeight;
      });
  } else {
    alert("You must enter a reply first");
  }
};
