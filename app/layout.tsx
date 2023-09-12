import { AuthContextProvider } from './contexts/AuthContext';
import { DocumentSizeContextProvider } from './contexts/DocumentSizeContext';
import { UserAgentContextProvider } from './contexts/UserAgentContext';

import '../styles/globals.css';

export default function RootLayout({ children }: any) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Live Chat - Connect and converse with real-time chat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="shortcut icon" href="../favicon.png" type="image/x-icon" />

        <meta name="theme-color" content="#080808" />
        <meta name="description" content="Connect and converse with real-time chat" />
        <meta name="keywords" content="chat, live chat, chat online, chat app, chat application" />

        <meta property="og:title" content="Live Chat - Connect and converse with real-time chat" />
        <meta property="og:description" content="Connect and converse with real-time chat" />
        <meta property="og:image" content="https://timechat.vercel.app/og-image.png" />
        <meta property="og:url" content="https://timechat.vercel.app" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Live Chat - Connect and converse with real-time chat" />
        <meta name="twitter:description" content="Connect and converse with real-time chat" />
        <meta name="twitter:image" content="https://timechat.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>

      <UserAgentContextProvider>
        <DocumentSizeContextProvider>
          <AuthContextProvider>
            <body className="bg-zinc-950">
              {children}
            </body>
          </AuthContextProvider>
        </DocumentSizeContextProvider>
      </UserAgentContextProvider>
    </html>
  );
}
