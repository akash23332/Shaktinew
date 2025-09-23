import Navigation from "../components/Navbar";
import Footer from "../components/Footer";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { searchData } from "../searchData";

const useQuery = () => new URLSearchParams(useLocation().search);

const Search = () => {
  const query = useQuery();
  const term = (query.get('q') || '').trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return [];
    return searchData
      .map((item) => {
        const hay = (item.title + ' ' + item.content).toLowerCase();
        const score = hay.includes(term) ? 1 : 0;
        return { ...item, score };
      })
      .filter((r) => r.score > 0);
  }, [term]);

  return (
    <div className="min-h-screen services-page">
      <Navigation />
      <main className="profile-container">
        <section className="profile-card">
          <h1 className="profile-title">Search</h1>
          <p style={{marginBottom: '0.75rem'}}>Results for: <strong>{term || '—'}</strong></p>
          {term && results.length === 0 && (
            <p>No results found.</p>
          )}
          <ul style={{listStyle:'none', padding:0, margin:0, display:'grid', gap:'0.6rem'}}>
            {results.map((r, i) => (
              <li key={i} className="contact-card" style={{padding:'0.75rem'}}>
                <a href={r.path} style={{textDecoration:'none', color:'#e2e8f0'}}>
                  <div style={{fontWeight:700}}>{r.title}</div>
                  <div style={{opacity:0.85}}>{r.content}</div>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Search;


