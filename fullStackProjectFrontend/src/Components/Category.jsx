import { useEffect, useState } from "react";

import {
  NavLink
} from "react-router-dom";

import axios from "axios";

import style from "../Styles/Category.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBars
} from "@fortawesome/free-solid-svg-icons";


const API_URL = import.meta.env.VITE_API_URL;


function Category({ onCategoryChange }) {

  const [categories, setCategories] = useState([]);
   const token = localStorage.getItem("token");
  

  // -------------------------------
  // FETCH CATEGORIES
  // -------------------------------

  useEffect(() => {

    const fetchCategories = async () => {
    
      try {

        const response = await axios.get(
          `${API_URL}/api/products/categories`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCategories(response.data);

      } catch (error) {

        console.log(
          "Category fetch error:",
          error
        );

      }

    };


    fetchCategories();

  }, []);


  return (

    <div className={style.categoryBar}>

      {/* ALL */}

      <NavLink
        to="/home"
        onClick={() => onCategoryChange?.()}
        className={({ isActive }) =>
          isActive
            ? `${style.category} ${style.active}`
            : style.category
        }
      >

        <FontAwesomeIcon icon={faBars} />

        <span>All</span>

      </NavLink>


      {/* CATEGORIES */}

      {categories.map((category) => (

        <NavLink
          key={category}
          to={`/category/${encodeURIComponent(category)}`}
          onClick={() => onCategoryChange?.()}
          className={({ isActive }) =>
            isActive
              ? `${style.category} ${style.active}`
              : style.category
          }
        >

          {category}

        </NavLink>

      ))}

    </div>

  );
}


export default Category;