import Header from "../Components/Header";
import Category from "../Components/Category";
import Cards from "../Components/Cards";

import style from "../Styles/HomePage.module.css";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const token = localStorage.getItem("token");

  const location = useLocation();
  const navigate = useNavigate();
  const { category } = useParams();

  const [searchResults, setSearchResults] = useState(null);

  // Store what the user searched for
  const [searchKeyword, setSearchKeyword] = useState("");

  /*
    If URL is:

    /
        -> All

    /category/Laptops
        -> Laptops
  */

  const selectedCategory = category ? decodeURIComponent(category) : "All";

  // -------------------------------
  // SEARCH
  // -------------------------------

 const handleSearch = useCallback(async (keyword) => {
  const trimmedKeyword = keyword?.trim();

  if (!trimmedKeyword) {
    setSearchResults(null);
    setSearchKeyword("");
    return;
  }

  try {
    const response = await axios.get(
      `${API_URL}/api/products/search`,
      {
        params: {
          keyWord: trimmedKeyword,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSearchResults(response.data);
    setSearchKeyword(trimmedKeyword);
  } catch (error) {
    console.error("Search error:", error);

    setSearchResults([]);
    setSearchKeyword(trimmedKeyword);
  }
}, [token]);

useEffect(() => {
  const keyword = location.state?.searchKeyword;

  if (!keyword) return;

  const processSearch = async () => {
    await handleSearch(keyword);

    // Clear the navigation state after processing the search
    navigate("/home", {
      replace: true,
      state: null,
    });
  };

  processSearch();
}, [location.state, handleSearch, navigate]);

  /*
    When user clicks a category,
    remove search results.
  */

  const handleCategoryChange = () => {
    setSearchResults(null);

    setSearchKeyword("");
  };

  return (
    <div className={style.homePage}>
      <Header/>

      <Category onCategoryChange={handleCategoryChange} />

      <main className={style.productSection}>
        {/* Heading */}

        <h2>
          {searchResults !== null
            ? `Search results for "${searchKeyword}"`
            : selectedCategory === "All"
              ? "All Products"
              : selectedCategory}
        </h2>

        {/* Products */}

        <Cards category={selectedCategory} searchResults={searchResults} />
      </main>
    </div>
  );
}

export default Home;
