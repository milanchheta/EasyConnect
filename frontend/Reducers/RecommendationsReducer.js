const initialState = {
  recommendations: null,
};

/**
 * Reducer to handle the actions dispatched during recommendations update for the profile.
 * @param {state} state present state of the redux store. If not present, falls back to the initial state.
 * @param {action} action action dispatched by the react component.
 */
const RecommendationsReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case "UPDATE_RECOMMENDATIONS_HOME":
      return {
        ...state,
        recommendations: action.data,
      };

    default:
      return state;
  }
};

export default RecommendationsReducer;
