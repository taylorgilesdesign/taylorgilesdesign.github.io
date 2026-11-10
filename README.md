# An Inside Look — Taylor Giles

An interior design portfolio built around a vanity with nine drawers. Each drawer
opens a section of the portfolio.

The site is plain HTML, CSS and JavaScript. There is nothing to install and no
build step.

---

## 1. Previewing the site on your computer

The site needs a small local "server" so the browser treats it like a real
website. The easiest way is through VS Code.

**Option A — VS Code Live Server (recommended)**

1. Open VS Code, then **File → Open Folder…** and choose the `TAYLORS WEBSITE` folder.
2. Click the **Extensions** icon on the left (four squares), search for **Live Server**
   (by Ritwick Dey) and click **Install**.
3. Open `index.html`, right-click anywhere in the file and choose **Open with Live Server**.
4. Your browser opens at an address like `http://127.0.0.1:5500/index.html`.
   The page reloads by itself each time you save a change.

**Option B — just open the file**

Double-clicking `index.html` also works. One difference: when the page is
opened straight from a file, the browser won't let the site read the
vanity image's pixels, so the wall and floor beyond the image's edges use a
simpler, flatter fallback. Live Server, and the published site, show the full
version. Live Server also reloads automatically.

*(If you'd rather use a terminal, `npx serve .` in VS Code's terminal also works.
It downloads a small preview tool the first time you run it. The site itself
never needs it.)*

**Things to try:** hover over a drawer, click it, press `Esc` to close it,
press `Tab` to move between drawers, open the site on your phone and tap
**Explore the Drawers**, and try **A Look Within** (the whole portfolio on one
accessible page).

**On phones (held upright):** the room fills the whole screen at its true
proportions and is wider than the screen, so visitors swipe left and right to
explore it, and tap a drawer to open it. It opens centred on the middle of the
vanity. "Explore the Drawers" (top right) lists all nine sections.

**Changing the small homepage text:** "Discover what lies within",
"A Look Within" and "Explore the Drawers" are set at the top of
`data/portfolio.js` (`homeHint`, `homeHintMobile`, `listLinkText`, `exploreText`).

---

## 2. How the files are organised

```
index.html              The page itself (you rarely need to edit this)
data/portfolio.js       ★ ALL your words, images, links and documents
css/styles.css          Colours, fonts and layout
js/drawers.js           Drawer positions (measured from the vanity image) and animation
js/scene.js             Continues the wall, ceiling and floor beyond the image's edges
                        on wide and tall screens (built from the image's own edge
                        pixels; the image itself is never changed)
js/panels.js            Builds each drawer's content from data/portfolio.js
js/cursor.js            The makeup-brush cursor and sparkles
js/main.js              Opens/closes drawers, keyboard support, menus
assets/images/          Photos, renderings, the vanity image, the portrait
assets/drawings/        Technical drawings (PNG/JPG and PDF)
assets/documents/       Résumé and project PDFs
assets/cursor/          The brush cursor artwork
```

**The vanity image.** `assets/images/vanity-home.png` is an exact,
byte-for-byte copy of your original file *Timeless Walnut Vanity with Scalloped
Mirror.png*. The original is still in the main folder, untouched. Don't edit
or resize `vanity-home.png`. The drawer positions were measured from its
exact size (1672 × 941 pixels).

---

## 3. Changing text

Open **`data/portfolio.js`**. Each section is clearly labelled (`1 ─ INTRODUCTION`,
`2 ─ PROJECTS`, and so on). Change the words between the quotation marks and save.

- Leave a value as `""` if you don't have it yet. The site will show a
  dashed **"To confirm"** or **"Placeholder"** box, or hide the item.
- To add a paragraph, add another line in quotes inside the square brackets,
  with a comma between lines:
  ```js
  paragraphs: [
    "First paragraph.",
    "Second paragraph."
  ]
  ```
- **If the site goes blank after an edit,** there's almost always a missing comma
  or quotation mark. Undo the last change (`Ctrl + Z`) and try again. If you
  need to type an apostrophe inside text, use the curly one (’) or `\'`.

## 4. Replacing images

1. Save the image into the right folder, for example
   `assets/images/projects/the-pause-between/cover.jpg`.
   Use lowercase file names with hyphens and no spaces.
2. In `data/portfolio.js`, put the path into that image's `src`, and add a short
   description in `alt` for people using screen readers:
   ```js
   cover: { src: "assets/images/projects/the-pause-between/cover.jpg",
            alt: "Waiting area with timber screens and planted alcoves", ... }
   ```
3. Add a `caption` if you'd like text under the image.

**Image sizes:** save photos and renderings as JPG, about 2000 px on the long
side and under about 500 KB each. In Photoshop use *Export As* → JPG, quality 70–80.
Images further down the page only load when someone scrolls to them.

## 5. Adding technical drawings

1. Export each drawing as a **PNG** at least 2400 px wide so it stays crisp when
   zoomed. Optionally, also export a PDF.
