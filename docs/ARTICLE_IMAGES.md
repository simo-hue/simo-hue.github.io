# Writing articles with images

Keep writing normal Markdown. Put each image on its own line, with a blank line before and after it. Store the image beside the article's `index.md` as before.

## Placement and size

```md
![A view of the museum](museum.webp)

![A view of the museum](museum.webp#right)

![A view of the museum](museum.webp#left)

![A supporting portrait](portrait.webp#right-small)

![A supporting portrait](portrait.webp#left-small)
```

- No suffix: a centered image, using the available article width while preserving its proportions. Tall images are limited to 36rem high; small originals are not enlarged.
- `#right` or `#left`: text wraps around an image occupying 40% of the article column on screens at least 768px wide.
- `#right-small` or `#left-small`: the same behavior at 30%, useful for portraits, logos, and supporting details.
- Below 768px, images stack above the following text. Small images remain centered and no wider than 20rem.

Place an aligned image **before** the paragraphs that should wrap around it. Text returns to full width below the image. Every heading starts below the preceding image. Lists, quotations, tables, code blocks, horizontal rules, and subsequent figures also clear wrapping so their layouts stay readable. Wrapping is contained inside the article.

The placement suffix controls this website's layout; another Markdown preview may display the image without wrapping. No HTML or shortcode is required.

## Captions and accessibility

Use the optional Markdown title for a visible caption:

```md
![Visitors at the museum](museum.webp#right "Inside the Enzo Ferrari Museum, Modena")

The story continues beside this photograph on desktop and below it on mobile.
```

The description in square brackets is alternative text for the image. Describe what matters in the scene. The quoted title is a visible caption, which stays with the image and also appears in its enlargement view. Images continue to open in the existing lightbox.

## Choosing a layout

- Wrap occasional photographs beside several paragraphs of related prose.
- Use the small preset for a logo or supporting detail.
- Keep diagrams, screenshots with small text, large groups, and photo sequences centered so their detail remains visible.
- Leave closing images centered when there is no following text to wrap.
- Avoid alternating the alignment of every image mechanically; choose placement based on the surrounding text.

Article covers still use the existing `image:` front matter. They now preserve their proportions at a maximum height of 32rem, rather than stretching tall book covers or portraits across the entire header width.

## Sideways source photographs

Existing photos with missing orientation metadata can be corrected at render time using Hugo page-resource metadata. Source files remain unchanged. This is already configured for the five affected photos in “Live the dream.”

```yaml
resources:
  - src: simulator.webp
    params:
      rotation: 270
```

Hugo's rotation is counterclockwise, so `270` turns the photo 90 degrees clockwise. The correction is used for both the article image and its enlargement.

## Transparent diagrams

For a transparent diagram with pale lettering, keep it centered and give it a dark backing in either site theme:

```yaml
resources:
  - src: "diagram*"
    params:
      background: dark
```

This changes only its presentation. It is already configured for the four diagrams in “Don’t Brag.”

## Implementation reference

The custom render hook uses Hugo's [standalone image rendering](https://gohugo.io/render-hooks/images/) to keep figures out of paragraphs. Only the four documented placement suffixes are interpreted as layout controls. The existing image pipeline retains local responsive image processing and loading behavior; no client-side layout library was added.
