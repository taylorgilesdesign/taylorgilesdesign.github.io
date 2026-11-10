/* ==========================================================================
   AN INSIDE LOOK — PORTFOLIO CONTENT
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit to change words, images, links,
   documents and contact details. The interface code reads from it.

   QUICK RULES
   • Text goes between quotes:  "like this"
   • Leave a value as ""  (empty quotes) when you don't have it yet.
     The site will show a clearly marked placeholder, or hide the item.
   • Image paths are relative to the website folder, e.g.
       "assets/images/projects/the-pause-between/cover.jpg"
   • Keep the commas between items. If the site goes blank after an edit,
     a missing comma or quote is the usual cause (see README.md).
   ========================================================================== */

window.PORTFOLIO = {

  /* ------------------------------------------------------------------------
     SITE-WIDE DETAILS
     ------------------------------------------------------------------------ */
  site: {
    title: "An Inside Look",
    name: "Taylor Giles",
    role: "Interior Design Student",
    program: "Honours Bachelor of Interior Design, Georgian College",

    // Your résumé PDF. Leave "" to keep the résumé button disabled.
    // Example: "assets/documents/taylor-giles-resume.pdf"
    resume: "",

    // Your public email address. Leave "" to hide the email link.
    email: "",

    // Small line shown beneath the vanity. Set to "" to hide it.
    homeHint: "Click the drawers to see what lies inside",
    // The same line on phones / tablets held upright, where the room is
    // wider than the screen and visitors swipe to explore it.
    homeHintMobile: "Swipe to explore · Tap to discover",

    // The quiet link that opens the whole portfolio on one accessible page.
    listLinkText: "A Look Within",
    listLinkLabel: "A Look Within: view the whole portfolio as an accessible list",

    // The phone / tablet button that opens the list of drawers.
    exploreText: "Explore the Drawers"
  },

  /* ------------------------------------------------------------------------
     DRAWER ORDER — as the visitor sees the vanity
       top row:     introduction | projects       | philosophy
       middle row:  drawings     | thesis         | competitions
       bottom row:  experience   | socials        | contact
     Change the order here only if you want sections in different drawers.
     ------------------------------------------------------------------------ */
  drawers: [
    "introduction", "projects", "philosophy",
    "drawings", "thesis", "competitions",
    "experience", "socials", "contact"
  ],

  /* ------------------------------------------------------------------------
     THE NINE SECTIONS
     Every section has:
       label  – the name shown on the drawer and in menus
       title  – the large heading inside the panel
       accent – an optional short script word above the title ("" = none)
     ------------------------------------------------------------------------ */
  sections: {

    /* 1 ─ INTRODUCTION ───────────────────────────────────────────────────── */
    introduction: {
      label: "Introduction",
      title: "Introduction",
      accent: "hello",
      portrait: {
        show: false,                               // true = show a portrait beside the text
        src: "",                                 // e.g. "assets/images/taylor-giles-portrait.jpg"
        alt: "Portrait of Taylor Giles",
        placeholder: "Portrait photograph",
        ratio: "4 / 5",
        // Which part of the photo stays in view when it is cropped to the frame:
        // "horizontal% vertical%". 50% 30% = centred, a little above middle (face).
        // Raise the first number (e.g. 65%) to shift the crop right, away from
        // anything at the left edge of the photo.
        focus: "50% 30%"
      },
      // Provisional copy — edit freely.
      paragraphs: [
        "I’m Taylor Giles, an interior design student at Georgian College with an interest in creating thoughtful spaces that balance atmosphere, function, and the way people feel within them. My work explores how materials, light, and spatial planning can shape everyday experiences."
      ],
      // Software list and résumé button are hidden on this page for now.
      // To show them again: skills: ["Revit", "AutoCAD", "SketchUp", "Twinmotion"]
      // and showResume: true
      skillsHeading: "Software",
      skills: [],
      showResume: false
    },

    /* 2 ─ PROJECTS ───────────────────────────────────────────────────────── */
    projects: {
      label: "Projects",
      title: "Projects",
      accent: "",
      intro: "",   // optional sentence above the project list
      items: [

        /* The Pause Between */
        {
          id: "the-pause-between",
          title: "The Pause Between",
          projectType: "Academic healthcare design proposal",
          role: "",                                // to confirm, e.g. "Individual project"
          summary: "An academic healthcare design proposal for the Royal Victoria Hospital main entrance waiting area.",
          cover: { src: "", alt: "Cover image for The Pause Between", placeholder: "Cover image", ratio: "4 / 3" },
          overview: [
            "An academic healthcare design proposal for the Royal Victoria Hospital main entrance waiting area. The concept reframes waiting as an opportunity for restoration through sensory calm, natural elements, and choices between connection and retreat."
          ],
          designIntent: [],                        // add paragraphs when ready
          concept: [
            { src: "", alt: "", caption: "", placeholder: "Concept image or mood board" },
            { src: "", alt: "", caption: "", placeholder: "Concept image or mood board" }
          ],
          materials: [
            { name: "", note: "", src: "", placeholder: "Material sample" },
            { name: "", note: "", src: "", placeholder: "Material sample" },
            { name: "", note: "", src: "", placeholder: "Material sample" },
            { name: "", note: "", src: "", placeholder: "Material sample" }
          ],
          plans: [
            { src: "", alt: "", caption: "", placeholder: "Floor plan" },
            { src: "", alt: "", caption: "", placeholder: "Interior elevation" }
          ],
          renderings: [
            { src: "", alt: "", caption: "", placeholder: "Rendering" },
            { src: "", alt: "", caption: "", placeholder: "Rendering" }
          ],
          pdf: ""                                  // e.g. "assets/documents/the-pause-between.pdf"
        },

        /* La Paella Restaurante */
        {
          id: "la-paella-restaurante",
          title: "La Paella Restaurante",
          projectType: "Academic restaurant design concept",
          role: "",
          summary: "An academic Spanish restaurant design concept drawing on warm tavern interiors.",
          cover: { src: "", alt: "Cover image for La Paella Restaurante", placeholder: "Cover image", ratio: "4 / 3" },
          overview: [
            "An academic Spanish restaurant design concept drawing on warm tavern interiors, arches, textured stucco, limestone, and layered lighting."
          ],
          designIntent: [],
          concept: [
            { src: "", alt: "", caption: "", placeholder: "Concept image or mood board" },
            { src: "", alt: "", caption: "", placeholder: "Concept image or mood board" }
          ],
          materials: [
            { name: "", note: "", src: "", placeholder: "Material sample" },
            { name: "", note: "", src: "", placeholder: "Material sample" },
            { name: "", note: "", src: "", placeholder: "Material sample" },
            { name: "", note: "", src: "", placeholder: "Material sample" }
          ],
          plans: [
            { src: "", alt: "", caption: "", placeholder: "Floor plan" },
            { src: "", alt: "", caption: "", placeholder: "Interior elevation" }
          ],
          renderings: [
            { src: "", alt: "", caption: "", placeholder: "Rendering" },
            { src: "", alt: "", caption: "", placeholder: "Rendering" }
          ],
          pdf: ""
        },

        /* The Ledger Residence */
        {
          id: "the-ledger-residence",
          title: "The Ledger Residence",
          projectType: "",                         // to confirm: academic or professional classification
          role: "",                                // to confirm
          summary: "An English-country modern residential design project focused on warmth, family life, and natural materials.",
          cover: { src: "", alt: "Cover image for The Ledger Residence", placeholder: "Cover image", ratio: "4 / 3" },
          overview: [
            "An English-country modern residential design project focused on warmth, family life, natural materials, and Passive House goals."
          ],
          designIntent: [],
          concept: [
            { src: "", alt: "", caption: "", placeholder: "Concept image or mood board" },
            { src: "", alt: "", caption: "", placeholder: "Concept image or mood board" }
          ],
          materials: [
            { name: "", note: "", src: "", placeholder: "Material sample" },
            { name: "", note: "", src: "", placeholder: "Material sample" },
            { name: "", note: "", src: "", placeholder: "Material sample" },
            { name: "", note: "", src: "", placeholder: "Material sample" }
          ],
          plans: [
            { src: "", alt: "", caption: "", placeholder: "Floor plan" },
            { src: "", alt: "", caption: "", placeholder: "Interior elevation" }
          ],
          renderings: [
            { src: "", alt: "", caption: "", placeholder: "Rendering" },
            { src: "", alt: "", caption: "", placeholder: "Rendering" }
          ],
          pdf: ""
        }
      ]
    },

    /* 3 ─ DESIGN PHILOSOPHY ──────────────────────────────────────────────── */
    philosophy: {
      label: "Design Philosophy",
      title: "Design Philosophy",
      accent: "in my words",
      // Provisional copy — edit freely.
      paragraphs: [
        "I believe thoughtful interiors begin with understanding how people want to feel and live within a space. My approach brings together function, atmosphere, and materiality to create environments that feel welcoming and purposeful. I’m interested in how light, nature, and opportunities for both connection and privacy can support everyday well-being."
      ],
      images: [
        { src: "", alt: "", caption: "", placeholder: "Supporting detail image" },
        { src: "", alt: "", caption: "", placeholder: "Supporting detail image" }
      ]
    },

    /* 4 ─ TECHNICAL DRAWINGS ─────────────────────────────────────────────── */
    drawings: {
      label: "Technical Drawings",
      title: "Technical Drawings",
      accent: "",
      intro: "",
      // For each drawing: image = a high-resolution PNG/JPG (2400px+ wide is ideal),
      // pdf = optional full-quality PDF. Select any drawing to view it full size.
      categories: [
        { label: "Floor plans", items: [
          { title: "", project: "", image: "", pdf: "", caption: "", placeholder: "Floor plan" },
          { title: "", project: "", image: "", pdf: "", caption: "", placeholder: "Floor plan" }
        ]},
        { label: "Reflected ceiling plans", items: [
          { title: "", project: "", image: "", pdf: "", caption: "", placeholder: "Reflected ceiling plan" }
        ]},
        { label: "Interior elevations", items: [
          { title: "", project: "", image: "", pdf: "", caption: "", placeholder: "Interior elevation" },
          { title: "", project: "", image: "", pdf: "", caption: "", placeholder: "Interior elevation" }
        ]},
        { label: "Sections and details", items: [
          { title: "", project: "", image: "", pdf: "", caption: "", placeholder: "Section or detail" }
        ]},
        { label: "Millwork drawings", items: [
          { title: "", project: "", image: "", pdf: "", caption: "", placeholder: "Millwork drawing" }
        ]}
      ]
    },

    /* 5 ─ THESIS PROJECT ─────────────────────────────────────────────────── */
    thesis: {
      label: "Thesis Project",

      // COMING SOON — while the thesis is in development, this drawer shows
      // an elegant "coming soon" page instead of the full project below.
      // When your thesis is ready, change  enabled: true  to  enabled: false
      // and everything further down (title, chapters, galleries) will appear.
      comingSoon: {
        enabled: true,
        eyebrow: "Thesis Project",
        line: "Something thoughtful is taking shape.",
        heading: "Coming Soon",
        projectTitle: "The Place to Be",
        projectSubtitle: "A Youth Hub for Nature, Connection & Everyday Wellness",
        description: "An exploration of how interior design can foster connection, belonging, and everyday wellness through meaningful spaces for youth aged 14–24.",
        // Optional concept pillars (currently none, for a cleaner page).
        // To show them again, add items like:
        //   { icon: "nature", name: "Nature", text: "Everyday connection with the natural world" }
        // icon can be: "nature", "connection", "belonging" or "choice".
        pillars: [],
        status: "Currently in development",
        // Optional: a concept sketch or mood image to show heavily blurred
        // behind the text as a "sneak peek", e.g. "assets/images/thesis/teaser.jpg".
        // Leave "" to use the abstract line motif only.
        teaserImage: ""
      },

      title: "The Place to Be",
      accent: "thesis",
      subtitle: "An Inclusive Youth Hub for Nature, Connection and Everyday Wellness",
      status: "Ongoing thesis proposal",
      summary: [
        "An ongoing thesis proposal for an accessible, everyday environment for young people aged approximately 14–24.",
        "Its focus is choice: visitors can participate, observe, socialize, study, move, connect with nature, or retreat without being forced to join an activity. The proposal explores belonging, nature connection, sensory comfort, and personal agency within an everyday youth environment rather than a clinical treatment facility."
      ],
      themes: ["Belonging", "Nature connection", "Sensory comfort", "Personal agency"],
      // The six chapters. Empty paragraphs/images show as placeholders.
      chapters: [
        {
          heading: "The question",
          paragraphs: [],
          placeholder: "State the thesis question in your own words."
        },
        {
          heading: "The concept",
          paragraphs: [
            "A youth hub built around choice — where participating, observing, socializing, studying, moving, connecting with nature, and retreating are all equally valid ways to spend time."
          ],
          placeholder: "Expand on the concept."
        },
        {
          heading: "Research and insights",
          paragraphs: [],
          placeholder: "Add research findings, precedents and citations.",
          citations: []                            // e.g. "Author, A. (Year). Title. Publisher."
        },
        {
          heading: "Proposed program",
          paragraphs: [],
          // Ways of being in the space, from the thesis focus on choice:
          list: ["Participate", "Observe", "Socialize", "Study", "Move", "Connect with nature", "Retreat"],
          placeholder: "Add the proposed spaces and program areas when defined."
        },
        {
          heading: "Design development",
          paragraphs: [],
          placeholder: "Add sketches, diagrams and process work.",
          images: [
            { src: "", alt: "", caption: "", placeholder: "Development sketch" },
            { src: "", alt: "", caption: "", placeholder: "Diagram" }
          ]
        },
        {
          heading: "Drawings and visualizations",
          paragraphs: [],
          placeholder: "Add plans, sections and visualizations as the design progresses.",
          images: [
            { src: "", alt: "", caption: "", placeholder: "Plan or section" },
            { src: "", alt: "", caption: "", placeholder: "Visualization" }
          ]
        }
      ]
    },

    /* 6 ─ COMPETITIONS ───────────────────────────────────────────────────── */
    competitions: {
      label: "Competitions",
      title: "Competitions",
      accent: "",
      items: [
        {
          id: "inferra",
          title: "Inferra",
          kind: "Fire-feature design concept",
          competition: "",                         // to confirm: competition name / organiser / year
          brief: [],                               // to confirm
          concept: [
            "A fire-feature design concept exploring a sculptural fire bowl and an illuminated lava-inspired channel."
          ],
          sketches: [
            { src: "", alt: "", caption: "", placeholder: "Development sketch" },
            { src: "", alt: "", caption: "", placeholder: "Development sketch" }
          ],
          renderings: [
            { src: "", alt: "", caption: "", placeholder: "Product rendering" },
            { src: "", alt: "", caption: "", placeholder: "Product rendering" }
          ],
          features: [
            "Sculptural fire bowl",
            "Illuminated lava-inspired channel"
          ],
          future: []                               // to confirm
        },
        {
          id: "cairvia",
          title: "Cairvia",
          kind: "Electric fondue concept",
          // Small label under the title while the project is in development.
          // Delete these lines (or set them to "") when Cairvia is complete.
          comingSoon: "Coming Soon",
          comingSoonNote: "Currently in development.",
          competition: "",
          brief: [],
          concept: [
            "A compact, sculptural electric fondue concept inspired by Canadian stone landscapes, cairns, and conviviality.",
            "It unfolds into a tabletop dining experience, with serving components arranged around a central cooking vessel."
          ],
          sketches: [
            { src: "", alt: "", caption: "", placeholder: "Development sketch" },
            { src: "", alt: "", caption: "", placeholder: "Development sketch" }
          ],
          renderings: [
            { src: "", alt: "", caption: "", placeholder: "Product rendering" },
            { src: "", alt: "", caption: "", placeholder: "Product rendering" }
          ],
          features: [
            "Sculptural form inspired by Canadian stone landscapes and cairns",
            "Unfolds into a tabletop dining experience",
            "Serving components arranged around a central cooking vessel",
            "One heating element, serving the central cooking vessel"
          ],
          future: []
        }
      ]
    },

    /* 7 ─ PROFESSIONAL EXPERIENCE ────────────────────────────────────────── */
    experience: {
      label: "Professional Experience",
      title: "Professional Experience",
      accent: "",
      position: "Interior Design Co-op",
      location: "Muskoka",
      employer: "",                                // to confirm (and confirm permission to name)
      dates: "",                                   // to confirm, e.g. "May – August 2025"
      intro: [],                                   // optional description, to confirm
      areasHeading: "Areas of experience",
      areas: [
        "Preparing drawings for permit submissions",
        "Site visits and construction observation",
        "Client and trade coordination",
        "Design documentation",
        "Time management and organisation"
      ],
      responsibilities: [],                        // exact responsibilities, to confirm
      images: [
        { src: "", alt: "", caption: "", placeholder: "Approved project image" },
        { src: "", alt: "", caption: "", placeholder: "Approved project image" }
      ]
    },

    /* 8 ─ SOCIALS ────────────────────────────────────────────────────────── */
    socials: {
      label: "Socials",
      title: "Socials",
      accent: "",
      intro: "",
      // Links stay hidden until you add a real URL (starting with https://).
      links: [
        { platform: "LinkedIn",  handle: "Taylor Giles",       url: "https://www.linkedin.com/in/taylor-giles-845471361/" },
        { platform: "Instagram", handle: "@taylorgilesdesign", url: "https://www.instagram.com/taylorgilesdesign/" },
        { platform: "Pinterest", handle: "@taygiless",         url: "https://ca.pinterest.com/taygiless/projects/" },
        { platform: "Behance",   handle: "",                   url: "" }
      ]
    },

    /* 9 ─ GET IN TOUCH ───────────────────────────────────────────────────── */
    contact: {
      label: "Get in Touch",
      title: "Get in Touch",
      accent: "let’s connect",
      // Provisional invitation — edit freely.
      invitation: "Thank you for taking an inside look. If you’d like to talk about my work or an opportunity, I’d love to hear from you.",
      // Optional contact form. A static website cannot send email by itself.
      // To switch the form on, create a form at a service such as Formspree,
      // then paste its endpoint URL here, e.g. "https://formspree.io/f/abcdwxyz".
      // While this is "", the form is shown but clearly disabled.
      showForm: true,
      formEndpoint: ""
    }
  }
};
