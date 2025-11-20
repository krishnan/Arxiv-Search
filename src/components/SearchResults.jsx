import React, { useEffect, useRef } from 'react';
import { FileText } from 'lucide-react';

const SearchResults = ({ results, loading, error, onLoadMore, hasMore }) => {
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    onLoadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [onLoadMore, hasMore]);

    if (error && results.length === 0) {
        return (
            <div className="results-container">
                <div className="error-message">
                    <p>Something went wrong. Please try again.</p>
                    <p className="error-details">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!results || (results.length === 0 && !loading)) {
        return null;
    }

    return (
        <div className="results-container">
            {results.length > 0 && (
                <p className="results-count">Showing {results.length} papers</p>
            )}

            {results.map((paper, index) => (
                <div key={`${paper.link}-${index}`} className="result-item">
                    <div className="result-header">
                        <a href={paper.link} target="_blank" rel="noopener noreferrer" className="result-title">
                            {paper.title}
                        </a>
                        <a href={paper.pdfLink || paper.link} target="_blank" rel="noopener noreferrer" className="pdf-link">
                            <FileText size={14} /> PDF
                        </a>
                    </div>
                    <div className="result-meta">
                        <span className="authors">{paper.authors.join(', ')}</span>
                        <span className="separator">•</span>
                        <span className="published">{new Date(paper.published).toLocaleDateString()}</span>
                    </div>
                    <p className="result-summary">
                        {paper.summary.length > 300 ? paper.summary.substring(0, 300) + '...' : paper.summary}
                    </p>
                </div>
            ))}

            {/* Sentinel for infinite scroll */}
            {hasMore && (
                <div ref={observerTarget} className="loading-sentinel" style={{ height: '20px', margin: '20px 0' }}>
                    {loading && (
                        <div className="loading-skeleton">
                            <div className="skeleton-item">
                                <div className="skeleton-title"></div>
                                <div className="skeleton-text"></div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!hasMore && results.length > 0 && (
                <p className="end-of-results" style={{ textAlign: 'center', color: '#5f6368', margin: '20px 0' }}>
                    No more results
                </p>
            )}
        </div>
    );
};

export default SearchResults;
