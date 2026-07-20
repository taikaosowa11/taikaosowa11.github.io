// Renders the PHOTOS array (defined inline in each album page) into the
// .photo-list container. To add a photo: drop the image file into
// images/photos/<ALBUM>/ and add its filename as one more line in the
// PHOTOS array — no other changes needed.
//
// Layout: square/landscape photos span both columns. Portrait photos
// pair up two-per-row. If a run of consecutive portrait photos is odd
// (would leave one stranded next to a gap), the last one in that run
// is shown full width instead.
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

  function probe(filename) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        resolve({ filename: filename, width: img.naturalWidth, height: img.naturalHeight, ok: true });
      };
      img.onerror = function () {
        resolve({ filename: filename, ok: false });
      };
      img.src = "../images/photos/" + ALBUM + "/" + filename;
    });
  }

  Promise.all(PHOTOS.map(probe)).then(function (results) {
    var photos = results.filter(function (r) { return r.ok; });

    if (!photos.length) {
      var empty = document.createElement("div");
      empty.className = "photo-list-empty";
      empty.textContent = "No photos yet — add filenames to the PHOTOS list in this page.";
      container.appendChild(empty);
      return;
    }

    var wide = photos.map(function (r) { return r.width >= r.height; });

    // Walk runs of consecutive portrait photos; an odd-length run gets
    // its last photo bumped to full width so nothing sits alone next
    // to an empty gap.
    var i = 0;
    while (i < wide.length) {
      if (wide[i]) {
        i++;
        continue;
      }
      var start = i;
      while (i < wide.length && !wide[i]) i++;
      var runLength = i - start;
      if (runLength % 2 === 1) {
        wide[i - 1] = true;
      }
    }

    photos.forEach(function (r, idx) {
      var figure = document.createElement("figure");
      var img = document.createElement("img");
      img.src = "../images/photos/" + ALBUM + "/" + r.filename;
      img.alt = "";
      img.loading = "lazy";
      if (wide[idx]) {
        figure.classList.add("photo-wide");
      }
      figure.appendChild(img);
      container.appendChild(figure);
    });
  });
})();
