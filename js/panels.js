/* ==========================================================================
   PANELS — turns data/portfolio.js into the content inside each drawer
   --------------------------------------------------------------------------
   render(id, ctx)  → HTML for one section (ctx.view selects a sub-view such
                      as a single project or a drawing in the viewer)
   renderList()     → the whole portfolio on one page ("View as a list")
   enhance(el, …)   → wires up interactive bits after rendering
   Missing content is shown as clearly marked placeholders.
   ========================================================================== */
(function () {
  'use strict';

  var P = window.PORTFOLIO;

  /* ---- small helpers -------------------------------------------------- */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function has(v) {
    if (Array.isArray(v)) return v.some(has);
    return typeof v === 'string' ? v.trim() !== '' : !!v;
  }
  /* Only allow web, email and relative links (never javascript: etc.). */
  function safeUrl(u) {
    u = String(u || '').trim();
    if (!u) return '';
    if (/^(https?:|mailto:)/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return '';
    return u;
  }
  function safeRatio(r) { return /^[\d.\s\/]+$/.test(r || '') ? r : ''; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function H(level, cls, html, attrs) {
    var l = Math.min(6, Math.max(2, level));
    return '<h' + l + (cls ? ' class="' + cls + '"' : '') + (attrs || '') + '>' + html + '</h' + l + '>';
  }

  function paras(list, firstLede) {
    return (list || []).filter(has).map(function (p, i) {
      return '<p' + (firstLede && i === 0 ? ' class="lede"' : '') + '>' + esc(p) + '</p>';
    }).join('');
  }

  /* Inline "to confirm" marker for missing text. */
  function tbc(label) {
    return '<span class="tbc"><span class="tbc__tag">To confirm</span>' + esc(label) + '</span>';
  }
  function tbcPara(label) { return '<p class="tbc-para">' + tbc(label) + '</p>'; }

  function placeholder(label, ratio) {
    var r = safeRatio(ratio);
    return '<div class="ph"' + (r ? ' style="--ratio: ' + r + '"' : '') + ' role="img" aria-label="Placeholder: ' + esc(label) + '">' +
      '<span class="ph__tag">Placeholder</span><span class="ph__label">' + esc(label) + '</span></div>';
  }

  function img(item, extraAttrs) {
    return '<img src="' + esc(safeUrl(item.src)) + '" alt="' + esc(item.alt || item.caption || '') + '" loading="lazy" decoding="async"' + (extraAttrs || '') + '>';
  }

  function figure(item, opts) {
    opts = opts || {};
    if (!item) return '';
    var cap = has(item.caption) ? '<figcaption>' + esc(item.caption) + '</figcaption>' : '';
    if (has(item.src) && safeUrl(item.src)) return '<figure class="fig">' + img(item) + cap + '</figure>';
    return '<figure class="fig fig--ph">' + placeholder(item.placeholder || opts.placeholder || 'Image', item.ratio || opts.ratio) + cap + '</figure>';
  }

  function gallery(items, opts) {
    opts = opts || {};
    if (!items || !items.length) return placeholder(opts.placeholder || 'Images', opts.ratio);
    return '<div class="gallery' + (opts.wide ? ' gallery--wide' : '') + '">' +
      items.map(function (it) { return figure(it, opts); }).join('') + '</div>';
  }

  function sectionHead(sec, ctx, extra) {
    var accent = has(sec.accent) ? '<span class="sec-accent" aria-hidden="true">' + esc(sec.accent) + '</span>' : '';
    return '<header class="sec-head">' + accent +
      H(2, 'sec-title', esc(sec.title), ' id="' + ctx.headingId + '" tabindex="-1"') +
      (extra || '') + '<span class="rule" aria-hidden="true"></span></header>';
  }

  function resumeButton() {
    var url = safeUrl(P.site.resume);
    if (url) return '<a class="pill pill--solid" href="' + esc(url) + '" download>Download résumé <span class="visually-hidden">(PDF)</span></a>';
    return '<button type="button" class="pill" disabled>Résumé coming soon</button>';
  }

  function downloadButton(url, label, unavailableLabel) {
    url = safeUrl(url);
    if (url) return '<a class="pill pill--outline" href="' + esc(url) + '" download>' + esc(label) + '</a>';
    return '<button type="button" class="pill" disabled>' + esc(unavailableLabel) + '</button>';
  }

  function backLink(label, view) {
    return '<div class="subnav"><button type="button" class="text-btn" data-view="' + (view || 'index') + '">' +
      '<span aria-hidden="true" class="arrow-left"></span>' + esc(label) + '</button></div>';
  }

  /* ---- 1. Introduction ------------------------------------------------- */

  /* Editorial portrait: cream mat, fine gold keyline, soft shadow, cropped to
     the frame around a configurable focal point (never stretched). */
  function portrait(p) {
    p = p || {};
    var src = has(p.src) ? safeUrl(p.src) : '';
    if (!src) return figure(p, { ratio: '4 / 5' });
    var ratio = safeRatio(p.ratio) || '4 / 5';
    var focus = /^[\d.]+%\s+[\d.]+%$/.test(String(p.focus || '').trim()) ? p.focus.trim() : '50% 30%';
    return '<figure class="portrait">' +
      '<div class="portrait__frame" style="--ratio: ' + ratio + '">' +
        '<img src="' + esc(src) + '" alt="' + esc(p.alt || '') + '" decoding="async" style="object-position: ' + esc(focus) + '">' +
      '</div>' +
      (has(p.caption) ? '<figcaption>' + esc(p.caption) + '</figcaption>' : '') +
    '</figure>';
  }

  function introduction(sec, ctx) {
    var withPhoto = sec.portrait && sec.portrait.show;
    return sectionHead(sec, ctx) +
      '<div class="' + (withPhoto ? 'split' : 'intro-solo') + '">' +
        (withPhoto ? '<div>' + portrait(sec.portrait) + '</div>' : '') +
        '<div>' +
          '<p class="intro-name">' + esc(P.site.name) + '</p>' +
          '<p class="intro-role">' + esc(P.site.role) + '</p>' +
          '<p class="intro-program">' + esc(P.site.program) + '</p>' +
          '<div class="prose">' + (has(sec.paragraphs) ? paras(sec.paragraphs, true) : tbcPara('Introduction text')) + '</div>' +
          (has(sec.skills) ? '<div class="block">' + H(ctx.lvl + 1, 'h4', esc(sec.skillsHeading || 'Software')) +
            '<ul class="tags">' + sec.skills.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
          '</div>' : '') +
          (sec.showResume ? '<div class="actions">' + resumeButton() + '</div>' : '') +
        '</div>' +
      '</div>';
  }

  /* ---- 2. Projects ----------------------------------------------------- */

  function projectCards(sec, ctx) {
    return '<div class="cards">' + sec.items.map(function (p, i) {
      var cover = has(p.cover && p.cover.src) && safeUrl(p.cover.src) ? img(p.cover) : placeholder((p.cover && p.cover.placeholder) || 'Cover image', (p.cover && p.cover.ratio) || '4 / 3');
      var href = ctx.mode === 'list' ? '#list-project-' + p.id : '#projects';
      var attrs = ctx.mode === 'list' ? ' data-jump="list-project-' + esc(p.id) + '"' : ' data-view="project" data-param="' + esc(p.id) + '"';
      return '<a class="card" href="' + href + '"' + attrs + '>' + cover +
        '<span class="card__num">' + pad(i + 1) + '</span>' +
        '<span class="card__title">' + esc(p.title) + '</span>' +
        (has(p.projectType) ? '<span class="card__type">' + esc(p.projectType) + '</span>' : '') +
        '<span class="card__summary">' + esc(p.summary) + '</span>' +
        '<span class="card__more">' + (ctx.mode === 'list' ? 'Read more' : 'View project') + '</span></a>';
    }).join('') + '</div>';
  }

  function projectDetail(p, i, total, ctx, lvl) {
    var mats = (p.materials || []);
    var matsHtml = mats.length ? '<div class="swatches">' + mats.map(function (m) {
      var face = has(m.src) && safeUrl(m.src) ? img({ src: m.src, alt: m.name || 'Material sample' }) : placeholder(m.placeholder || 'Material', '1');
      return '<div class="swatch">' + face +
        (has(m.name) ? '<p class="swatch__name">' + esc(m.name) + '</p>' : '') +
        (has(m.note) ? '<p class="swatch__note">' + esc(m.note) + '</p>' : '') + '</div>';
    }).join('') + '</div>' : placeholder('Material palette');

    var titleAttrs = ctx.mode === 'panel' ? ' id="' + ctx.headingId + '" tabindex="-1"' : ' id="list-project-' + esc(p.id) + '" tabindex="-1"';
    var next = P.sections.projects.items[(i + 1) % total];

    return (ctx.mode === 'panel' ? backLink('All projects') : '') +
      '<article class="project-detail">' +
      '<header class="sec-head">' +
        '<p class="eyebrow">Project ' + pad(i + 1) + ' of ' + pad(total) + '</p>' +
        H(lvl, 'sec-title', esc(p.title), titleAttrs) +
        '<span class="rule" aria-hidden="true"></span>' +
      '</header>' +
      '<dl class="facts">' +
        '<div><dt>Project type</dt><dd>' + (has(p.projectType) ? esc(p.projectType) : tbc('Academic or professional classification')) + '</dd></div>' +
        '<div><dt>My role</dt><dd>' + (has(p.role) ? esc(p.role) : tbc('Your role on this project')) + '</dd></div>' +
      '</dl>' +
      '<div class="block"><div class="split split--reverse">' +
        '<div class="prose">' + H(lvl + 1, 'h3', 'Overview') + paras(p.overview, true) + '</div>' +
        '<div>' + figure(p.cover, { ratio: '4 / 3' }) + '</div>' +
      '</div></div>' +
      '<div class="block prose">' + H(lvl + 1, 'h3', 'Design intent') +
        (has(p.designIntent) ? paras(p.designIntent) : tbcPara('A short statement of design intent')) + '</div>' +
      '<div class="block">' + H(lvl + 1, 'h3', 'Concept imagery') + gallery(p.concept, { placeholder: 'Concept image' }) + '</div>' +
      '<div class="block">' + H(lvl + 1, 'h3', 'Material palette') + matsHtml + '</div>' +
      '<div class="block">' + H(lvl + 1, 'h3', 'Plans and elevations') + gallery(p.plans, { wide: true, placeholder: 'Plan or elevation' }) + '</div>' +
      '<div class="block">' + H(lvl + 1, 'h3', 'Renderings') + gallery(p.renderings, { wide: true, placeholder: 'Rendering', ratio: '16 / 10' }) + '</div>' +
      '<div class="actions">' + downloadButton(p.pdf, 'Download project PDF', 'Project PDF not yet available') +
        (ctx.mode === 'panel' && total > 1 ? '<button type="button" class="pill pill--outline" data-view="project" data-param="' + esc(next.id) + '">Next: ' + esc(next.title) + '</button>' : '') +
      '</div>' +
      '</article>';
  }

  function projects(sec, ctx) {
    if (ctx.mode === 'panel' && ctx.view === 'project') {
      var i = sec.items.findIndex(function (p) { return p.id === ctx.param; });
      if (i > -1) return projectDetail(sec.items[i], i, sec.items.length, ctx, 2);
    }
    var html = sectionHead(sec, ctx) + (has(sec.intro) ? '<div class="prose block"><p class="lede">' + esc(sec.intro) + '</p></div>' : '') + projectCards(sec, ctx);
    if (ctx.mode === 'list') {
      html += sec.items.map(function (p, i) { return projectDetail(p, i, sec.items.length, ctx, 3); }).join('');
    }
    return html;
  }

  /* ---- 3. Design philosophy ------------------------------------------- */

  function philosophy(sec, ctx) {
    return sectionHead(sec, ctx) +
      '<div class="split split--reverse">' +
        '<div class="prose">' + (has(sec.paragraphs) ? paras(sec.paragraphs, true) : tbcPara('Design philosophy')) + '</div>' +
        '<div class="gallery" style="grid-template-columns: 1fr">' + (sec.images || []).map(function (it) { return figure(it, { ratio: '4 / 3' }); }).join('') + '</div>' +
      '</div>';
  }

  /* ---- 4. Technical drawings ------------------------------------------ */

  function drawingTitle(d) { return has(d.title) ? d.title : (d.placeholder || 'Drawing'); }

  function drawingsIndex(sec, ctx) {
    var anyReal = sec.categories.some(function (c) { return c.items.some(function (d) { return has(d.image); }); });
    var html = sectionHead(sec, ctx) +
      (has(sec.intro) ? '<div class="prose"><p class="lede">' + esc(sec.intro) + '</p></div>' : '') +
      (anyReal ? '<p class="note">Select a drawing to view it full size and zoom in.</p>' : '<p class="notice">Drawings will be added here. The tiles below are placeholders only.</p>');
    sec.categories.forEach(function (cat, ci) {
      html += '<div class="block">' + H(ctx.lvl + 1, 'h3', esc(cat.label)) + '<div class="gallery">';
      cat.items.forEach(function (d, ii) {
        var title = drawingTitle(d);
        if (has(d.image) && safeUrl(d.image)) {
          var inner = img({ src: d.image, alt: title }) +
            '<span class="drawing-tile__title">' + esc(title) + '</span>' +
            (has(d.project) ? '<span class="drawing-tile__sub">' + esc(d.project) + '</span>' : '');
          html += ctx.mode === 'list'
            ? '<a class="drawing-tile" href="' + esc(safeUrl(d.image)) + '" target="_blank" rel="noopener">' + inner + '<span class="visually-hidden"> (opens full size in a new tab)</span></a>'
            : '<button type="button" class="drawing-tile" data-view="drawing" data-param="' + ci + ':' + ii + '">' + inner + '<span class="visually-hidden"> — view full size</span></button>';
        } else {
          html += figure({ placeholder: d.placeholder || cat.label, caption: d.caption }, { ratio: '4 / 3' });
        }
      });
      html += '</div></div>';
    });
    return html;
  }

  function drawingViewer(sec, ctx) {
    var parts = String(ctx.param || '').split(':');
    var cat = sec.categories[+parts[0]];
    var d = cat && cat.items[+parts[1]];
    if (!d || !has(d.image)) return drawingsIndex(sec, Object.assign({}, ctx, { view: 'index' }));
    var src = esc(safeUrl(d.image));
    return backLink('All drawings') +
      '<header class="sec-head"><p class="eyebrow">' + esc(cat.label) + (has(d.project) ? ' · ' + esc(d.project) : '') + '</p>' +
        H(2, 'sec-title', esc(drawingTitle(d)), ' id="' + ctx.headingId + '" tabindex="-1"') + '</header>' +
      '<div class="viewer" data-viewer>' +
        '<div class="viewer__toolbar" role="toolbar" aria-label="Drawing zoom">' +
          '<button type="button" class="icon-btn" data-zoom="out" aria-label="Zoom out">−</button>' +
          '<span class="viewer__zoom" data-zoom-label aria-live="polite">Fit</span>' +
          '<button type="button" class="icon-btn" data-zoom="in" aria-label="Zoom in">+</button>' +
          '<button type="button" class="pill pill--outline" data-zoom="fit">Fit</button>' +
          '<button type="button" class="pill pill--outline" data-zoom="actual">100%</button>' +
          '<a class="pill pill--outline" href="' + src + '" target="_blank" rel="noopener">Open full size</a>' +
          (has(d.pdf) && safeUrl(d.pdf) ? '<a class="pill pill--solid" href="' + esc(safeUrl(d.pdf)) + '" download>Download PDF</a>' : '') +
        '</div>' +
        '<div class="viewer__canvas is-fit" data-canvas tabindex="0" aria-label="Drawing. Use plus and minus keys to zoom; drag or scroll to move around.">' +
          '<img src="' + src + '" alt="' + esc(drawingTitle(d)) + '" decoding="async">' +
        '</div>' +
        (has(d.caption) ? '<p class="note">' + esc(d.caption) + '</p>' : '') +
      '</div>';
  }

  function drawings(sec, ctx) {
    if (ctx.mode === 'panel' && ctx.view === 'drawing') return drawingViewer(sec, ctx);
    return drawingsIndex(sec, ctx);
  }

  /* ---- 5. Thesis ------------------------------------------------------- */

  /* Coming-soon presentation, used while sec.comingSoon.enabled is true.
     The full thesis renderer below is kept intact for when it's ready. */
  // Abstract drafting motif (arches for gathering, a circle of light, leaves,
  // a grid) — a mood, not a rendering of the project.
  function soonMotif(uid) {
    return '<svg class="soon__motif" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<defs><pattern id="soon-grid-' + uid + '" width="40" height="40" patternUnits="userSpaceOnUse">' +
        '<path d="M40 0H0V40" fill="none" stroke="currentColor" stroke-width=".5" opacity=".35"/></pattern></defs>' +
      '<rect width="800" height="520" fill="url(#soon-grid-' + uid + ')"/>' +
      '<g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">' +
        '<circle cx="400" cy="170" r="92" opacity=".55"/>' +
        '<circle cx="400" cy="170" r="132" opacity=".25" stroke-dasharray="2 7"/>' +
        '<path d="M150 440V262a80 80 0 0 1 160 0v178M320 440V250a80 80 0 0 1 160 0v190M490 440V262a80 80 0 0 1 160 0v178" opacity=".6"/>' +
        '<path d="M40 452c150-58 270 30 420-18s230-52 300-12" opacity=".5"/>' +
        '<path d="M86 300c26-48 70-60 98-52-6 40-48 70-98 52zM702 286c-28-44-72-52-98-42 8 38 52 64 98 42z" opacity=".45"/>' +
        '<path d="M60 470H740" opacity=".4"/>' +
      '</g></svg>';
  }

  /* Fine-line brass icons for the concept pillars. */
  var PILLAR_ICONS = {
    nature: '<path d="M20 34C20 22 26 12 34 7c1 10-3 21-14 27zM20 34c0-8-4-14-11-17-1 8 4 15 11 17zM20 34v4"/><path d="M21 31c3-6 7-11 11-16"/>',
    connection: '<circle cx="15" cy="20" r="8"/><circle cx="25" cy="20" r="8"/><path d="M20 14.3v11.4"/>',
    belonging: '<path d="M8 36V20a12 12 0 0 1 24 0v16"/><path d="M4 36h32"/><path d="M20 30c-3.5-2.5-6-4.6-6-7.2a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 2.6-2.5 4.7-6 7.2z"/>',
    choice: '<path d="M20 37V24"/><path d="M20 24l-10-10M20 24l10-10M20 24V9"/><path d="M6 14l4 0 0-4M34 14l-4 0 0-4M17 11l3-3 3 3"/>'
  };
  function pillarIcon(name) {
    return '<svg class="soon__icon" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">' +
      (PILLAR_ICONS[name] || PILLAR_ICONS.nature) + '</g></svg>';
  }

  /* Soft botanical shadows for the edges — like sunlight through leaves. */
  function leafShadow(cls) {
    var leaves = '';
    var pts = [[30, 60, -30], [62, 92, 20], [88, 128, -40], [120, 150, 25], [146, 190, -35], [182, 210, 30], [204, 252, -25], [240, 270, 35]];
    pts.forEach(function (p) { leaves += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="22" ry="9" transform="rotate(' + p[2] + ' ' + p[0] + ' ' + p[1] + ')"/>'; });
    return '<svg class="soon__leaves ' + cls + '" viewBox="0 0 300 320" aria-hidden="true" focusable="false">' +
      '<path d="M10 20C80 90 150 160 280 300" fill="none" stroke="currentColor" stroke-width="3"/>' +
      '<g fill="currentColor">' + leaves + '</g></svg>';
  }

  function thesisComingSoon(sec, ctx) {
    var cs = sec.comingSoon;
    var lvl = ctx.lvl || 2;
    var teaser = has(cs.teaserImage) && safeUrl(cs.teaserImage)
      ? '<img class="soon__teaser" src="' + esc(safeUrl(cs.teaserImage)) + '" alt="" loading="lazy" decoding="async">' : '';
    var pillars = (cs.pillars || []).filter(function (p) { return has(p.name); });
    // Royal scroll: two parchment rolls around the page (see playScroll()).
    var roll = function (pos) {
      return '<div class="scroll__roll scroll__roll--' + pos + '" aria-hidden="true"><span class="scroll__grain"></span></div>';
    };
    var corner = function (pos) {
      return '<svg class="scroll__corner scroll__corner--' + pos + '" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width=".9" stroke-linecap="round">' +
        '<path d="M6 58C6 32 18 14 46 8"/><path d="M6 58c5-15 15-24 29-25 8-.6 11 5 7 9-4 3.6-9 .4-6.4-3.4"/>' +
        '<path d="M46 8c6-1.2 10 .6 12-2"/><path d="M14 44c4-10 12-16 22-17" opacity=".55"/>' +
        '<circle cx="8.5" cy="55.5" r="1.4" fill="currentColor" stroke="none"/></g></svg>';
    };
    return '<div class="scroll" data-scroll>' + roll('top') +
      '<section class="soon scroll__paper" aria-labelledby="' + ctx.headingId + '">' +
      corner('tl') + corner('tr') + corner('bl') + corner('br') +
      '<div class="soon__atmos" aria-hidden="true">' + teaser + soonMotif(ctx.mode) +
        leafShadow('soon__leaves--tr') + leafShadow('soon__leaves--bl') +
        '<span class="soon__glow"></span><span class="soon__veil"></span></div>' +
      '<div class="soon__inner">' +
        '<p class="soon__eyebrow" aria-hidden="true">' + esc(cs.eyebrow) + '</p>' +
        '<p class="soon__line">' + esc(cs.line) + '</p>' +
        H(lvl, 'soon__heading', '<span class="visually-hidden">' + esc(cs.eyebrow) + ': </span>' + esc(cs.heading), ' id="' + ctx.headingId + '" tabindex="-1"') +
        (has(cs.projectTitle) ? H(lvl + 1, 'soon__title', esc(cs.projectTitle)) : '') +
        (has(cs.projectSubtitle) ? '<p class="soon__subtitle">' + esc(cs.projectSubtitle) + '</p>' : '') +
        '<span class="soon__ornament" aria-hidden="true"></span>' +
        '<p class="soon__desc">' + esc(cs.description) + '</p>' +
        (pillars.length ? '<ul class="soon__pillars" aria-label="Concept pillars">' + pillars.map(function (p) {
          return '<li class="soon__pillar">' + pillarIcon(p.icon) +
            '<span class="soon__pillar-name">' + esc(p.name) + '</span>' +
            (has(p.text) ? '<span class="soon__pillar-text">' + esc(p.text) + '</span>' : '') + '</li>';
        }).join('') + '</ul>' : '') +
        '<p class="soon__status"><span class="soon__dot" aria-hidden="true"></span>' + esc(cs.status) + '</p>' +
      '</div>' +
    '</section>' + roll('bottom') + '</div>';
  }

  /* ---- Royal scroll unfurling ------------------------------------------
     The parchment is revealed (clipped, never stretched) between two rolls
     that travel apart; the rolls slim down as paper leaves them, their grain
     turns, and both settle with a gentle overshoot. ~2 seconds in total. */
  var SCROLL_MS = 1750, SCROLL_DELAY = 260;

  function prepareScroll(root) {
    // Panel only (not the list view), and only with motion allowed.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.querySelectorAll('[data-scroll]').forEach(function (s) { s.classList.add('is-rolled'); });
  }

  function playScroll(root) {
    var s = root.querySelector('[data-scroll].is-rolled');
    if (!s) return;
    var paper = s.querySelector('.scroll__paper');
    var top = s.querySelector('.scroll__roll--top'), bottom = s.querySelector('.scroll__roll--bottom');
    var H = paper.offsetHeight;
    // Open from the middle of what's on screen (on a phone the scroll is
    // taller than the screen, so it opens near the top where people look).
    var scroller = s.closest('.panel__scroll');
    var visible = scroller ? Math.max(120, scroller.clientHeight - (paper.getBoundingClientRect().top - scroller.getBoundingClientRect().top)) : H;
    var y0 = Math.round(Math.min(H / 2, visible / 2));
    var easing = 'cubic-bezier(.42, .02, .24, 1)';
    var opts = { duration: SCROLL_MS, delay: SCROLL_DELAY, easing: easing, fill: 'backwards' };
    s.classList.remove('is-rolled');
    var anims = [
      paper.animate([
        { clipPath: 'inset(' + y0 + 'px 0 ' + (H - y0) + 'px 0)' },
        { clipPath: 'inset(0px 0 0px 0)', offset: .88 },
        { clipPath: 'inset(0px 0 0px 0)' }
      ], opts),
      top.animate([
        { transform: 'translateY(' + y0 + 'px) scaleY(1.22)' },
        { transform: 'translateY(-5px) scaleY(1)', offset: .88 },
        { transform: 'translateY(0) scaleY(1)' }
      ], opts),
      bottom.animate([
        { transform: 'translateY(' + (y0 - H) + 'px) scaleY(1.22)' },
        { transform: 'translateY(5px) scaleY(1)', offset: .88 },
        { transform: 'translateY(0) scaleY(1)' }
      ], opts),
      // the rolls' grain turns as paper comes off them
      top.querySelector('.scroll__grain').animate([{ backgroundPosition: '0 0' }, { backgroundPosition: '0 -' + Math.round(y0 / 3) + 'px' }], opts),
      bottom.querySelector('.scroll__grain').animate([{ backgroundPosition: '0 0' }, { backgroundPosition: '0 ' + Math.round((H - y0) / 3) + 'px' }], opts),
      // the closed scroll eases into view before it opens
      s.animate([{ opacity: 0, transform: 'translateY(10px) scale(.985)' }, { opacity: 1, transform: 'none' }],
        { duration: 380, easing: 'ease-out', fill: 'backwards' })
    ];
    Promise.all(anims.map(function (a) { return a.finished.catch(function () {}); })).then(function () {
      anims.forEach(function (a) { a.cancel(); });
    });
  }

  function thesis(sec, ctx) {
    if (sec.comingSoon && sec.comingSoon.enabled) return thesisComingSoon(sec, ctx);
    var extra = (has(sec.subtitle) ? '<p class="sec-sub">' + esc(sec.subtitle) + '</p>' : '') +
      (has(sec.status) ? '<p class="status">' + esc(sec.status) + '</p>' : '');
    var html = sectionHead(sec, ctx, extra) +
      '<div class="prose">' + paras(sec.summary, true) + '</div>' +
      (has(sec.themes) ? '<ul class="chips" aria-label="Themes">' + sec.themes.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
      '<div class="chapters block">';
    (sec.chapters || []).forEach(function (ch) {
      html += '<section class="chapter"><div><span class="chapter__num" aria-hidden="true"></span>' + H(ctx.lvl + 1, 'h3', esc(ch.heading)) + '</div><div class="prose">';
      html += has(ch.paragraphs) ? paras(ch.paragraphs) : '';
      if (has(ch.list)) html += '<ul class="chips">' + ch.list.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
      if (!has(ch.paragraphs)) html += tbcPara(ch.placeholder || ch.heading);
      if ('citations' in ch) {
        html += has(ch.citations)
          ? '<ol class="note">' + ch.citations.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>'
          : tbcPara('Research citations');
      }
      if (ch.images) html += '<div class="block">' + gallery(ch.images, { ratio: '4 / 3' }) + '</div>';
      html += '</div></section>';
    });
    return html + '</div>';
  }

  /* ---- 6. Competitions ------------------------------------------------- */

  function competitions(sec, ctx) {
    var pfx = ctx.mode === 'list' ? 'list-comp-' : 'comp-';
    var html = sectionHead(sec, ctx) +
      '<ul class="jump" aria-label="Entries">' + sec.items.map(function (c) {
        return '<li><a class="pill pill--outline" href="#' + pfx + esc(c.id) + '" data-jump="' + pfx + esc(c.id) + '">' + esc(c.title) + '</a></li>';
      }).join('') + '</ul>';
    sec.items.forEach(function (c) {
      html += '<article class="entry" id="' + pfx + esc(c.id) + '" tabindex="-1">' +
        '<p class="eyebrow">' + esc(c.kind) + '</p>' +
        H(ctx.lvl + 1, 'sec-title', esc(c.title)) +
        (has(c.comingSoon) ? '<div class="entry__soon"><p class="entry__soon-label">' + esc(c.comingSoon) + '</p>' +
          (has(c.comingSoonNote) ? '<p class="entry__soon-note">' + esc(c.comingSoonNote) + '</p>' : '') + '</div>' : '') +
        '<p class="note">' + (has(c.competition) ? esc(c.competition) : tbc('Competition name, organiser and year')) + '</p>' +
        '<div class="entry__grid">' +
          '<div class="prose">' + H(ctx.lvl + 2, 'h4', 'Design brief') + (has(c.brief) ? paras(c.brief) : tbcPara('Design brief')) + '</div>' +
          '<div class="prose">' + H(ctx.lvl + 2, 'h4', 'Concept and inspiration') + paras(c.concept, true) + '</div>' +
        '</div>' +
        '<div class="block">' + H(ctx.lvl + 2, 'h4', 'Development sketches') + gallery(c.sketches, { ratio: '4 / 3' }) + '</div>' +
        '<div class="block">' + H(ctx.lvl + 2, 'h4', 'Product renderings') + gallery(c.renderings, { wide: true, ratio: '4 / 3' }) + '</div>' +
        '<div class="entry__grid">' +
          '<div>' + H(ctx.lvl + 2, 'h4', 'Key features') + '<ul class="list-elegant">' + (c.features || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></div>' +
          '<div class="prose">' + H(ctx.lvl + 2, 'h4', 'Future development') + (has(c.future) ? paras(c.future) : tbcPara('Next steps for this concept')) + '</div>' +
        '</div>' +
      '</article>';
    });
    return html;
  }

  /* ---- 7. Professional experience ------------------------------------- */

  function experience(sec, ctx) {
    return sectionHead(sec, ctx) +
      '<dl class="facts">' +
        '<div><dt>Position</dt><dd>' + esc(sec.position) + '</dd></div>' +
        '<div><dt>Location</dt><dd>' + esc(sec.location) + '</dd></div>' +
        '<div><dt>Employer</dt><dd>' + (has(sec.employer) ? esc(sec.employer) : tbc('Employer name')) + '</dd></div>' +
        '<div><dt>Dates</dt><dd>' + (has(sec.dates) ? esc(sec.dates) : tbc('Dates')) + '</dd></div>' +
      '</dl>' +
      '<div class="block prose">' + (has(sec.intro) ? paras(sec.intro, true) : tbcPara('A short description of the co-op placement')) + '</div>' +
      '<div class="block split">' +
        '<div>' + H(ctx.lvl + 1, 'h3', esc(sec.areasHeading || 'Areas of experience')) +
          '<ul class="list-elegant">' + (sec.areas || []).map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="prose">' + H(ctx.lvl + 1, 'h3', 'Responsibilities') +
          (has(sec.responsibilities) ? '<ul class="list-elegant">' + sec.responsibilities.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' : tbcPara('Exact responsibilities')) + '</div>' +
      '</div>' +
      '<div class="block">' + H(ctx.lvl + 1, 'h3', 'Project images') + gallery(sec.images, { ratio: '4 / 3' }) +
        '<p class="note">Project images are shown only with the employer’s permission.</p></div>' +
      '<div class="actions">' + resumeButton() + '</div>';
  }

  /* ---- 8. Socials ------------------------------------------------------ */

  /* Minimal fine-line platform icons (drawn in currentColor). */
  var SOCIAL_ICONS = {
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10.5v6M7.5 7.4v.1M11 16.5v-6M11 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6v3.5"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.2 6.8v.1"/>',
    pinterest: '<circle cx="12" cy="12" r="9"/><path d="M10.6 20.6l1.9-8M12.5 12.6c-.5 1.6.6 2.6 1.9 2.6 2 0 3.2-2 3.2-4.3 0-2.6-2.1-4.4-5-4.4-3.2 0-5.1 2.3-5.1 4.6 0 1 .4 1.9 1.1 2.3"/>'
  };
  function socialIcon(platform) {
    var p = SOCIAL_ICONS[String(platform).toLowerCase()];
    if (!p) return '';
    return '<svg class="social-list__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">' + p + '</g></svg>';
  }

  function socials(sec, ctx) {
    var live = (sec.links || []).filter(function (l) { return /^https:\/\//i.test(l.url || ''); });
    return sectionHead(sec, ctx) +
      (has(sec.intro) ? '<div class="prose"><p class="lede">' + esc(sec.intro) + '</p></div>' : '') +
      (live.length
        ? '<ul class="social-list">' + live.map(function (l) {
            return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' +
              '<span class="social-list__name">' + socialIcon(l.platform) + esc(l.platform) + '</span>' +
              '<span class="social-list__handle">' + (has(l.handle) ? esc(l.handle) : 'Visit') + '<span class="visually-hidden"> (opens in a new tab)</span></span></a></li>';
          }).join('') + '</ul>'
        : '<p class="notice">Social and professional links will appear here soon.</p>' + tbcPara('Add real profile URLs in data/portfolio.js'));
  }

  /* ---- 9. Get in touch ------------------------------------------------- */

  function contact(sec, ctx) {
    var email = String(P.site.email || '').trim();
    var pfx = ctx.mode + '-contact-';
    var endpoint = safeUrl(sec.formEndpoint);
    var html = sectionHead(sec, ctx) +
      '<div class="prose"><p class="lede">' + esc(sec.invitation) + '</p></div>' +
      '<div class="block">' + H(ctx.lvl + 1, 'h4', 'Email') +
        (email ? '<a class="email-link" href="mailto:' + esc(email) + '">' + esc(email) + '</a>' : tbcPara('Email address')) +
      '</div>';
    if (sec.showForm) {
      html += '<div class="block">' + H(ctx.lvl + 1, 'h4', 'Send a message') +
        '<form class="form" data-contact-form' + (endpoint ? ' action="' + esc(endpoint) + '" method="post"' : '') + ' novalidate>' +
        (endpoint ? '' : '<p class="notice">The message form isn’t connected yet, so it can’t send anything. ' +
          (email ? 'Please use the email link above for now.' : 'Please check back soon.') + '</p>') +
        '<fieldset' + (endpoint ? '' : ' disabled') + '>' +
          '<div class="field"><label for="' + pfx + 'name">Name <span class="opt">(optional)</span></label><input id="' + pfx + 'name" name="name" type="text" autocomplete="name"></div>' +
          '<div class="field"><label for="' + pfx + 'email">Email</label><input id="' + pfx + 'email" name="email" type="email" autocomplete="email" required></div>' +
          '<div class="field"><label for="' + pfx + 'message">Message</label><textarea id="' + pfx + 'message" name="message" required></textarea></div>' +
          '<div><button type="submit" class="pill pill--solid">Send message</button></div>' +
        '</fieldset>' +
        '<p class="form__status" data-form-status role="status" aria-live="polite"></p>' +
        '</form></div>';
    }
    return html;
  }

  /* ---- dispatch -------------------------------------------------------- */

  var RENDERERS = {
    introduction: introduction, projects: projects, philosophy: philosophy,
    drawings: drawings, thesis: thesis, competitions: competitions,
    experience: experience, socials: socials, contact: contact
  };

  function render(id, ctx) {
    var sec = P.sections[id];
    ctx = Object.assign({ mode: 'panel', view: 'index', lvl: 2, headingId: 'panel-title' }, ctx || {});
    var fn = RENDERERS[id];
    return fn ? fn(sec, ctx) : sectionHead(sec, ctx);
  }

  function renderList() {
    var toc = P.drawers.map(function (id) {
      return '<li><a href="#list-' + id + '" data-jump="list-' + id + '">' + esc(P.sections[id].label) + '</a></li>';
    }).join('');
    var body = P.drawers.map(function (id) {
      return '<section class="list-section" id="list-' + id + '" aria-labelledby="list-h-' + id + '">' +
        render(id, { mode: 'list', headingId: 'list-h-' + id }) + '</section>';
    }).join('');
    return '<div class="list-view__bar">' +
        '<a class="text-btn" href="#vanity"><span aria-hidden="true" class="arrow-left"></span>Back to the vanity</a>' +
        '<span class="list-view__brand" aria-hidden="true">' + esc(P.site.title) + '</span>' +
      '</div>' +
      '<main class="list-view__inner">' +
        '<header class="list-view__intro">' +
          '<h1 tabindex="-1">' + esc(P.site.name) + '</h1>' +
          '<p>' + esc(P.site.role) + ' · ' + esc(P.site.program) + '</p>' +
          '<nav aria-label="Portfolio sections"><ol class="toc">' + toc + '</ol></nav>' +
        '</header>' + body +
        '<p class="block"><a class="pill pill--outline" href="#vanity"><span aria-hidden="true" class="arrow-left"></span>Back to the vanity</a></p>' +
      '</main>';
  }

  /* ---- interactive enhancements --------------------------------------- */

  function enhance(root, id, ctx) {
    if (!ctx || ctx.mode !== 'list') prepareScroll(root);
    // In-page jumps (competition entries, list-view contents) without changing the URL.
    root.querySelectorAll('[data-jump]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.getElementById(a.dataset.jump);
        if (!target) return;
        e.preventDefault();
        e.stopPropagation();
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });

    root.querySelectorAll('[data-viewer]').forEach(setupViewer);
    root.querySelectorAll('[data-contact-form]').forEach(setupForm);
  }

  function setupViewer(viewer) {
    var canvas = viewer.querySelector('[data-canvas]');
    var image = canvas.querySelector('img');
    var label = viewer.querySelector('[data-zoom-label]');
    var STEPS = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4];
    var zoom = 'fit';

    function currentScale() { return image.naturalWidth ? image.clientWidth / image.naturalWidth : 1; }
    function apply(z, anchor) {
      var prev = currentScale();
      var cx = anchor ? anchor.x : canvas.clientWidth / 2;
      var cy = anchor ? anchor.y : canvas.clientHeight / 2;
      var px = (canvas.scrollLeft + cx) / prev, py = (canvas.scrollTop + cy) / prev;
      zoom = z;
      if (z === 'fit') {
        canvas.classList.add('is-fit');
        image.style.width = '';
        label.textContent = 'Fit';
        return;
      }
      canvas.classList.remove('is-fit');
      image.style.width = Math.round(image.naturalWidth * z) + 'px';
      label.textContent = Math.round(z * 100) + '%';
      canvas.scrollLeft = px * z - cx;
      canvas.scrollTop = py * z - cy;
    }
    function step(dir) {
      var s = zoom === 'fit' ? currentScale() : zoom;
      var next = dir > 0 ? STEPS.find(function (v) { return v > s + 0.001; }) : STEPS.slice().reverse().find(function (v) { return v < s - 0.001; });
      if (next) apply(next);
    }
    viewer.addEventListener('click', function (e) {
      var b = e.target.closest('[data-zoom]');
      if (!b) return;
      var z = b.dataset.zoom;
      if (z === 'in') step(1); else if (z === 'out') step(-1); else if (z === 'fit') apply('fit'); else apply(1);
    });
    canvas.addEventListener('keydown', function (e) {
      if (e.key === '+' || e.key === '=') { e.preventDefault(); step(1); }
      else if (e.key === '-' || e.key === '_') { e.preventDefault(); step(-1); }
      else if (e.key === '0') { e.preventDefault(); apply('fit'); }
    });
    // Drag to pan when zoomed in (mouse / pen). Touch uses native scrolling.
    var drag = null;
    canvas.addEventListener('pointerdown', function (e) {
      if (zoom === 'fit' || e.pointerType === 'touch') return;
      drag = { x: e.clientX, y: e.clientY, l: canvas.scrollLeft, t: canvas.scrollTop };
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!drag) return;
      canvas.scrollLeft = drag.l - (e.clientX - drag.x);
      canvas.scrollTop = drag.t - (e.clientY - drag.y);
    });
    ['pointerup', 'pointercancel'].forEach(function (t) { canvas.addEventListener(t, function () { drag = null; }); });
    // Double-click toggles between fit and 100%.
    canvas.addEventListener('dblclick', function (e) {
      var r = canvas.getBoundingClientRect();
      if (zoom === 'fit') apply(1, { x: e.clientX - r.left, y: e.clientY - r.top }); else apply('fit');
    });
  }

  function setupForm(form) {
    var status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute('action');
      if (!endpoint) return;   // not configured: never pretend to send
      var emailInput = form.querySelector('[name="email"]');
      var msgInput = form.querySelector('[name="message"]');
      if (!emailInput.value.trim() || !emailInput.checkValidity() || !msgInput.value.trim()) {
        status.className = 'form__status is-error';
        status.textContent = 'Please add a valid email address and a message.';
        (!emailInput.value.trim() || !emailInput.checkValidity() ? emailInput : msgInput).focus();
        return;
      }
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      status.className = 'form__status';
      status.textContent = 'Sending…';
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          status.className = 'form__status is-ok';
          status.textContent = 'Thank you — your message was sent.';
          form.reset();
        })
        .catch(function () {
          status.className = 'form__status is-error';
          status.textContent = 'Sorry, the message could not be sent. Please try again later.';
        })
        .then(function () { btn.disabled = false; });
    });
  }

  window.AIL = window.AIL || {};
  window.AIL.panels = { render: render, renderList: renderList, enhance: enhance, play: playScroll };
})();
