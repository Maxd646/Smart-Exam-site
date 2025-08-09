import { Provider } from "react-redux";
import { store } from "./store";

const ReduxStateProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
export default ReduxStateProvider;
