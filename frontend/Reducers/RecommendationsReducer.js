const initialState = {
  recommendations: [],
};

const RecommendationsReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case "UPDATE_RECOMMENDATIONS_HOME":
      return {
        ...state,
        recommendations: [action.data],
      };

    default:
      return state;
  }
};

export default RecommendationsReducer;
