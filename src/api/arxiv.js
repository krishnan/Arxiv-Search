import axios from 'axios';

const ARXIV_API_URL = 'http://localhost:3001/api/query';

export const searchArxiv = async (query, start = 0, maxResults = 10) => {
  try {
    const response = await axios.get(ARXIV_API_URL, {
      params: {
        search_query: `all:${query}`,
        start: start,
        max_results: maxResults,
      },
    });

    // Parse XML response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');
    const entries = xmlDoc.getElementsByTagName('entry');

    const papers = Array.from(entries).map((entry) => {
      const title = entry.getElementsByTagName('title')[0]?.textContent.trim();
      const summary = entry.getElementsByTagName('summary')[0]?.textContent.trim();
      const published = entry.getElementsByTagName('published')[0]?.textContent;
      const authors = Array.from(entry.getElementsByTagName('author')).map(
        (author) => author.getElementsByTagName('name')[0]?.textContent
      );
      const link = entry.getElementsByTagName('id')[0]?.textContent;
      const pdfLink = Array.from(entry.getElementsByTagName('link')).find(
        (l) => l.getAttribute('title') === 'pdf'
      )?.getAttribute('href');

      return {
        title,
        summary,
        published,
        authors,
        link,
        pdfLink,
      };
    });

    return papers;
  } catch (error) {
    console.error('Error fetching from Arxiv:', error);
    throw error;
  }
};
