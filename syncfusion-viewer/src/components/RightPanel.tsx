export default function RightPanel({
  searchText,
  setSearchText,
  hitCount,
  results,
  onSearch,
  onResultClick,
}: any) {
  return (
    <div className="right-panel">

      <h2>Find</h2>

      <input
        className="search-input"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search text"
      />

      <button
        className="search-btn"
        onClick={onSearch}
      >
        Search
      </button>

      <div className="hit-count">
        {hitCount} hits
      </div>

      <div className="results-container">
        {results.map((result: any) => (
          <button
            key={result.id}
            className="result-card"
            onClick={() => onResultClick(result)}
          >
            <div className="page-number">
              Page {result.pageNumber}
            </div>

            <div className="title">
              {result.title}
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}