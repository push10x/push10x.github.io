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
                        const ctaHtml = ` <span>${word}</span>`;
                        paraSpan = paraSpan.replace(new RegExp(word, 'ig'), ctaHtml);
                      }
                    }
                  });
                }

                paraSpan = paraSpan || paraHtml;

                displayElement.innerHTML += `<div class="outer">
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
    });