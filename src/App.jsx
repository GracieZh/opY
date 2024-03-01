import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { Intro, Island } from "./pages";

const App = () => {
  return (
    <main>
      <Router>
        <Routes>
          <Route path='/' element={<Intro />} />
          <Route path='/*' element={
              <>
                <Routes>
                  <Route path='/island' element={<Island />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
