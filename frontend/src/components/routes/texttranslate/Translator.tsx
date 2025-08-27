import React, { useState, ChangeEvent } from "react";
import "./Translator.css";
import { Dropdown } from "react-bootstrap";
import profileImage from "../../../assets/images/grag.png";
import { User } from "../../../types";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../../constants";
import { set } from "zod";

// Type definitions
interface Language {
  code: string;
  name: string;
}

const Translator: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [userAvatar, setUserAvatar] = useState<string>("/default-avatar.jpg");
  const [outputText, setOutputText] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("ja");

  const storedUser = localStorage.getItem("user");
  if (storedUser) setUser(JSON.parse(storedUser));

  // Languages list
  const languages: Language[] = [
    { code: "en", name: "English" },
    { code: "ja", name: "Japanese" },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setInputText(e.target.value);
  };

  const handleSourceLanguageChange = (
    e: ChangeEvent<HTMLSelectElement>
  ): void => {
    setSourceLanguage(e.target.value);
  };

  const handleTargetLanguageChange = (
    e: ChangeEvent<HTMLSelectElement>
  ): void => {
    setTargetLanguage(e.target.value);
  };

  const handleTranslate = async (): Promise<void> => {
    // This is just a placeholder for the actual translation
    // In a real app, this would call an API
    setIsLoading(true);
    setError(null);
    try {
      const translatePayload = {
        text: inputText,
        target: targetLanguage,
      };

      const response = await fetch(`${BACKEND_URL}/api/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(translatePayload),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to translate");
      }
      const translatedText = data.data || "Translation failed";
      console.log(translatedText);
      setOutputText(translatedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "translate failed");
      console.error("Translation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = (): void => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(outputText);
  };

  const clearText = (): void => {
    setInputText("");
    setOutputText("");
  };

  const handleSignOut = (): void => {
    console.log("Sign out clicked");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleSettings = (): void => {
    console.log("Settings clicked");
    navigate("/settings");
  };

  // Custom toggle component for the avatar
  const CustomToggle = React.forwardRef<HTMLDivElement, any>(
    ({ children, onClick }, ref) => (
      <div
        ref={ref}
        onClick={onClick}
        className="profile-avatar"
        style={{ cursor: "pointer" }}
      >
        {children}
      </div>
    )
  );

  return (
    <div className="translator-container">
      <header className="translator-header">
        <div className="header-content">
          <h1>Text Translator</h1>
          <p>Translate between multiple languages</p>
        </div>

        {/* Profile Dropdown */}
        <div className="profile-dropdown-container">
          <Dropdown>
            <Dropdown.Toggle
              as={CustomToggle}
              id="dropdown-custom-components"
            ></Dropdown.Toggle>

            <Dropdown.Menu align="end" className="profile-dropdown-menu">
              <Dropdown.Item
                onClick={handleSettings}
                className="dropdown-item-custom"
              >
                <i className="fas fa-cog dropdown-icon"></i>
                Settings
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={handleSignOut}
                className="dropdown-item-custom"
              >
                <i className="fas fa-sign-out-alt dropdown-icon"></i>
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      <div className="language-selector">
        <div className="language-selection">
          <label htmlFor="source-language">From:</label>
          <select
            id="source-language"
            value={sourceLanguage}
            onChange={handleSourceLanguageChange}
          >
            {languages.map((lang) => (
              <option key={`source-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="swap-btn"
          onClick={swapLanguages}
          aria-label="Swap languages"
        >
          ⇄
        </button>

        <div className="language-selection">
          <label htmlFor="target-language">To:</label>
          <select
            id="target-language"
            value={targetLanguage}
            onChange={handleTargetLanguageChange}
          >
            {languages.map((lang) => (
              <option key={`target-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="translation-area">
        <div className="text-box">
          <textarea
            aria-label="Source text"
            placeholder="Enter text to translate"
            value={inputText}
            onChange={handleInputChange}
          />
          <div className="char-count">{inputText.length} characters</div>
        </div>

        <div className="text-box">
          <textarea
            aria-label="Translated text"
            placeholder="Translation"
            value={outputText}
            readOnly
          />
          <button
            className="copy-btn"
            onClick={copyToClipboard}
            disabled={!outputText}
            aria-label="Copy translation"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="controls">
        <button
          className="translate-btn"
          onClick={handleTranslate}
          disabled={!inputText.trim()}
        >
          Translate
        </button>
        <button
          className="clear-btn"
          onClick={clearText}
          disabled={!inputText && !outputText}
        >
          Clear
        </button>
      </div>

      <footer className="translator-footer">
        <p>
          This is a demo translator interface. Connect to a translation API for
          actual translations.
        </p>
      </footer>
    </div>
  );
};

export default Translator;
function useUser(): [any] {
  throw new Error("Function not implemented.");
}
