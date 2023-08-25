import '../styles/globals.css';

export default function RootLayout({ children }: any) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Live Chat - Connect and converse with our real-time browser chat experience.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="shortcut icon" href="../favicon.png" type="image/x-icon" />
      </head>

      <body>
        {children}
      </body>
    </html>
  );
}
