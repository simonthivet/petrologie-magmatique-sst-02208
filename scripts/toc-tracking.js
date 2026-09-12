(() => {
  const initializeTocTracking = () => {
    const toc = document.querySelector("#quarto-margin-sidebar #TOC");

    if (!toc) {
      return;
    }

    const entries = Array.from(
      toc.querySelectorAll('a[data-scroll-target^="#"]')
    )
      .map((link) => ({
        link,
        heading: document.querySelector(link.dataset.scrollTarget),
      }))
      .filter((entry) => entry.heading);

    if (entries.length === 0) {
      return;
    }

    let updateScheduled = false;

    const updateCurrentSection = () => {
      updateScheduled = false;
      const activationLine = 112;
      let currentEntry = entries[0];

      for (const entry of entries) {
        if (entry.heading.getBoundingClientRect().top <= activationLine) {
          currentEntry = entry;
        } else {
          break;
        }
      }

      const pageBottom = window.scrollY + window.innerHeight;
      if (pageBottom >= document.documentElement.scrollHeight - 2) {
        currentEntry = entries[entries.length - 1];
      }

      for (const entry of entries) {
        const isCurrent = entry === currentEntry;
        entry.link.classList.toggle("course-toc-current", isCurrent);

        if (isCurrent) {
          entry.link.setAttribute("aria-current", "location");
        } else {
          entry.link.removeAttribute("aria-current");
        }
      }
    };

    const requestUpdate = () => {
      if (!updateScheduled) {
        updateScheduled = true;
        window.requestAnimationFrame(updateCurrentSection);
      }
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);
    updateCurrentSection();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeTocTracking);
  } else {
    initializeTocTracking();
  }
})();
