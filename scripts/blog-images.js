const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const manifest = require("./blog-images.json");
const rejected = require("./rejected-images.json");
const ROOT = path.resolve(__dirname, "..");
const ORIGIN = "https://gomarketing.net.au";

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)]
    .map(([, name, , value]) => [name.toLowerCase(), value.replace(/&amp;/g, "&")]));
}

function localPath(value, page) {
  if (!value) return null;
  const url = new URL(value, `${ORIGIN}/${page}`);
  return url.origin === ORIGIN ? decodeURIComponent(url.pathname) : null;
}

function checkUnique(entries, readAsset) {
  const errors = [];
  const used = { path: new Map(), source: new Map(), bytes: new Map() };
  for (const [article, item] of Object.entries(entries)) {
    const image = localPath(item.image, "index.html");
    if (!image?.startsWith("/images/insights/") || !item.sourceId) {
      errors.push(`${article}: local blog image and sourceId are required`);
      continue;
    }
    let bytes;
    try { bytes = readAsset(image); } catch { errors.push(`${article}: missing asset ${image}`); continue; }
    if (rejected.some((rule) => rule.sourceId === item.sourceId || image.includes(rule.pathMarker)
      || createHash("sha256").update(bytes).digest("hex") === rule.sha256)) {
      errors.push(`${article}: owner-rejected image must not be reused`);
    }
    for (const [kind, key] of Object.entries({ path: image, source: item.sourceId, bytes: createHash("sha256").update(bytes).digest("hex") })) {
      if (used[kind].has(key)) errors.push(`${article}: duplicate ${kind} with ${used[kind].get(key)}`);
      else used[kind].set(key, article);
    }
    if (image.startsWith("/images/insights/editorial/")) {
      if (bytes.length > 250 * 1024) errors.push(`${article}: editorial image exceeds 250 KB`);
      if (!item.source?.startsWith("https://") || !item.photographer || !item.alt?.en || !item.alt?.zh) {
        errors.push(`${article}: source, photographer and bilingual alt text are required`);
      }
    }
    if (image.startsWith("/images/insights/generated/")) {
      if (bytes.length > 250 * 1024) errors.push(`${article}: generated image exceeds 250 KB`);
      if (item.generated !== true || !item.provenance || !item.alt?.en || !item.alt?.zh) {
        errors.push(`${article}: generated artwork requires provenance and bilingual illustrative alt text`);
      }
    }
  }
  return errors;
}

function checkRejectedImages(page, html, readAsset, rules = rejected) {
  const references = new Set();
  for (const [tag] of html.matchAll(/<(?:img|source|meta|link)\b[^>]*>/gi)) {
    const attrs = attributes(tag);
    if (attrs.src) references.add(attrs.src);
    for (const srcset of [attrs.srcset, attrs.imagesrcset].filter(Boolean)) {
      for (const candidate of srcset.split(",")) references.add(candidate.trim().split(/\s+/)[0]);
    }
    if (/^(og:image(?::url|:secure_url)?|twitter:image(?::src)?)$/.test(attrs.property || attrs.name || "")) references.add(attrs.content);
    if (attrs.as === "image" && attrs.href) references.add(attrs.href);
  }
  function collect(node, imageContext = false) {
    if (typeof node === "string" && imageContext) references.add(node);
    else if (Array.isArray(node)) node.forEach((item) => collect(item, imageContext));
    else if (node && typeof node === "object") {
      const isImage = imageContext || [].concat(node["@type"]).includes("ImageObject");
      for (const [key, value] of Object.entries(node)) {
        collect(value, /^(image|logo|thumbnailUrl|contentUrl)$/.test(key) || (isImage && key === "url"));
      }
    }
  }
  for (const [, json] of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) collect(JSON.parse(json));
  const errors = [];
  for (const reference of references) {
    if (!reference) continue;
    let url;
    try { url = new URL(reference, `${ORIGIN}/${page}`); } catch { continue; }
    const pathname = decodeURIComponent(url.pathname);
    let digest;
    if (url.origin === ORIGIN && pathname.startsWith("/images/") && readAsset) {
      try { digest = createHash("sha256").update(readAsset(pathname)).digest("hex"); } catch { /* Missing assets are checked by the site audit. */ }
    }
    if (rules.some((rule) => pathname.includes(rule.pathMarker) || digest === rule.sha256)) {
      errors.push(`${page}: owner-rejected image reference ${reference}`);
    }
  }
  return errors;
}

