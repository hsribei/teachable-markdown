const unified = require("unified");
const markdown = require("remark-parse");
const remark2rehype = require("remark-rehype");
const format = require("rehype-format");
const html = require("rehype-stringify");

const md2html = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(format)
  .use(html).processSync;

function renderMarkdown(markdownText) {
  // The current script tag is always the last script tag at the time
  // of execution, so this is a way to get a reference to the current
  // script tag's parent. cf: https://stackoverflow.com/a/10312824/
  const scriptTag = document.scripts[document.scripts.length - 1];
  const parentTag = scriptTag.parentNode;

  let markdownDiv = document.getElementById("markdown");
  if (!markdownDiv) {
    markdownDiv = document.createElement("div");
    markdownDiv.id = "markdown";
    parentTag.appendChild(markdownDiv);
  }

  markdownDiv.innerHTML = String(md2html(markdownText));
}

async function fetchAndRender() {
  const response = await fetch(
    "https://cdn.staticaly.com/gh/unifiedjs/unified/master/readme.md"
  );
  const markdownText = await response.text();
  renderMarkdown(markdownText);
}

(async function main() {
  try {
    await fetchAndRender();
  } catch (e) {
    console.error(e);
  }
})();
