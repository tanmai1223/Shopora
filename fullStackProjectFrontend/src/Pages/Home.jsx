import Header from "../Components/Header";
import Category from "../Components/Category";
import Cards from "../Components/Cards";

import style from "../Styles/HomePage.module.css";

import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;


function Home() {

  const token = localStorage.getItem("token");


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

  const selectedCategory = category
    ? decodeURIComponent(category)
    : "All";


  // -------------------------------
  // SEARCH
  // -------------------------------

  const handleSearch = async (keyword) => {

    try {

      // Empty search
      if (!keyword) {

        setSearchResults(null);
        setSearchKeyword("");

        return;
      }


      //console.log("Searching for:", keyword);


      const response = await axios.get(
        `${API_URL}/api/products/search`,
        {
          params: {
            keyWord: keyword
          }, headers: {
              Authorization: `Bearer ${token}`,
            },
        }
      );


     // console.log("Search results:", response.data);


      // Store search results
      setSearchResults(response.data);

      // Store searched word
      setSearchKeyword(keyword);


    } catch (error) {

      console.log(
        "Search error:",
        error
      );

      setSearchResults([]);

      setSearchKeyword(keyword);

    }
  };


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

      <Header
        onSearch={handleSearch}
      />


      <Category
        onCategoryChange={handleCategoryChange}
      />


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

        <Cards
          category={selectedCategory}
          searchResults={searchResults}
        />

      </main>

    </div>
  );
}

export default Home;