2. Put the files in `assets/drawings/`.
3. In `data/portfolio.js` → `drawings` → the right category, fill in:
   ```js
   { title: "Main floor plan", project: "The Pause Between",
     image: "assets/drawings/pause-between-floor-plan.png",
     pdf: "assets/drawings/pause-between-floor-plan.pdf", caption: "" }
   ```
4. Visitors can then select the drawing to open the viewer. It has zoom (+ / −),
   **Fit**, **100%**, drag-to-move, **Open full size** and **Download PDF**.
   To add more drawings, copy a whole `{ … }` line and add a comma.

## 6. Résumé, project PDFs, email, links and the contact form

| What | Where in `data/portfolio.js` | Example |
|---|---|---|
| Résumé | `site.resume` | `"assets/documents/taylor-giles-resume.pdf"` |
| Project PDF | each project's `pdf` | `"assets/documents/the-ledger-residence.pdf"` |
| Email | `site.email` | your real address |
| Social links | `socials.links` → `url` | must start with `https://` |
| Contact form | `contact.formEndpoint` | see below |

- Until a file or link is added, buttons show **"coming soon"** and stay disabled,
  and social links stay hidden. You can delete platforms you don't use from the list.
- **Contact form:** a website hosted on GitHub Pages can't send email by itself.
  The form is shown but switched off, with a note explaining why. To switch it
  on, create a free form at a service such as [Formspree](https://formspree.io),
  then paste the address it gives you (like `https://formspree.io/f/abcd1234`)
  into `formEndpoint`. The site only says "sent" when the service confirms it.
  If you'd rather not have a form, set `showForm: false`.

## 7. Replacing the brush cursor

Replace `assets/cursor/makeup-brush.svg` with your own artwork:

- Keep it **48 × 48** in size.
- Put the **brush tip at the top-left, 3 px in from each edge** (x = 3, y = 3).
  That point is exactly where clicks land.

The brush only appears on computers with a mouse or trackpad. Phones and tablets
keep their normal behaviour. If the file is missing, the normal cursor is used.

---

## 8. Missing assets and information

Everything below is currently a clearly marked placeholder.

**Introduction**
- Portrait photograph
- Résumé PDF

**Projects (all three)**
- Cover image, concept imagery, material samples (names and notes), plans and
  elevations, renderings, optional project PDF
- Design intent statement
- Your role on each project
- **The Ledger Residence:** academic or professional classification

**Design Philosophy**
- Two supporting detail images (optional)

**Technical Drawings**
- Floor plans, reflected ceiling plans, interior elevations, sections and details,
  millwork drawings (PNG plus optional PDF)

**Thesis: The Place to Be**
- The thesis question in your own words
- An expanded concept (the current line is provisional, based on your description)
- Research findings and citations
- Proposed spaces and program areas
- Development sketches and diagrams
- Plans, sections and visualizations

**Competitions: Inferra and Cairvia**
- Competition name, organiser and year
- Design brief
- Development sketches and product renderings
- Future development notes

(Cairvia images on your computer: your Downloads folder has Cairvia renders,
logos and panels. I haven't used any of them. Add whichever are approved.)

**Professional Experience**
- Employer name (and permission to name them)
- Dates
- Short description
- Exact responsibilities
- Approved project images

**Socials**
- Real profile URLs, for any platforms you want to show

**Get in Touch**
- Public email address
- Form service endpoint, if you want the form

**Provisional copy to review:** the introduction, design philosophy, contact
invitation and thesis concept line are in place, but they're yours to edit.

---

## 9. Publishing with GitHub Pages

Do this only when you're ready for the site to be public.

**Before you publish**
- The original *Timeless Walnut Vanity with Scalloped Mirror.png* in the main
  folder isn't used by the site. Move it out of the folder, or simply don't
  upload it, so you don't publish two copies.
- The empty `New folder` can be deleted.
- Check every placeholder you're happy to show publicly. Visitors will see
  "To confirm" labels until you fill them in.

**Steps (using the GitHub website, no command line)**

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Click **+ → New repository**. Name it, for example, `an-inside-look`,
   set it to **Public**, and click **Create repository**.
3. On the new repository page, click **uploading an existing file**.
4. Drag in `index.html`, `README.md` and the folders `assets`, `css`, `data` and `js`.
   Then click **Commit changes**.
5. Go to **Settings → Pages**. Under **Build and deployment**, choose
   **Deploy from a branch**, select branch **main** and folder **/ (root)**,
   then click **Save**.
6. After a minute or two, your site will be live at
   `https://YOUR-USERNAME.github.io/an-inside-look/`.

All file paths in the site are relative, so it works inside a repository
sub-folder like this without any changes.

**Updating later:** in the repository, open the file or folder, click
**Add file → Upload files** (or the pencil icon to edit text), and commit.
The live site updates within a minute or two.

> **Fonts:** headings use Cormorant Garamond, body text uses Jost, and accents
> use Pinyon Script, all loaded from Google Fonts. If they can't load,
> similar built-in fonts are used instead.
