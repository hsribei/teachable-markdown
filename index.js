import { Spinner } from "spin.js";

const spinner = new Spinner().spin();

// The current script tag is always the last script tag at the time
// of execution, so this is a way to get a reference to the current
// script tag's parent. cf: https://stackoverflow.com/a/10312824/
const thisScriptElement = document.scripts[document.scripts.length - 1];

const lectureContentElement = document.querySelector(".lecture-content");


const lectureAttachmentSpinnerElement = getOrCreateElementById(
  "lecture-attachment-spinner",
  "div",
  lectureContentElement
);
lectureAttachmentSpinnerElement.appendChild(spinner.el);

const isLocalhost = window.location.href.startsWith("http://localhost:");

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function attachCss() {
  const headTag = document.getElementsByTagName("head")[0];

  const styleTag = getOrCreateElementById(
    "html-embed-styling",
    "style",
    headTag
  );

  styleTag.type = "text/css";
  styleTag.innerHTML = `
      #html-embed-div figure {
        display: block;
        max-width: 80%;
        margin: auto;
        margin-block-start: 1em;
        margin-block-end: 1em;
      }

      #html-embed-div figcaption:before {
        content: "Caption: ";
      }

      #html-embed-div img {
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

function getOrCreateElementById(
  id,
  tag = "div",
  parentTag = lectureContentElement
) {
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement(tag);
    element.id = id;
    parentTag.appendChild(element);
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

function setup() {
  attachCss();
}

setup();

async function fetchHtmlEmbedContent() {
  const url = getUrl();
  const response = await fetch(url);
  const htmlEmbedContent = await response.text();
  return htmlEmbedContent;
}

(async function main() {
  try {
    const htmlEmbedContent = await fetchHtmlEmbedContent();
    // await sleep(5000);
    const htmlEmbedDiv = getOrCreateElementById("html-embed-div");
    htmlEmbedDiv.innerHTML = htmlEmbedContent;
  } catch (e) {
    console.error(e);
  } finally {
    spinner.stop();
  }
})();
