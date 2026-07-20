// Renders the PHOTOS array (defined inline in each album page) into the
// .photo-list container. To add a photo: drop the image file into
// images/photos/<ALBUM>/ and add its filename as one more line in the
// PHOTOS array — no other changes needed.
(function () {
  var container = document.querySelector(".photo-list");
  if (!container) return;

  if (typeof PHOTOS === "undefined" || !PHOTOS.length) {
    var empty = document.createElement("div");
    empty.className = "photo-list-empty";
    empty.textContent = "No photos yet — add filenames to the PHOTOS list in this page.";
    container.appendChild(empty);
    return;
  }

  PHOTOS.forEach(function (filename) {
    var figure = document.createElement("figure");
    var img = document.createElement("img");
    img.src = "../images/photos/" + ALBUM + "/" + filename;
    img.alt = "";
    img.loading = "lazy";
    // Square/landscape photos span both columns; portrait photos stay
    // one column wide so two sit side by side.
    img.addEventListener("load", function () {
      if (img.naturalWidth >= img.naturalHeight) {
        figure.classList.add("photo-wide");
      }
    });
    figure.appendChild(img);
    container.appendChild(figure);
  });
})();
