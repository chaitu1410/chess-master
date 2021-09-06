function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return '<a href="' + url + '">' + url + "</a>";
  });
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

// var text =
//   "Find me at http://www.example.com and also at http://stackoverflow.com";
// var html = urlify(text);

// console.log(html);
