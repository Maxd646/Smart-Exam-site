import { store } from "./store";
import { Provider } from "react-redux";

const ReduxStateProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
export default ReduxStateProvider;
