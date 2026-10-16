import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const main = fs.readFileSync(new URL("../assets/js/main.js", import.meta.url), "utf8");
const gallery = fs.readFileSync(new URL("../assets/js/gallery-slider.js", import.meta.url), "utf8");

function environment(selectors = []) {
  const calls = { swiper: [], lightbox: [], events: [], toggled: [] };
  const menu = { addEventListener(type, callback) { calls.menuClick = callback; } };
  const document = {
    querySelector(selector) { return selectors.includes(selector) ? {} : null; },
    querySelectorAll(selector) {
      return selector === ".nav-dropdown > .nav-link" ? [menu] : [];
    },
    getElementsByClassName(name) { return selectors.includes(`.${name}`) ? [{}] : []; },
  };
  const context = {
    document, screen: { height: 900 },
    window: { addEventListener(...args) { calls.events.push(args); } },
    Swiper: function (...args) { calls.swiper.push(args); },
    GLightbox(...args) { calls.lightbox.push(args); },
  };
  return { calls, context };
}

test("navigation initializes with both optional libraries absent", () => {
  const { calls, context } = environment();
  delete context.Swiper;
  delete context.GLightbox;
  vm.runInNewContext(main, context);
  calls.menuClick({ target: { closest() { return { classList: { toggle(name) { calls.toggled.push(name); } } }; } } });
  assert.deepEqual(calls.toggled, ["active"]);
});

test("optional libraries are not initialized without matching markup", () => {
  const { calls, context } = environment();
  vm.runInNewContext(main, context);
  vm.runInNewContext(gallery, context);
  assert.equal(calls.swiper.length, 0);
  assert.equal(calls.lightbox.length, 0);
  assert.equal(calls.events.length, 0);
});

test("lightbox initializes exactly once across main and gallery scripts", () => {
  const { calls, context } = environment([".glightbox"]);
  vm.runInNewContext(main, context);
  vm.runInNewContext(gallery, context);
  assert.equal(calls.lightbox.length, 1);
  assert.equal(calls.lightbox[0][0].selector, ".glightbox");
  assert.equal(calls.lightbox[0][0].touchNavigation, true);
});

test("testimonial and gallery sliders retain their existing configuration", () => {
  const { calls, context } = environment([".testimonial-slider", ".gallery-slider"]);
  vm.runInNewContext(main, context);
  vm.runInNewContext(gallery, context);
  assert.deepEqual(calls.swiper.map(([selector]) => selector), [".testimonial-slider", ".gallery-slider"]);
  assert.equal(calls.swiper[0][1].autoplay.delay, 5000);
  assert.equal(calls.swiper[1][1].autoHeight, true);
  assert.equal(calls.swiper[1][1].speed, 1500);
});

test("gallery layout works without lightbox or slider dependencies", () => {
  const { calls, context } = environment();
  delete context.Swiper;
  delete context.GLightbox;
  const image = { naturalWidth: 800, naturalHeight: 400, style: {} };
  const item = { style: {}, querySelector() { return image; } };
  context.window.innerHeight = 900;
  context.window.innerWidth = 1200;
  context.document.querySelectorAll = () => [{
    getBoundingClientRect() { return { top: 100, left: 100, bottom: 400, right: 600 }; },
    querySelectorAll() { return [item]; },
  }];
  vm.runInNewContext(gallery, context);
  assert.equal(item.style.width, "450px");
  assert.equal(image.style.opacity, 1);
  assert.deepEqual(calls.events.map(([type]) => type), ["scroll", "load"]);
  assert.equal(calls.events[0][2].passive, true);
});
