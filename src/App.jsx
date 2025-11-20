import React, { useState, useCallback } from 'react';
import SearchInput from './components/SearchInput';
import SearchResults from './components/SearchResults';
import { searchArxiv } from './api/arxiv';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState('');
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const handleSearch = async (newQuery) => {
    setQuery(newQuery);
    setStart(0);
    setResults([]);
    setHasMore(true);
    setHasSearched(true);
    setLoading(true);
    setError(null);

    try {
      const papers = await searchArxiv(newQuery, 0, 10);
      setResults(papers);
      if (papers.length < 10) setHasMore(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextStart = start + 10;
    try {
      const papers = await searchArxiv(query, nextStart, 10);
      setResults(prev => [...prev, ...papers]);
      setStart(nextStart);
      if (papers.length < 10) setHasMore(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [query, start, loading, hasMore]);

  return (
    <div className={`app-container ${hasSearched ? 'has-searched' : ''}`}>
      <header className="app-header">
        <div className="logo">
          <span className="logo-arxiv">Simple Arxiv</span>
          <span className="logo-search">Search</span>
        </div>
        <div className="search-wrapper">
          <SearchInput onSearch={handleSearch} initialQuery={query} />
        </div>
      </header>

      <main className="app-main">
        <SearchResults
          results={results}
          loading={loading}
          error={error}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </main>

      {!hasSearched && (
        <footer className="app-footer">
          <p>Search specifically for academic papers from Arxiv.org</p>
        </footer>
      )}
    </div>
  );
}

export default App;
