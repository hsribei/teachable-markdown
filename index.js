const isLocalhost = window.location.href.startsWith("http://localhost:");

function renderHtml(htmlText) {
  const parentTag = document.querySelector(".lecture-content");

  let htmlDiv = document.getElementById("html");
  if (!htmlDiv) {
    htmlDiv = document.createElement("div");
    htmlDiv.id = "html";
    parentTag.appendChild(htmlDiv);

    const styleTag = document.createElement("style");
    styleTag.type = "text/css";
    styleTag.innerHTML = `
      #html figure {
        display: block;
        max-width: 80%;
        margin: auto;
        margin-block-start: 1em;
        margin-block-end: 1em;
      }

      #html figcaption:before {
        content: "Caption: ";
      }

      #html img {
        width: 100%;
      }
    `;
    document.getElementsByTagName("head")[0].appendChild(styleTag);
  }

  htmlDiv.innerHTML = htmlText;
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

async function fetchBody() {
  const url = getUrl();
  const response = await fetch(url);
  const body = await response.text();
  return body;
}

(async function main() {
  try {
    const body = await fetchBody();
    renderHtml(body);
  } catch (e) {
    console.error(e);
  }
})();
