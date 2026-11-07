import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <div className="app">
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </div>
  );
}

export default App;