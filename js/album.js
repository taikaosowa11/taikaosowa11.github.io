(function () {
  var container = document.querySelector(".photo-list");
  if (!container) return;

  if (typeof PHOTOS === "undefined" || !PHOTOS.length) {
    showEmpty();
    return;
  }

  function showEmpty() {
    var empty = document.createElement("div");
    empty.className = "photo-list-empty";
    empty.textContent = "No photos yet — add filenames to the PHOTOS list in this page.";
    container.appendChild(empty);
  }

  var base = (typeof ALBUM_BASE !== "undefined") ? ALBUM_BASE : "photos";
  var prefix = (typeof IMAGE_PREFIX !== "undefined") ? IMAGE_PREFIX : "../images/";
  var forceTwoColumn = (typeof FORCE_TWO_COLUMN !== "undefined") ? FORCE_TWO_COLUMN : false;

  var figures = new Array(PHOTOS.length).fill(null);
  var settled = new Array(PHOTOS.length).fill(false);
  var wide = new Array(PHOTOS.length).fill(false);

  PHOTOS.forEach(function (filename, idx) {
    var figure = document.createElement("figure");
    var img = document.createElement("img");
    img.src = prefix + base + "/" + ALBUM + "/" + filename;
    img.alt = "";
    img.loading = "lazy";

    img.addEventListener("load", function () {
      if (!forceTwoColumn) {
        wide[idx] = img.naturalWidth >= img.naturalHeight;
        if (wide[idx]) figure.classList.add("photo-wide");
      }
      settled[idx] = true;
      maybeFixOddRuns();
    });
    img.addEventListener("error", function () {
      figure.remove();
      figures[idx] = null;
      settled[idx] = true;
      maybeFixOddRuns();
    });

    figure.appendChild(img);
    container.appendChild(figure);
    figures[idx] = figure;
  });

  function maybeFixOddRuns() {
    if (settled.indexOf(false) !== -1) return;
    if (forceTwoColumn) return;

    var i = 0;
    while (i < figures.length) {
      if (!figures[i] || wide[i]) {
        i++;
        continue;
      }
      var start = i;
      while (i < figures.length && figures[i] && !wide[i]) i++;
      var runLength = i - start;
      if (runLength % 2 === 1) {
        var lastIdx = i - 1;
        wide[lastIdx] = true;
        figures[lastIdx].classList.add("photo-wide");
      }
    }
  }
})();
