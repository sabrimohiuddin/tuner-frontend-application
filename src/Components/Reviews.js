import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Review from "./Review";
import ReviewForm from "./ReviewForm";

const API = process.env.REACT_APP_API_URL;

function Reviews() {
  const [reviews, setReviews] = useState(null);
  let { id } = useParams();

  const handleAdd = (newReview) => {
    axios
      .post(`${API}/songs/${id}/reviews`, newReview)
      .then((response) => {
        setReviews([response.data, ...reviews]);
      })
      .catch((c) => console.warn("catch", c));
  };

  const handleDelete = (reviewId) => {
    axios
      .delete(`${API}/songs/${id}/reviews/${reviewId}`)
      .then((response) => {
        const copyReviewArray = [...reviews];
        const indexDeletedReview = copyReviewArray.findIndex((review) => {
          return review.id === reviewId;
        });
        copyReviewArray.splice(indexDeletedReview, 1);
        setReviews(copyReviewArray);
      })
      .catch((c) => console.warn("catch", c));
  };

  const handleEdit = (updatedReview) => {
    axios
      .put(`${API}/songs/${id}/reviews/${updatedReview.id}`, updatedReview)
      .then((response) => {
        const copyReviewArray = [...reviews];
        const indexUpdatedReview = copyReviewArray.findIndex((review) => {
          return review.id === updatedReview.id;
        });
        copyReviewArray[indexUpdatedReview] = response.data;
        setReviews(copyReviewArray);
      })
      .catch((c) => console.warn("catch", c));
  };

  useEffect(() => {
    axios.get(`${API}/songs/${id}/reviews`).then((response) => {
      if (Array.isArray(response.data)) {
        setReviews(response.data);
      } else {
        console.warn("Response data is not an array:", response.data);
      }
    });
  }, [id, API]);

  return (
    <section className="Reviews">
      <h2>Reviews</h2>
      <ReviewForm handleSubmit={handleAdd}>
        <h3>Add a New Review</h3>
      </ReviewForm>
      {reviews && reviews.map((review) => (
        <Review
          key={review.id}
          review={review}
          handleSubmit={handleEdit}
          handleDelete={handleDelete}
        />
      ))}
    </section>
  );
}

export default Reviews;
