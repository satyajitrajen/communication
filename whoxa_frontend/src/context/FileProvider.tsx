import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context value
interface FileContextType {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

// Create the context with a default value of undefined
const FileContext = createContext<FileContextType | undefined>(undefined);

// Hook to access the context
export const useFile = (): FileContextType => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFile must be used within a FileProvider");
  }
  return context;
};

// Define the type for the provider's children prop
interface FileProviderProps {
  children: ReactNode;
}

// Provider component
export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
      {children}
    </FileContext.Provider>
  );
};
