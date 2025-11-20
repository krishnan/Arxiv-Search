import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/query', async (req, res) => {
    try {
        const { search_query, start, max_results } = req.query;
        console.log(`Fetching from Arxiv: ${search_query}, start: ${start}`);

        const response = await axios.get('http://export.arxiv.org/api/query', {
            params: {
                search_query,
                start,
                max_results
            }
        });

        res.set('Content-Type', 'application/xml');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching from Arxiv:', error.message);
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
