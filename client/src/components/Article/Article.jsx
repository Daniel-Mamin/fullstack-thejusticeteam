import React, {useState, useCallback, useContext, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "react-loader-spinner";
import axios from "axios";
import moment from "moment"

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./Article.scss";
import noPhoto from "../../assets/img/noPhoto.png";
import views from "../../assets/img/views.svg";
import AuthContext from "../../context/AuthContext";


const Article = () => {
  const {token} = useContext(AuthContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState({});
  const [user, setUser] = useState({});

  const fetchArticle = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/article/${id}`, {
        headers: {
          "Authorization": `${token}`
        }
      });
      setArticle(response.data);
      setUser(response.data.user);
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return (
    <article className="article">
      {
        loading
          ? (
            <Loader
              className="loader"
              type="TailSpin"
              color="#282828"
              height={250}
              width={250}
            />
          ) : (
            <div className="container">
              <div className="article__wrapper">
                <Link to="/">
                  <div className="article__btn">
                    <button>All articles</button>
                  </div>
                </Link>
                <div className="article-content">
                  <div className="article-content__tag">
                    <span className="tag">{article.tag}</span>
                  </div>
                  <div className="article-content__title">
                    <h1>{article.title}</h1>
                  </div>
                  <div className="article-content__img">
                    <img src={`../${article.image}`} alt="Image" />
                  </div>
                  <div className="article-content__description">
                    <p dangerouslySetInnerHTML={{ __html: article.description }} />
                  </div>
                  <div className="article-content__info">
                    <div className="article-content__info-user">
                      <img className="user-avatar" src={!!user.avatar ? user.avatar : noPhoto} alt="user-avatar" />
                      <span className="user-name">{`${user.f_name} ${user.l_name}`}</span>
                      <div className="user-info">
                        <span>{moment(article.date).format("MMM DD")} · 5 min read</span>
                      </div>
                      <div className="user-views">
                        <img src={views} alt="ViewsLogo" />
                        <span>{article.count}</span>
                      </div>
                    </div>
                    <div className="article-content__info-category">{article.category}</div>
                  </div>
                </div>
              </div>
            </div>
          )
      }

    </article>
  );
};

export default Article;
