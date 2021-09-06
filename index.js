const express = require("express");
const cookieParser = require("cookie-parser");
const { db, storage, firebase } = require("./public/js/utilities/firebase");
const XMLHttpRequest = require("xhr2");
global.XMLHttpRequest = XMLHttpRequest;
const Multer = require("multer");

const multer = Multer({
  storage: Multer.memoryStorage(),
});

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/profile", express.static("public"));
app.use(cookieParser());

const port = process.env.PORT || 3000;
app.listen(port);

app.get("/login", (request, response) => {
  const id = request.cookies["userID"];

  if (id) {
    response.redirect(`/profile`);
  } else {
    response.render(`auth/login`, { incorrectCredentials: false });
  }
});

app.post("/login", (request, response) => {
  db.collection("Users")
    .where("username", "==", request.body["username"])
    .where("password", "==", request.body["password"])
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length) {
        var expiryDate = new Date(Number(new Date()) + 315360000000);
        response.cookie("userID", snapshot.docs[0].id, {
          expires: expiryDate,
          httpOnly: true,
        });
        response.redirect(`/profile`);
      } else {
        response.render("auth/login", { incorrectCredentials: true });
      }
    });
});

app.get("/forgot-password", (request, response) => {
  const id = request.cookies["userID"];

  if (id) {
    response.redirect(`/profile`);
  } else {
    response.render(`auth/forgotPassword`);
  }
});

app.get("/signup", (request, response) => {
  const id = request.cookies["userID"];

  if (id) {
    response.redirect(`/profile`);
  } else {
    response.render(`auth/signup`);
  }
});

app.post("/signup", (request, response) => {
  db.collection("Users")
    .add({
      ...request.body,
      profileImage: "",
      bio: "",
      followers: [],
      following: [],
    })
    .then((data) => {
      var expiryDate = new Date(Number(new Date()) + 315360000000);
      response.cookie("userID", data.id, {
        expires: expiryDate,
        httpOnly: true,
      });
      response.redirect(`/profile`);
    })
    .catch(() => response.render(`auth/signup`));
});

app.get("/", (request, response) => {
  response.redirect(`/home`);
});

app.get("/home", (request, response) => {
  const id = request.cookies["userID"];

  if (id) {
    getPosts(id).then((data) => {
      response.render(`home/home`, { data: data });
    });
  } else {
    response.redirect(`/login`);
  }
});

app.get("/post", (request, response) => {
  response.redirect("/");
});

app.post("/post", multer.single("image"), (request, response) => {
  let file = request.file;
  let body = request.body;

  if (file) {
    const storageRef = storage.ref(`posts/${file.originalname}`);
    storageRef.put(Uint8Array.from(file.buffer)).then(() => {
      storageRef.getDownloadURL().then((url) => {
        if (body.caption) {
          db.collection("Posts")
            .add({
              image: url,
              caption: body.caption,
              likedBy: [],
              comments: [],
              at: firebase.firestore.FieldValue.serverTimestamp(),
              shares: 0,
              by: request.cookies["userID"],
              type: "imageAndCaption",
            })
            .then(() => {
              response.redirect(`/`);
            });
        } else {
          db.collection("Posts")
            .add({
              image: url,
              likedBy: [],
              comments: [],
              at: firebase.firestore.FieldValue.serverTimestamp(),
              shares: 0,
              by: request.cookies["userID"],
              type: "imageOnly",
            })
            .then(() => {
              response.redirect(`/`);
            });
        }
      });
    });
  } else if (body.caption && !body.image) {
    db.collection("Posts")
      .add({
        caption: body.caption,
        likedBy: [],
        comments: [],
        at: firebase.firestore.FieldValue.serverTimestamp(),
        shares: 0,
        by: request.cookies["userID"],
        type: "captionOnly",
      })
      .then(() => {
        response.redirect(`/`);
      });
  } else {
    response.redirect(`/`);
  }
});

app.get("/search", (request, response) => {
  response.render("search/search");
});

app.get("/matches", (request, response) => {
  const id = request.cookies["userID"];

  if (id) {
    response.render(`matches/matches`);
  } else {
    response.redirect(`/login`);
  }
});

