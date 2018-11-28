const unified = require("unified");
const markdown = require("remark-parse");
const remark2rehype = require("remark-rehype");
const format = require("rehype-format");
const html = require("rehype-stringify");
const raw = require("rehype-raw");

const md2html = unified()
  .use(markdown)
  .use(remark2rehype, { allowDangerousHTML: true })
  .use(raw)
  .use(format)
  .use(html).processSync;

const isLocalhost = window.location.href.startsWith("http://localhost:");

function renderMarkdown(markdownText) {
  const parentTag = document.querySelector(".lecture-content");

  let markdownDiv = document.getElementById("markdown");
  if (!markdownDiv) {
    markdownDiv = document.createElement("div");
    markdownDiv.id = "markdown";
    parentTag.appendChild(markdownDiv);

    const styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.innerHTML = `
      #markdown img {
        max-width: 100%;
      }
    `;
    document.getElementsByTagName("head")[0].appendChild(styleTag);
  }

  markdownDiv.innerHTML = String(md2html(markdownText));
}

function getUrl() {
  let url = "";

  if (isLocalhost) {
    url = "http://localhost:5000/full-gfm.md";
  } else {
    try {
      // const docTitle = "s01e02 - Third Lecture | test-school";
      const docTitle = document.title;
      const sectionDirectoryName = docTitle.match(/^(s\d+)e/)[1];
      const lectureFileName = encodeURIComponent(
        docTitle.split(/\s*\|\s*/)[0] + ".md"
      );
      url = `https://cdn.staticaly.com/gh/hsribei/content/master/teachable-gfm-markdown/${sectionDirectoryName}/${lectureFileName}?env=dev`;
    } catch (e) {
      console.log(
        "Couldn't parse document title into URL for markdown source:",
        {
          docTitle: document.title
        }
      );
      url =
        "https://cdn.staticaly.com/gh/hsribei/content/master/the-new-meat.md?env=dev";
    }
  }
  return url;
}

async function fetchAndRender() {
  const url = getUrl();
  const response = await fetch(url);
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
