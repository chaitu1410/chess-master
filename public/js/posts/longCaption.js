const toggleCaption = (id) => {
  var dots = document.getElementById(`only_caption_dots_${id.split("_")[3]}`);
  var lessText = document.getElementById(
    `only_caption_less_${id.split("_")[3]}`
  );
  var moreText = document.getElementById(
    `only_caption_more_${id.split("_")[3]}`
  );

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    moreText.style.display = "none";
    lessText.style.display = "none";
  } else {
    dots.style.display = "none";
    moreText.style.display = "inline";
    lessText.style.display = "inline";
  }
};

const toggleImageCaption = (id) => {
  var dots = document.getElementById(`caption_dots_${id.split("_")[2]}`);
  var lessText = document.getElementById(`caption_less_${id.split("_")[2]}`);
  var moreText = document.getElementById(`caption_more_${id.split("_")[2]}`);

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    moreText.style.display = "none";
    lessText.style.display = "none";
  } else {
    dots.style.display = "none";
    moreText.style.display = "inline";
    lessText.style.display = "inline";
  }
};
