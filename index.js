import { Spinner } from "spin.js";

const isLocalhost = window.location.href.startsWith("http://localhost:");

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function attachCss() {
  const headElement = document.getElementsByTagName("head")[0];
  const styleElement = getOrCreateElementById("embedded-html-styling", "style");
  headElement.appendChild(styleElement);

  styleElement.type = "text/css";
  styleElement.innerHTML = `
      #embedded-html-root {
        min-height: 100px;
      }

      #embedded-html-content figure {
        display: block;
        max-width: 80%;
        margin: auto;
        margin-block-start: 1em;
        margin-block-end: 1em;
      }

      #embedded-html-content figcaption:before {
        content: "Caption: ";
      }

      #embedded-html-content img {
        width: 100%;
      }

      /* FIXME pasted ./node_modules/spin.js/spin.css because I */
      /* couldn't figure out how to import it with Parcel */
      @keyframes spinner-line-fade-more {
        0%, 100% {
          opacity: 0; /* minimum opacity */
        }
        1% {
          opacity: 1;
        }
      }

      @keyframes spinner-line-fade-quick {
        0%, 39%, 100% {
          opacity: 0.25; /* minimum opacity */
        }
        40% {
          opacity: 1;
        }
      }

      @keyframes spinner-line-fade-default {
        0%, 100% {
          opacity: 0.22; /* minimum opacity */
        }
        1% {
          opacity: 1;
        }
      }

    `;
}

function getOrCreateElementById(id, tag = "div") {
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement(tag);
    element.id = id;
  }
  return element;
}

function getUrl() {
  let url = "";

  if (isLocalhost) {
    url = "http://localhost:5000/full-html.html";
  } else {
    try {
      // const docTitle = "s01e02 - Third Lecture | test-school";
      const docTitle = document.title;
      const sectionDirectoryName = docTitle.match(/^(s\d+)e/)[1];
      const lectureFileName = encodeURIComponent(
        docTitle.split(/\s*\|\s*/)[0] + ".html"
      );
      url = `https://cdn.staticaly.com/gh/hsribei/content/master/teachable-html/${sectionDirectoryName}/${lectureFileName}?env=dev`;
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

function main() {
  attachCss();
  const embeddedHtmlRootElement = getOrCreateElementById("embedded-html-root");

  const lectureContentElement = document.querySelector(".lecture-content");
  const videos = document.querySelectorAll(".lecture-attachment-type-video");
  if (videos.length === 2) {
    lectureContentElement.insertBefore(embeddedHtmlRootElement, videos[1]);
  } else {
    lectureContentElement.appendChild(embeddedHtmlRootElement);
  }

  // position: relative is necessary for spinner to center correctly
  embeddedHtmlRootElement.style.position = "relative";
  embeddedHtmlRootElement.appendChild(spinner.el);

  const embeddedHtmlContentElement = getOrCreateElementById(
    "embedded-html-content"
  );
  embeddedHtmlRootElement.appendChild(embeddedHtmlContentElement);

  fetchAndRenderInto(embeddedHtmlContentElement);
}

async function fetchEmbeddedHtmlContent() {
  const url = getUrl();
  const response = await fetch(url);
  const embeddedHtmlContent = await response.text();
  return embeddedHtmlContent;
}

async function fetchAndRenderInto(embeddedHtmlContentElement) {
  try {
    const embeddedHtmlContent = await fetchEmbeddedHtmlContent();
    // await sleep(5000);
    embeddedHtmlContentElement.innerHTML = embeddedHtmlContent;
  } catch (e) {
    console.error(e);
  } finally {
    spinner.stop();
  }
}

const spinner = new Spinner().spin();
document.addEventListener("DOMContentLoaded", main);
