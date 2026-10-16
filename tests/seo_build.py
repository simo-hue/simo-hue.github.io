"""Validate generated SEO output; run after a production Hugo build.

SEO_BUILD_DIR selects output (default public). SEO_BASELINE_DIR optionally
checks the visible page contract against a previous build.
"""
import json
import os
from pathlib import Path
import re
import struct
import unittest
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

BASE = "https://simo-hue.github.io/"
PERSON = BASE + "#person"
OUTPUT = Path(os.environ.get("SEO_BUILD_DIR", "public"))


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.html = path.read_text()
        self.meta = {}
        self.canonical = []
        self.styles = []
        self.schemas = []
        self.lang = ""
        self.alternates = {}
        self.card_images = []
        self.in_card = False
        self.json_buffer = None
        self.feed(self.html)
        self.nodes = []
        for schema in self.schemas:
            self.nodes.extend(schema.get("@graph", [schema]))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = attrs.get("lang", "")
        if tag == "article" and "ds-post-card" in attrs.get("class", "").split():
            self.in_card = True
            self.card_images.append([])
        if tag == "img" and self.in_card:
            self.card_images[-1].append(attrs)
        if tag == "link" and attrs.get("hreflang"):
            self.alternates[attrs["hreflang"]] = attrs["href"]
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property", attrs.get("http-equiv")))] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs["href"])
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.styles.append(attrs["href"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.json_buffer = ""

    def handle_data(self, data):
        if self.json_buffer is not None:
            self.json_buffer += data

    def handle_endtag(self, tag):
        if tag == "article":
            self.in_card = False
        if tag == "script" and self.json_buffer is not None:
            self.schemas.append(json.loads(self.json_buffer))
            self.json_buffer = None

    def of_type(self, kind):
        return [node for node in self.nodes if node.get("@type") == kind]


def local_file(url):
    parsed = urlsplit(url)
    path = OUTPUT / unquote(parsed.path).lstrip("/")
    return path / "index.html" if parsed.path.endswith("/") else path


def walk(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def body(html):
    match = re.search(r"<body\b[^>]*>.*?</body>", html, re.S)
    if not match:
        return None
    # Older baselines used a render-order-dependent shared priority store.
    # Check scheduling separately; all text, images, links, classes,
    # controls and inline scripts must still match exactly.
    return re.sub(r'\s(?:loading|fetchpriority)="[^"]*"', "", match[0])


def jpeg_size(path):
    """Read SOF dimensions so metadata is checked against the encoded file."""
    with path.open("rb") as stream:
        if stream.read(2) != b"\xff\xd8":
            raise ValueError(f"Not a JPEG: {path}")
        while True:
            if stream.read(1) != b"\xff":
                raise ValueError(f"Invalid JPEG marker: {path}")
            marker = stream.read(1)
            while marker == b"\xff":
                marker = stream.read(1)
            length = struct.unpack(">H", stream.read(2))[0]
            if marker in [b"\xc0", b"\xc1", b"\xc2"]:
                _, height, width = struct.unpack(">BHH", stream.read(5))
                return width, height
            stream.seek(length - 2, 1)


class SEOOutput(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if not (OUTPUT / "index.html").exists():
            raise RuntimeError("Build the production site before running SEO checks")
        cls.all_pages = [Page(path) for path in OUTPUT.rglob("*.html")]
        cls.pages = [p for p in cls.all_pages if "refresh" not in p.meta]
        cls.sitemap = ET.parse(OUTPUT / "sitemap.xml")
        cls.urls = [loc.text for loc in cls.sitemap.findall(".//{*}loc")]

    def page(self, path):
        return Page(OUTPUT / path / "index.html")

    def test_canonical_metadata_and_dates(self):
        for page in self.pages:
            with self.subTest(path=page.path):
                self.assertEqual(len(page.canonical), 1)
                self.assertTrue(page.canonical[0].startswith(BASE))
                self.assertTrue(page.meta.get("description", "").strip())
                if "noindex" not in page.meta.get("robots", ""):
                    self.assertNotIn(page.meta["description"].strip().lower(), ["to do", "todo", "tbd"])
                self.assertEqual(page.meta["description"], page.meta["og:description"])
                for article in page.of_type("BlogPosting") + page.of_type("ScholarlyArticle"):
                    self.assertEqual(article["description"], page.meta["description"])
                self.assertNotIn("0001-", json.dumps(page.meta))
                self.assertNotIn("0001-", json.dumps(page.schemas))
                self.assertFalse(page.of_type("FAQPage"))

    def test_identity_is_consistent_on_home_and_biography(self):
        for path in ["", "about"]:
            people = [n for n in self.page(path).of_type("Person") if n.get("description")]
            self.assertEqual(len(people), 1)
            person = people[0]
            self.assertEqual(person["@id"], PERSON)
            self.assertEqual(person["jobTitle"], "Software Developer")
            self.assertIn("AI enthusiast", person["description"])
            self.assertIn("currently studies", person["description"])
            self.assertIn("planned to start in August 2027", person["description"])
            self.assertEqual(person["mainEntityOfPage"]["@id"], BASE + "about/#profilepage")
            self.assertNotIn("worksFor", person)
            self.assertNotIn("KTH", json.dumps(person["alumniOf"]))
            self.assertNotIn("ELTE", json.dumps(person["alumniOf"]))
        for page in self.pages:
            for node in walk(page.schemas):
                if node.get("@id") == PERSON and "@type" in node:
                    self.assertEqual(node["@type"], "Person", str(page.path))
                if node.get("@type") == "Person" and node.get("name") == "Simone Mattioli":
                    self.assertEqual(node.get("@id"), PERSON, str(page.path))

    def test_publication_retains_author_order_and_real_publisher(self):
        paper = self.page("blog/publications/llm-tourism-mobility-predictor").of_type("ScholarlyArticle")[0]
        self.assertEqual(paper["@id"], "https://doi.org/10.3390/bdcc10040117")
        self.assertEqual([a["name"] for a in paper["author"]], ["Anna Dalla Vecchia", "Simone Mattioli", "Sara Migliorini", "Elisa Quintarelli"])
        self.assertEqual(paper["author"][1]["@id"], PERSON)
        self.assertEqual(paper["publisher"], {"@type": "Organization", "name": "MDPI"})
        self.assertTrue(paper["datePublished"].startswith("2026-04-11"))
        self.assertNotIn("wordCount", paper)
        issue = paper["isPartOf"]
        self.assertEqual((issue["@type"], str(issue["issueNumber"])), ("PublicationIssue", "4"))
        volume = issue["isPartOf"]
        self.assertEqual((volume["@type"], str(volume["volumeNumber"])), ("PublicationVolume", "10"))
        self.assertEqual(volume["isPartOf"]["name"], "Big Data and Cognitive Computing")

    def test_project_stories_are_articles_and_portfolio_matches_visible_links(self):
        for page in self.pages:
            if "/blog/tech-projects/" in page.canonical[0]:
                self.assertFalse(page.of_type("SoftwareApplication"), str(page.path))
        self.assertEqual(len(self.page("blog/tech-projects/wealth-compass").of_type("BlogPosting")), 1)
        projects = self.page("projects")
        collection = projects.of_type("CollectionPage")[0]
        self.assertEqual(collection["author"]["@id"], PERSON)
        items = collection["mainEntity"]["itemListElement"]
        self.assertEqual(len(items), 8)
        self.assertEqual([i["position"] for i in items], list(range(1, 9)))
        for item in items:
            self.assertIn(item["url"], body(projects.html))
        for route in ["about", "projects", "links", "call", "passion/technology"]:
            page = self.page(route)
            self.assertEqual(page.meta["og:type"], "website")
            self.assertNotIn("article:published_time", page.meta)

    def test_sitemap_contains_only_indexable_generated_pages(self):
        self.assertEqual(len(self.urls), len(set(self.urls)))
        for url in self.urls:
            with self.subTest(url=url):
                self.assertTrue(url.startswith(BASE))
                path = local_file(url)
                self.assertTrue(path.exists(), str(path))
                page = Page(path)
                self.assertNotIn("noindex", page.meta.get("robots", ""))
                self.assertEqual(page.canonical, [url])
        for route in ["blog/experiences/budapest-collegio-don-mazza/", "blog/experiences/28-digital-master-school-kick-off-tallinn/"]:
            self.assertIn(BASE + route, self.urls)
        for route in ["blog/experiences/sicily/", "blog/experiences/crossing-a-countrys-border-walking/", "search/", "offline/"]:
            self.assertNotIn(BASE + route, self.urls)
            self.assertIn("noindex", self.page(route).meta["robots"])

    def test_local_metadata_images_exist(self):
        for page in self.pages:
            image_urls = [page.meta.get("og:image", "")]
            for node in walk(page.schemas):
                if node.get("@type") == "ImageObject":
                    image_urls.append(node.get("url", ""))
                if isinstance(node.get("image"), str):
                    image_urls.append(node["image"])
            for url in image_urls:
                if url.startswith(BASE):
                    self.assertTrue(local_file(url).is_file(), f"{page.path}: {url}")

    def test_llms_orientation_is_current_and_key_routes_resolve(self):
        text = (OUTPUT / "llms.txt").read_text()
        self.assertIn("AI enthusiast", text)
        self.assertIn("Current EIT Digital", text)
        self.assertIn("Identity facts reviewed: 2026-10-15", text)
        self.assertNotIn("has NOT yet begun", text)
        self.assertNotIn("Incoming EIT", text)
        self.assertIn(f"[Projects]({BASE}projects/)", text)
        # Only this repository's key pages; satellite sites are separate deployments.
        keys = text.split("## Key pages", 1)[1].split("## Research", 1)[0]
        for url in re.findall(r"\]\((https://[^)]+)\)", keys):
            self.assertTrue(local_file(url).is_file(), url)

    def test_search_crawlers_can_access_identity_and_work(self):
        robots = RobotFileParser()
        robots.parse((OUTPUT / "robots.txt").read_text().splitlines())
        for agent in ["Googlebot", "Bingbot", "OAI-SearchBot", "Claude-SearchBot", "PerplexityBot"]:
            for route in ["", "about/", "projects/", "blog/publications/", "links/"]:
                self.assertTrue(robots.can_fetch(agent, BASE + route), f"{agent}: {route}")
        for agent in ["Googlebot", "Bingbot", "OAI-SearchBot", "Claude-SearchBot", "PerplexityBot", "UnlistedCrawler"]:
            for route in ["admin/", "private/example", "searchindex.json"]:
                self.assertFalse(robots.can_fetch(agent, BASE + route), f"{agent}: {route}")
        self.assertIn(BASE + "sitemap.xml", robots.site_maps())

    def test_translations_have_reciprocal_languages_without_duplicate_canonicals(self):
        expected_pages = set()
        for stem in ["technology", "content-creation"]:
            expected = {"en": BASE + f"passion/{stem}/", "it": BASE + f"passion/{stem}_it/"}
            for code, url in expected.items():
                page = Page(local_file(url))
                expected_pages.add(page.path)
                self.assertEqual(page.alternates, expected)
                self.assertEqual(page.canonical, [url])
                self.assertEqual(page.lang, "it-IT" if code == "it" else "en-US")
                self.assertEqual(page.meta["og:locale"], page.lang.replace("-", "_"))
                self.assertEqual(page.meta["og:locale:alternate"], "en_US" if code == "it" else "it_IT")
                self.assertEqual(page.of_type("WebPage")[0]["inLanguage"], page.lang)
                self.assertNotIn("noindex", page.meta["robots"])
        self.assertEqual({p.path for p in self.pages if p.alternates}, expected_pages)

    def test_preview_metadata_uses_bounded_real_image_dimensions(self):
        checked = set()
        for page in self.pages:
            if "og:image:width" not in page.meta:
                continue
            url = page.meta["og:image"]
            path = local_file(url)
            expected = (int(page.meta["og:image:width"]), int(page.meta["og:image:height"]))
            self.assertEqual(jpeg_size(path), expected, str(page.path))
            self.assertLessEqual(max(expected), 1200)
            self.assertEqual(page.meta["twitter:image"], url)
            self.assertTrue(page.meta["og:image:alt"])
            for node in page.of_type("BlogPosting") + page.of_type("ScholarlyArticle"):
                self.assertEqual(node["image"]["url"], url)
                self.assertEqual((node["image"]["width"], node["image"]["height"]), expected)
            checked.add(url)
        self.assertGreater(len(checked), 40)

    def test_blog_card_loading_priority_is_local_to_each_render(self):
        for page in self.pages:
            if not page.card_images:
                continue
            route = page.path.relative_to(OUTPUT).as_posix()
            is_archive = route.startswith("blog/") and bool(page.of_type("CollectionPage") or page.of_type("Blog"))
            for index, images in enumerate(page.card_images):
                priority = is_archive and index < 3
                for attrs in images:
                    self.assertEqual(attrs.get("loading"), "eager" if priority else "lazy", f"{route} card {index}")
                    self.assertEqual(attrs.get("fetchpriority"), "high" if priority else None, f"{route} card {index}")

    def test_feeds_only_link_to_indexable_pages_and_have_valid_dates(self):
        feeds = list(OUTPUT.rglob("index.xml"))
        self.assertGreater(len(feeds), 200)
        for path in feeds:
            channel = ET.parse(path).find("channel")
            self.assertIsNotNone(channel, str(path))
            urls = []
            for item in channel.findall("item"):
                url = item.findtext("link")
                self.assertTrue(url and url.startswith(BASE), str(path))
                self.assertEqual(item.findtext("guid"), url)
                target = local_file(url)
                self.assertTrue(target.is_file(), f"{path}: {url}")
                self.assertNotIn("noindex", Page(target).meta["robots"], f"{path}: {url}")
                urls.append(url)
            self.assertEqual(len(urls), len(set(urls)), str(path))
            for node in channel.iter():
                if node.tag in ["pubDate", "lastBuildDate"]:
                    self.assertGreaterEqual(parsedate_to_datetime(node.text).year, 2000, str(path))
        blog_items = ET.parse(OUTPUT / "blog/index.xml").findall("channel/item")
        self.assertGreater(len(blog_items), 40)
        self.assertTrue(all("/blog/" in item.findtext("link") for item in blog_items))

    def test_aliases_resolve_directly_to_real_canonical_pages(self):
        redirects = [p for p in self.all_pages if "refresh" in p.meta]
        self.assertGreater(len(redirects), 0)
        for page in redirects:
            self.assertEqual(len(page.canonical), 1)
            target = local_file(page.canonical[0])
            self.assertTrue(target.is_file(), str(page.path))
            destination = Page(target)
            self.assertNotIn("refresh", destination.meta)
            self.assertEqual(destination.canonical, page.canonical)

    def test_paginated_archives_have_their_own_canonical_and_schema_urls(self):
        count = 0
        for page in self.pages:
            relative = page.path.relative_to(OUTPUT).as_posix()
            match = re.search(r"/page/(\d+)/index.html$", relative)
            if not match:
                continue
            count += 1
            expected = BASE + relative.removesuffix("index.html")
            self.assertEqual(page.canonical, [expected])
            self.assertEqual(page.meta["og:url"], expected)
            self.assertIn("Page " + match[1], page.meta["og:title"])
            web_pages = page.of_type("WebPage")
            self.assertEqual(len(web_pages), 1)
            self.assertEqual(web_pages[0]["@id"], expected + "#webpage")
            self.assertEqual(web_pages[0]["url"], expected)
            self.assertTrue(local_file(expected).exists())
        self.assertGreater(count, 0)
        self.assertEqual(self.page("blog").canonical, [BASE + "blog/"])
        self.assertEqual(self.page("blog/page/1").canonical, [BASE + "blog/"])

    def test_video_sitemap_and_schema_describe_real_embeds_consistently(self):
        records = json.loads(Path("data/videos.json").read_text())["items"]
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "v": "http://www.google.com/schemas/sitemap-video/1.1"}
        count = 0
        for url in self.sitemap.findall("s:url", ns):
            page = Page(local_file(url.findtext("s:loc", namespaces=ns)))
            schemas = {v["embedUrl"]: v for v in page.of_type("VideoObject")}
            sitemap_videos = url.findall("v:video", ns)
            self.assertEqual(len(sitemap_videos), len(schemas), str(page.path))
            for video in sitemap_videos:
                count += 1
                embed = video.findtext("v:player_loc", namespaces=ns)
                self.assertRegex(embed, r"^https://www\.youtube\.com/embed/[A-Za-z0-9_-]{11}$")
                self.assertIn(embed, page.html)
                record = records[embed.rsplit("/", 1)[1]]
                schema = schemas[embed]
                self.assertEqual(schema["name"], record["title"])
                self.assertEqual(schema["uploadDate"], record["upload_date"])
                self.assertEqual(video.findtext("v:title", namespaces=ns), schema["name"])
                self.assertEqual(video.findtext("v:description", namespaces=ns), schema["description"])
                self.assertEqual(video.findtext("v:publication_date", namespaces=ns), schema["uploadDate"])
                self.assertEqual(video.findtext("v:thumbnail_loc", namespaces=ns), schema["thumbnailUrl"])
                self.assertNotIn("contentUrl", schema)
        self.assertGreater(count, 0)
        for page in self.pages:
            for video in page.of_type("VideoObject"):
                self.assertIn(video["embedUrl"], page.html)
                self.assertNotIn("VIDEO_ID", video["embedUrl"])
                self.assertNotIn("videoseries", video["embedUrl"])
        # This article contains a code example, not a real embedded video.
        self.assertFalse(self.page("blog/tech-projects/youtube-video-localization-script").of_type("VideoObject"))
        # A playlist remains visible but is not represented as one video.
        self.assertFalse(self.page("blog/thoughts/the-star-counter").of_type("VideoObject"))

    @unittest.skipUnless(os.environ.get("SEO_BASELINE_DIR"), "Set SEO_BASELINE_DIR for before/after presentation checks")
    def test_visible_pages_styles_and_search_index_are_unchanged(self):
        baseline = Path(os.environ["SEO_BASELINE_DIR"])
        before_files = {p.relative_to(baseline) for p in baseline.rglob("*.html")}
        self.assertEqual(before_files, {p.relative_to(OUTPUT) for p in OUTPUT.rglob("*.html")})
        checked = 0
        for relative in before_files:
            old, new = Page(baseline / relative), Page(OUTPUT / relative)
            if body(old.html) is not None:
                checked += 1
                self.assertEqual(body(old.html), body(new.html), str(relative))
                self.assertEqual(old.styles, new.styles, str(relative))
        self.assertGreater(checked, 300)
        self.assertEqual((baseline / "searchindex.json").read_bytes(), (OUTPUT / "searchindex.json").read_bytes())


if __name__ == "__main__":
    unittest.main(verbosity=2)
