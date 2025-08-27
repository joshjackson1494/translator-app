// App.tsx JOSHUA JACKSON
import React from "react";
import Translator from "./components/routes/texttranslate/Translator";
import LoginScreen from "./components/routes/login/LoginScreen";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/text" element={<Translator />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
