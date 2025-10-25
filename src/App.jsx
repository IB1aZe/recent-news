import { useEffect, useState, useCallback } from "react";
import { fetchNews } from "./api";
import "./App.css";

export default function App() {
  const [newsList, setNewsList] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [queryParam, setQueryParam] = useState("");
  const [currentPage, setCurentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(totalResults / 20);

  const categories = [
    { id: "all", label: "All news" },
    { id: "business", label: "Business" },
    { id: "technology", label: "Technology" },
    { id: "sports", label: "Sports" },
    { id: "health", label: "Health" },
    { id: "entertainment", label: "Entertainment" },
    { id: "science", label: "Science" },
  ];

  const getNews = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchNews({
      category: selectedCat,
      q: queryParam,
      page: currentPage,
    });
    setNewsList(data.articles || []);
    setTotalResults(data.totalResults || 0);
    setIsLoading(false);
  }, [selectedCat, queryParam, currentPage]);

  useEffect(() => {
    getNews();
  }, [getNews]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurentPage(1);
    getNews();
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>World News</h1>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search news..."
            value={queryParam}
            onChange={(e) => setQueryParam(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={selectedCat === cat.id ? "active" : ""}
              onClick={() => {
                setSelectedCat(cat.id);
                setCurentPage(1);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div className="news-list">
            {newsList.length > 0 ? (
              newsList.map((article, i) => (
                <div key={i} className="news-card">
                  {article.urlToImage && (
                    <img src={article.urlToImage} alt={article.title} />
                  )}
                  <div className="news-content">
                    <h2>{article.title}</h2>
                    <p>{article.description}</p>
                    <a href={article.url} target="_blank" rel="noreferrer">
                      Read more
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">News didn't found</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurentPage((p) => p - 1)}
              >
                Prev
              </button>
              <span>
                Page {currentPage} in {totalPages || 1}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
