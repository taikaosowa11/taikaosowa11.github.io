// Renders the PHOTOS array (defined inline in each album page) into the
// .photo-list container. To add a photo: drop the image file into
// images/photos/<ALBUM>/ and add its filename as one more line in the
// PHOTOS array — no other changes needed.
//
// Layout: square/landscape photos span both columns. Portrait photos
// pair up two-per-row. If a run of consecutive portrait photos is odd
// (would leave one stranded next to a gap), the last one in that run
// is shown full width instead.
//
// Photos are inserted right away and load lazily (so the page appears
// instantly and only downloads images as you scroll to them); the
// odd-run fix-up runs quietly in the background once everything has
// finished loading, without blocking the initial render.
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

  var figures = new Array(PHOTOS.length).fill(null);
  var settled = new Array(PHOTOS.length).fill(false);
  var wide = new Array(PHOTOS.length).fill(false);

  PHOTOS.forEach(function (filename, idx) {
    var figure = document.createElement("figure");
    var img = document.createElement("img");
    img.src = "../images/photos/" + ALBUM + "/" + filename;
    img.alt = "";
    img.loading = "lazy";

    img.addEventListener("load", function () {
      wide[idx] = img.naturalWidth >= img.naturalHeight;
      if (wide[idx]) figure.classList.add("photo-wide");
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

  // Once every photo has loaded (or failed), do a final pass: any run of
  // consecutive portrait photos with an odd count gets its last photo
  // switched to full width instead of left stranded next to a gap.
  function maybeFixOddRuns() {
    if (settled.indexOf(false) !== -1) return;

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
