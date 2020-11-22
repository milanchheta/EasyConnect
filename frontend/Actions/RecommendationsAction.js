/**
 * Redux store action to store the recommendations in the store for future use.
 * @param {recommendations} recommendations Recommendations for each user profile.
 */
export const updateRecommendations = (recommendations) => ({
  type: "UPDATE_RECOMMENDATIONS_HOME",
  data: recommendations,
});
