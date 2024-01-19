document.addEventListener('DOMContentLoaded', function () {

  const displayElement = document.getElementById("data");
  
  fetch('data.json')
    .then(response => response.json())
    .then(data => {

      data.forEach(item => {
        const {date, title, para, highlightWords, link, linkText} = item

        const dateHtml = date ? `<h3>${date}</h3>` : '';
        const titleHtml = title ? title : '';
        
        const linkUrlHtml = link ? link : '';
        const linkTextHtml = linkText ? linkText : '';
        const truncatedLinkText = linkTextHtml.length > 20 ? linkTextHtml.slice(0, 20) + '...' : linkTextHtml;

        const paraHtml = para ? para : '';
        const highlightWordsHtml = highlightWords ? highlightWords : '';
        let paraSpan = paraHtml;

        if (paraHtml && highlightWordsHtml) {
          const wordsArray = highlightWordsHtml.split(/\s+/);  // Split the words into an array
          wordsArray.forEach(word => {
            if (word && paraSpan.includes(word)) {
              const ctaHtml = ` <span>${word}</span>`;
              paraSpan = paraSpan.replace(new RegExp(word, 'ig'), ctaHtml);  // 'ig' for case-insensitive global match
            }
          });
        }

        paraSpan = paraSpan || paraHtml;


        displayElement.innerHTML += `<div>
          ${dateHtml}
          <a href="${linkUrlHtml}" target="_blank">${truncatedLinkText}</a>
          <h2>${titleHtml}</h2>
          <p>${paraSpan}</p>
        </div>`;
      });
    })
    .catch(error => console.error('Error fetching data:', error));
});





