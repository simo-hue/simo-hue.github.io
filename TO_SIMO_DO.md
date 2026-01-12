# TO_SIMO_DO

## Manual Actions Required
- [x] **Generate Image**: Copy the provided prompt and paste it into Gemini (Nano Banana) to generate the image.
- [x] **Select & Save**: Choose the best result, save it as `service-1.png` (or a new name like `journey-life.png`).
- [x] **Upload**: Place the image in `assets/images/` or `static/images/` (replacing the old one or adding the new one).
- [x] **Update Content**: If you changed the filename, update `content/english/_index.md` to point to the new image file.
- [ ] Verify the About page works correctly by running `npm run dev` and visiting the local server.
- [ ] **Verify Tags Removal**: Check that the "Tags" section is no longer visible on the blog post pages and category list pages.
- [ ] **Check Search**: Verify if the search functionality still works as expected without tags.
- [ ] **SECURITY ACTION**: Go to Google Cloud Console > APIs & Services > Credentials. Identify the leaked key (`AIza...`) and **REVOKE** it immediately.
- [ ] **Populate Content**: Add the actual text content for the new article "The Star Counter" in `content/italian/blog/thought/the-star-counter/index.md`.
- [ ] **Populate Content**: Add the actual text content for the new article "Live the dream" in `content/italian/blog/thought/live-the-dream/index.md`.
- [ ] **Add Images**: Add `image.png` (or update frontmatter) for both new articles.
- [ ] **Publish**: Set `draft: false` in the frontmatter of both articles when ready.
