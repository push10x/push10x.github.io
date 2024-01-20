document.addEventListener('DOMContentLoaded', function () {
  const displayElement = document.getElementById("resultsContainer");
  const searchInput = document.getElementById('searchInput');

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const displayResults = (results) => {
        displayElement.innerHTML = '';

        if (results.length === 0) {
          displayElement.innerHTML = '<p class="noresults">No results found.</p>';
        } else {
          results.forEach(result => {
            const { date, link, linkText, title, para, paraLink, paraLinkWord, highlightWords } = result;
            const dateHtml = date ? `<h3>${date}</h3>` : '';
            const titleHtml = title ? title : '';

            function addHttps(x) {
              if (!x.includes("http://") && !x.includes("https://")) {
                return `https://${x}`;
              } else {
                return x.replace(/^http:\/\//, 'https://');
              }
            }

            const linkUrlHtml = link ? addHttps(link) : '';
            const linkTextHtml = linkText ? linkText : '';
            const truncatedLinkText = linkTextHtml.length > 20 ? linkTextHtml.slice(0, 20) + '...' : linkTextHtml;

            const paraHtml = para ? para : '';
            const paraLinkUrlHtml = paraLink ? addHttps(paraLink) : '';
            const paraLinkWordHtml = paraLinkWord ? paraLinkWord : '';
            const highlightWordsHtml = highlightWords ? highlightWords : '';

            let paraSpan = paraHtml;

            if (paraHtml && (highlightWordsHtml || paraLinkWordHtml)) {
              const wordsArray = (highlightWordsHtml + ' ' + paraLinkWordHtml).split(/\s+/);
              wordsArray.forEach(word => {
                if (word && paraSpan.includes(word)) {
                  if (word === paraLinkWordHtml) {
                    const ctaHtml = ` <a href="${paraLinkUrlHtml}" target="_blank">${word}</a>`;
                    paraSpan = paraSpan.replace(new RegExp(word, 'ig'), ctaHtml);
                  } else {
                    const ctaHtml = ` <span class="highlight">${word}</span>`;
                    paraSpan = paraSpan.replace(new RegExp(word, 'ig'), ctaHtml);
                  }
                }
              });
            }

            paraSpan = paraSpan || paraHtml;

            displayElement.innerHTML += `<div id="outer" class="outer">
              <div class="content">
                <div class="data">
                ${dateHtml}
                <a href="${linkUrlHtml}" target="_blank">${truncatedLinkText}</a>
                <h2>${titleHtml}</h2>
                <p>${paraSpan}</p>
              </div>
            </div>
          </div>`;
          });
        }
        applyTheme(isDarkTheme);
      };

      // Initial display of all data
      displayResults(data);

      // Add event listener for the search input
      searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const results = data.filter(item => {
          return (
            item.date.toLowerCase().includes(searchTerm) ||
            item.link.toLowerCase().includes(searchTerm) ||
            item.linkText.toLowerCase().includes(searchTerm) ||
            item.title.toLowerCase().includes(searchTerm) ||
            item.para.toLowerCase().includes(searchTerm) ||
            item.paraLink.toLowerCase().includes(searchTerm) ||
            item.paraLinkWord.toLowerCase().includes(searchTerm) ||
            item.highlightWords.toLowerCase().includes(searchTerm)
          );
        });
        displayResults(results);
      });
    })
    .catch(error => console.error('Error fetching data:', error));

  // 
  // 
  // Change background page colour
  let isDarkTheme = false;
  const body = document.body;
  const themeBtn = document.getElementById('theme');
  const outerElements = document.getElementsByClassName('outer');
  const contentElements = document.getElementsByClassName('content');
  const spanHighightElements = document.getElementsByClassName('highlight');
  
  updateThemeIcon("moon"); // show moon svg onload

  themeBtn.addEventListener("click", () => {
    isDarkTheme = !isDarkTheme;
    applyTheme(isDarkTheme);
  });

  function applyTheme(isDarkTheme){
    body.style.backgroundColor = isDarkTheme ? "#064056" : "#f64056";

    const minLength = Math.max(outerElements.length, contentElements.length, spanHighightElements.length);

    for (let i = 0; i < minLength; i++) {
      const outer = outerElements[i];
      const content = contentElements[i];
      const highlight = spanHighightElements[i];

      if (outer) {
        outer.style.backgroundColor = isDarkTheme ? "#064056" : "#f64056";
      }

      if (content) {
        content.style.backgroundColor = isDarkTheme ? "rgba(160, 64, 86, .3)" : "rgba(255, 0, 0, .3)";
      }

      if (highlight) {
        highlight.style.backgroundColor = isDarkTheme ? "#fefd00" : "#111";
        highlight.style.color = isDarkTheme ? "#111" : "#f64056";
      }
    }

    searchInput.style.backgroundColor = isDarkTheme ? "#fff" : "#111";
    searchInput.style.color = isDarkTheme ? "#111" : "#fff";

    const themeIcon = isDarkTheme ? "sun" : "moon";
    updateThemeIcon(themeIcon);
  } 

  function updateThemeIcon(icon) {
    const themeIconSVG = `
      <svg class="theme-${icon}-svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
        ${icon === 'sun' ? '<path d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"/>' : ''}
        ${icon === 'moon' ? '<path d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"/>' : ''}
      </svg>`;

    themeBtn.innerHTML = themeIconSVG;
}

//
//
//
});