app.get("/news", (request, response) => {
  const id = request.cookies["userID"];

  if (id) {
    response.render(`news/news`);
  } else {
    response.redirect(`/login`);
  }
});

app.get("/qna", (request, response) => {
  const id = request.cookies["userID"];

  if (id) {
    response.render(`qna/qna`);
  } else {
    response.redirect(`/login`);
  }
});

app.get("/change-password", (request, response) => {
  const id = request.cookies["userID"];

  if (id) {
    response.render(`profile/changePassword`, { incorrectCredentials: false });
  } else {
    response.redirect(`/login`);
  }
});
app.post("/change-password", (request, response) => {
  db.collection("Users")
    .where("password", "==", request.body["old-password"])
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length) {
        db.collection("Users").doc(snapshot.docs[0].id).update({
          password: request.body["new-password"],
        });
        response.redirect(`/profile`);
      } else {
        response.render("profile/changePassword", {
          incorrectCredentials: true,
        });
      }
    });
});

app.get("/profile", (request, response) => {
  const id = request.cookies["userID"];

  if (id) {
    getProfileData(id).then((data) =>
      response.render(`profile/profile`, { data: data })
    );
  } else {
    response.redirect(`/login`);
  }
});
app.get("/profile/:id", (request, response) => {
  const id = request.cookies["userID"];
  const requestedID = request.params.id;

  if (id) {
    getProfileData(requestedID).then((data) =>
      response.render(`search/searchedProfile`, { data: data, userID: id })
    );
  } else {
    response.redirect(`/login`);
  }
});

app.post("/profile", multer.single("profile"), (request, response) => {
  let file = request.file;
  const data = request.body;

  if (file) {
    const storageRef = storage.ref(`profiles/${file.originalname}`);
    storageRef.put(Uint8Array.from(file.buffer)).then(() => {
      storageRef.getDownloadURL().then((url) => {
        getProfileData(request.cookies["userID"]).then((oldData) => {
          if (oldData.profileImage !== "") {
            storage
              .refFromURL(oldData.profileImage)
              .delete()
              .then(() => {
                db.collection("Users")
                  .doc(request.cookies["userID"])
                  .update({
                    name: data.name,
                    location: data.location,
                    bio: data.bio,
                    username: data.username,
                    profileImage: url,
                  })
                  .then(() => response.redirect(`/profile`));
              });
          } else {
            db.collection("Users")
              .doc(request.cookies["userID"])
              .update({
                name: data.name,
                location: data.location,
                bio: data.bio,
                username: data.username,
                profileImage: url,
              })
              .then(() => response.redirect(`/profile`));
          }
        });
      });
    });
  } else {
    db.collection("Users")
      .doc(request.cookies["userID"])
      .update({
        name: data.name,
        location: data.location,
        bio: data.bio,
        username: data.username,
      })
      .then(() => response.redirect(`/profile`));
  }
});

const getProfileData = async (id) => {
  const response = await db.collection("Users").doc(id).get();

  let snapshot = await db.collection("Posts").orderBy("at", "desc").get();
  let posts = [];
  snapshot.docs.forEach(
    (doc) =>
      doc.data().by == id &&
      posts.push({
        id: doc.id,
        data: doc.data(),
      })
  );

  return {
    id: response.id,
    name: response.data().name,
    bio: response.data().bio,
    location: response.data().location,
    password: response.data().password,
    phno: response.data().phno,
    profileImage: response.data().profileImage,
    username: response.data().username,
    posts: posts,
    followers: response.data().followers,
    following: response.data().following,
  };
};

const getPosts = async (id) => {
  const response = await db.collection("Users").doc(id).get();

  const postsResponse = await db
    .collection("Posts")
    .orderBy("at", "desc")
    .get();
  const posts = [];
  for (const postDoc of postsResponse.docs) {
    if (
      response.data().following.includes(postDoc.data().by) ||
      postDoc.data().by === id
    ) {
      const poster = await db.collection("Users").doc(postDoc.data().by).get();

      posts.push({
        selfID: id,
        name: poster.data().name,
        profileImage: poster.data().profileImage,
        username: poster.data().username,
        userID: postDoc.data().by,
        postID: postDoc.id,
        posts: postDoc.data(),
        following: response.data().following.includes(id),
      });
    }
  }
  // console.log(posts);
  return posts;
};
