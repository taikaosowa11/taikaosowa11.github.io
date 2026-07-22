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

  function getFile(idx) {
    var entry = PHOTOS[idx];
    return (typeof entry === "string") ? entry : entry.file;
  }

  function getCaption(idx) {
    var entry = PHOTOS[idx];
    return (typeof entry === "string") ? "" : (entry.caption || "");
  }

  PHOTOS.forEach(function (entry, idx) {
    var figure = document.createElement("figure");
    var img = document.createElement("img");
    img.src = prefix + base + "/" + ALBUM + "/" + getFile(idx);
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
    figure.addEventListener("click", function () {
      openLightbox(idx);
    });
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

  var lightbox = null;
  var lightboxImg = null;
  var lightboxCaption = null;
  var currentIndex = -1;

  function validIndices() {
    var arr = [];
    for (var i = 0; i < figures.length; i++) {
      if (figures[i]) arr.push(i);
    }
    return arr;
  }

  function buildLightbox() {
    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-prev" aria-label="Previous photo">&larr;</button>' +
      '<div class="lightbox-content">' +
        '<img class="lightbox-img" alt="">' +
        '<p class="lightbox-caption"></p>' +
      '</div>' +
      '<button type="button" class="lightbox-next" aria-label="Next photo">&rarr;</button>';
    document.body.appendChild(overlay);

    overlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    overlay.querySelector(".lightbox-prev").addEventListener("click", function (e) {
      e.stopPropagation();
      step(-1);
    });
    overlay.querySelector(".lightbox-next").addEventListener("click", function (e) {
      e.stopPropagation();
      step(1);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });

    return overlay;
  }

  function showCurrent() {
    lightboxImg.src = prefix + base + "/" + ALBUM + "/" + getFile(currentIndex);
    var caption = getCaption(currentIndex);
    lightboxCaption.textContent = caption;
    lightboxCaption.style.display = caption ? "" : "none";
  }

  function step(direction) {
    var valid = validIndices();
    if (!valid.length) return;
    var pos = valid.indexOf(currentIndex);
    pos = (pos + direction + valid.length) % valid.length;
    currentIndex = valid[pos];
    showCurrent();
  }

  function openLightbox(idx) {
    if (!figures[idx]) return;
    if (!lightbox) {
      lightbox = buildLightbox();
      lightboxImg = lightbox.querySelector(".lightbox-img");
      lightboxCaption = lightbox.querySelector(".lightbox-caption");
    }
    currentIndex = idx;
    showCurrent();
    lightbox.classList.add("open");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");
  }
})();
