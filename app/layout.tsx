import { AuthContextProvider } from './contexts/AuthContext';

import '../styles/globals.css';
import { DocumentSizeContextProvider } from './contexts/DocumentSizeContext';

export default function RootLayout({ children }: any) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Live Chat - Connect and converse with real-time chat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="shortcut icon" href="../favicon.png" type="image/x-icon" />
      </head>

      <DocumentSizeContextProvider>
        <AuthContextProvider>
          <body className="bg-zinc-950">
            {children}
          </body>
        </AuthContextProvider>
      </DocumentSizeContextProvider>
    </html>
  );
}
