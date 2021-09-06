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
