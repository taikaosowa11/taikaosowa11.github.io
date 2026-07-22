(function () {
  var groups = document.querySelectorAll(".tournament-photos");
  if (!groups.length) return;

  var lightbox = null;
  var lightboxImg = null;
  var lightboxCaption = null;
  var currentImages = [];
  var currentIndex = -1;

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
    var img = currentImages[currentIndex];
    lightboxImg.src = img.src;
    var caption = img.getAttribute("data-caption") || "";
    lightboxCaption.textContent = caption;
    lightboxCaption.style.display = caption ? "" : "none";
  }

  function step(direction) {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
    showCurrent();
  }

  function openLightbox(images, idx) {
    currentImages = images;
    currentIndex = idx;
    if (!lightbox) {
      lightbox = buildLightbox();
      lightboxImg = lightbox.querySelector(".lightbox-img");
      lightboxCaption = lightbox.querySelector(".lightbox-caption");
    }
    showCurrent();
    lightbox.classList.add("open");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");
  }

  Array.prototype.forEach.call(groups, function (group) {
    Array.prototype.forEach.call(group.querySelectorAll("img"), function (img) {
      img.addEventListener("click", function () {
        var liveImages = Array.prototype.slice.call(group.querySelectorAll("img"));
        var idx = liveImages.indexOf(img);
        openLightbox(liveImages, idx);
      });
    });
  });
})();
