'use client'

import { DocumentSizeContext } from "app/contexts/DocumentSizeContext";
import { useContext } from "react";

export const useDocumentSize = () => {
  const {
    documentSize,
    isMobile
  } = useContext(DocumentSizeContext);

  const documentWidth = documentSize.width;
  const documentHeight = documentSize.height;

  return {
    documentSize,
    documentWidth,
    documentHeight,
    isMobile
  };
}