function checkPage(page, html, entries) {
  const errors = [];
  const article = /^(?:services|cn)\/([^/]+\.html)$/.exec(page)?.[1];
  const isArticle = /class=["']article-meta["']/.test(html);
  const entry = entries[article];
  if (isArticle && !entry) errors.push(`${page}: article is not registered in blog-images.json`);
  if (entry && !isArticle) errors.push(`${page}: registered article has no article-meta`);
  if (isArticle && entry) {
    const cover = html.match(/<div\b[^>]*class=["']image-wrapper["'][^>]*>\s*(<img\b[^>]*>)/i)?.[1];
    if (!cover || localPath(attributes(cover).src, page) !== entry.image) errors.push(`${page}: cover does not match manifest`);
    const alt = entry.alt?.[page.startsWith("cn/") ? "zh" : "en"];
    if (!attributes(cover || "").alt || (alt && attributes(cover).alt !== alt)) errors.push(`${page}: missing or stale cover alt text`);
    for (const property of ["og:image", "twitter:image"]) {
      const meta = [...html.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag))
        .find((attrs) => attrs.property === property || attrs.name === property);
      if (meta?.content !== `${ORIGIN}${entry.image}`) errors.push(`${page}: stale ${property}`);
    }
    const nodes = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
      .flatMap(([, json]) => { const data = JSON.parse(json); return data["@graph"] || [data]; });
    const blog = nodes.find((node) => [].concat(node["@type"]).includes("BlogPosting"));
    if (blog?.image !== `${ORIGIN}${entry.image}`) errors.push(`${page}: stale BlogPosting image`);
    const webPage = nodes.find((node) => [].concat(node["@type"]).includes("WebPage"));
    if (webPage?.image !== `${ORIGIN}${entry.image}`) errors.push(`${page}: stale WebPage image`);
  }
  // Check actual article links, not broad substitutions of a shared photo URL.
  for (const [anchor, opening, content] of html.matchAll(/(<a\b[^>]*>)([\s\S]*?)<\/a>/gi)) {
    const target = localPath(attributes(opening).href, page);
    const targetArticle = /^\/(?:services|cn)\/([^/]+\.html)$/.exec(target || "")?.[1];
    const targetEntry = entries[targetArticle];
    if (!targetEntry) continue;
    for (const [image] of content.matchAll(/<img\b[^>]*>/gi)) {
      if (localPath(attributes(image).src, page) !== targetEntry.image) errors.push(`${page}: stale thumbnail for ${targetArticle}`);
      const alt = targetEntry.alt?.[page.startsWith("cn/") ? "zh" : "en"];
      if (alt && attributes(image).alt !== alt) errors.push(`${page}: stale thumbnail alt for ${targetArticle}`);
    }
  }
  return errors;
}

function audit(root = ROOT, entries = manifest) {
  const assets = new Map();
  const readAsset = (name) => {
    if (!assets.has(name)) assets.set(name, fs.readFileSync(path.join(root, name)));
    return assets.get(name);
  };
  const errors = checkUnique(entries, readAsset);
  const pages = ["index.html", ...["services", "cn"].flatMap((dir) => fs.readdirSync(path.join(root, dir))
    .filter((name) => name.endsWith(".html")).map((name) => `${dir}/${name}`))];
  for (const page of pages) {
    const html = fs.readFileSync(path.join(root, page), "utf8");
    errors.push(...checkPage(page, html, entries), ...checkRejectedImages(page, html, readAsset));
  }
  for (const article of Object.keys(entries)) {
    for (const lang of ["services", "cn"]) {
      if (!pages.includes(`${lang}/${article}`)) errors.push(`${lang}/${article}: missing article translation`);
    }
  }
  return errors;
}

if (require.main === module) {
  const errors = audit();
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
  else console.log(`Blog images passed: ${Object.keys(manifest).length} unique article covers, translations, thumbnails and metadata.`);
}

module.exports = { attributes, localPath, checkUnique, checkPage, checkRejectedImages, audit };
