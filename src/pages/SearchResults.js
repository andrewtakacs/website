import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './SearchResults.css';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const query = searchParams.get('q');

  useEffect(() => {
    // This is where you would implement your actual search logic
    // For now, we'll just show a placeholder
    if (query) {
      // Simulate search results
      const mockResults = [
        { title: 'About Me', content: 'Information about Andrew Takacs...', link: '/about' },
        { title: 'Projects', content: 'View my portfolio projects...', link: '/projects' },
        { title: 'Contact', content: 'Get in touch with me...', link: '/contact' },
      ].filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.content.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(mockResults);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="search-results">
      <h1>Search Results for "{query}"</h1>
      {results.length > 0 ? (
        <div className="results-list">
          {results.map((result, index) => (
            <div key={index} className="result-item">
              <h2>{result.title}</h2>
              <p>{result.content}</p>
              <a href={result.link} className="result-link">View More</a>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No results found for "{query}"</p>
      )}
    </div>
  );
}

export default SearchResults; 