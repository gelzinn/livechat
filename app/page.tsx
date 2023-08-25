import { GitHubLogo, GoogleLogo } from "./components/Logos/OtherBrands";

const Homepage = () => {
  return (
    <div className="lg:grid lg:grid-cols-2 max-lg:grid-rows-[minmax(84px,_100px)_1fr] items-center justify-center h-screen w-screen overflow-hidden">
      <section className="relative flex items-center justify-center gap-4 w-full lg:h-full bg-zinc-950 lg:py-4 px-4 py-6">
        <div className="flex lg:flex-col items-center justify-center gap-4 z-[1] h-full w-full">
          <i className="text-3xl lg:text-8xl not-italic">💬</i>
          <h1 className="text-2xl lg:text-5xl font-bold">Live Chat</h1>
          <p className="text-center hidden lg:block">Connect and converse with our real-time browser chat experience.</p>
        </div>
        <div className="absolute z-0 flex items-center justify-center w-full h-full overflow-hidden">
          <i className="text-[800px] not-italic skew-x-3 skew-y-12 rotate-6 opacity-[1%] select-none pointer-events-none">💬</i>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center gap-4 bg-zinc-100 w-full h-full">
        <form className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center gap-4 p-8 w-full max-w-2xl h-full text-zinc-900">
            <header>
              <h3 className="text-2xl sm:text-4xl text-center font-medium">Entre na sua conta</h3>
            </header>
            <section className="flex flex-col items-start justify-center gap-4 w-full">
              <div className="flex flex-col items-start justify-center gap-2 w-full">
                <label htmlFor="email">E-mail</label>
                <div
                  className="p-4 flex items-center justify-center gap-2 border border-black rounded-lg text-black w-full bg-transparent"
                >
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="fulano@email.com"
                    className="bg-transparent w-full h-full outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start justify-center gap-2 w-full">
                <label htmlFor="password">Senha</label>
                <div
                  className="p-4 flex items-center justify-center gap-2 border border-black rounded-lg text-black w-full bg-transparent"
                >
                  <input
                    type="text"
                    name="password"
                    id="password"
                    placeholder="*********"
                    className="bg-transparent w-full h-full outline-none"
                  />
                </div>
              </div>
            </section>
            <footer className="sm:grid sm:grid-cols-2 flex flex-col-reverse items-center justify-center gap-4 w-full">
              <a
                className="py-3 px-8 flex items-center justify-center gap-2 border border-black bg-black text-white rounded-lg w-full"
                href=""
              >
                Criar Conta
              </a>
              <a
                className="py-3 px-8 flex items-center justify-center gap-2 border border-black rounded-lg text-black w-full"
                href=""
              >
                Entrar
              </a>
            </footer>
            <div className="relative inline-flex items-center justify-center w-full">
              <hr className="w-full h-px my-8 bg-zinc-500 border-0" />
              <span className="absolute px-3 font-medium text-zinc-500 -translate-x-1/2 bg-zinc-100 left-1/2">
                ou
              </span>
            </div>
            <footer className="flex flex-col items-center justify-center gap-4 w-full">
              <div className="sm:grid sm:grid-cols-2 flex flex-col-reverse items-center justify-center gap-4 w-full">
                <button className="w-full flex items-center justify-center gap-4 bg-red-600 hover:bg-red-500 text-white p-4 rounded-lg">
                  <GoogleLogo className="fill-white w-6 h-6" />
                  <p>Entre com <strong>Google</strong></p>
                </button>
                <button className="w-full flex items-center justify-center gap-4 bg-zinc-950 hover:bg-zinc-800 text-white p-4 rounded-lg">
                  <GitHubLogo className="fill-white w-6 h-6" />
                  <p>Entre com <strong>GitHub</strong></p>
                </button>
              </div>
              <a
                className="text-zinc-500 hover:underline"
                href=""
              >
                Entrar como Anônimo
              </a>
            </footer>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Homepage;
