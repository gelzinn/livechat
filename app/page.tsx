'use client'

import { FormEvent, useState } from "react";
import { GitHubLogo, GoogleLogo } from "./components/Logos/OtherBrands";
import { UserSignUp } from "./@types/User";
import { isValidUsername } from "./helpers/testers/isValidUsername";
import { isValidEmail } from "./helpers/testers/isValidEmail";
import Icon from "./components/Icon";

const Homepage = () => {
  const [tab, setTab] = useState<"login" | "register">("register");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserSignUp>({
    username: "",
    email: "",
    password: "",
  });

  const handleTabChange = (tab: "login" | "register") => {
    setTab(tab ? tab : "register")
    handleResetInputs();
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleResetInputs = () => {
    const inputs = document.querySelectorAll("input");

    setFormData({
      username: "",
      email: "",
      password: "",
    });

    inputs.forEach(input => input.value = "");
  }

  const handleCheckInputs = () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      alert("Please, fill all the inputs.");
      return;
    };

    if (username.length < 4 || username.length > 16 || !isValidUsername(username)) {
      alert("Invalid username.");
      return;
    };

    if (email.length < 4 || email.length > 64 || !isValidEmail(email)) {
      alert("Invalid email.");
      return;
    };

    if (password.length < 8 || password.length > 64) {
      alert("Invalid password.");
      return;
    };
  }

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleCheckInputs();
  }

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleCheckInputs();
  }

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
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center p-8 w-full max-w-2xl h-full text-zinc-900">
            <form
              className="flex flex-col items-center justify-center gap-4 w-full h-auto"
              onSubmit={(e: FormEvent) => e.preventDefault()}
            >
              <header>
                <h3 className="text-2xl sm:text-3xl text-center font-medium">
                  {tab === "login" ? "Entre na sua conta" : "Crie uma conta"}
                </h3>
              </header>
              {tab === "register" && (
                <div className="flex flex-col items-start justify-center gap-2 w-full">
                  <label htmlFor="username">Usuário</label>
                  <div className="flex items-center justify-center border border-black rounded-lg text-black w-full bg-transparent overflow-hidden">
                    <span
                      className="flex items-center justify-center pointer-events-none select-none min-w-[56px] w-auto h-full p-4 border-r border-black bg-zinc-200 rounded-s-md"
                    >
                      @
                    </span>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="fulano"
                      className="bg-transparent w-full h-full outline-none p-4"
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col items-start justify-center gap-2 w-full">
                <label htmlFor="email">E-mail</label>
                <div className="flex items-center justify-center gap-2 border border-black rounded-lg text-black w-full bg-transparent overflow-hidden">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="fulano@email.com"
                    className="bg-transparent w-full h-full outline-none p-4"
                    onChange={handleChangeInput}
                  />
                </div>
              </div>
              <div className="flex flex-col items-start justify-center gap-2 w-full">
                <label htmlFor="password">Senha</label>
                <div className="flex items-center justify-center border border-black rounded-lg text-black w-full bg-transparent overflow-hidden">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="*********"
                    className="bg-transparent w-full h-full outline-none p-4"
                    onChange={handleChangeInput}
                  />
                  <button
                    className="flex items-center justify-center select-none min-w-[56px] w-auto h-full p-4 border-l border-black bg-zinc-200 rounded-e-md cursor-pointer transition ease-in-out duration-250 hover:bg-zinc-300"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <Icon
                      icon={isPasswordVisible ? "EyeSlash" : "Eye"}
                      size={20}
                      className="group-hover:text-white text-brand-blue-600-75 transition ease-in-out duration-250 pointer-events-none select-none"
                    />
                  </button>
                </div>
              </div>
              <footer className="flex items-center justify-center gap-4 w-full">
                <button
                  className="mt-2 py-4 px-8 flex items-center justify-center gap-2 border border-black bg-zinc-950 text-white rounded-lg w-full h-auto max-h-[56px] hover:bg-zinc-900 duration-300"
                  onClick={(e: any) => {
                    if (tab === "login") {
                      handleSignIn(e);
                    } else {
                      handleSignUp(e);
                    }
                  }}
                >
                  {tab === "login" ? "Entrar" : "Criar conta"}
                </button>
              </footer>
              <p
                className="text-zinc-500 cursor-pointer hover:underline"
                onClick={() => handleTabChange(tab === "login" ? "register" : "login")}
              >
                {tab === "login" ? "Não tem uma conta? Crie uma!" : "Já tem uma conta? Entre!"}
              </p>
            </form>
            <div className="relative inline-flex items-center justify-center w-full">
              <hr className="w-full h-px my-8 bg-zinc-500 border-0" />
              <span className="absolute px-3 font-medium text-zinc-500 -translate-x-1/2 bg-zinc-100 left-1/2">
                ou
              </span>
            </div>
            <footer className="flex flex-col items-center justify-center gap-4 w-full">
              <div className="sm:grid sm:grid-cols-2 flex flex-col-reverse items-center justify-center gap-4 w-full">
                <button className="group w-full flex items-center justify-center gap-4 border border-red-600 hover:bg-red-600 text-red-600 hover:text-white p-4 rounded-lg duration-300">
                  <GoogleLogo
                    className="fill-red-600 group-hover:fill-white duration-300 w-6 h-6"
                    removeDefaultClasses
                  />
                  <p>Entre com <strong>Google</strong></p>
                </button>
                <button className="group w-full flex items-center justify-center gap-4 border border-zinc-950 hover:bg-zinc-950 text-zinc-950 hover:text-white p-4 rounded-lg duration-300">
                  <GitHubLogo
                    className="fill-zinc-950 group-hover:fill-white duration-300 w-6 h-6"
                    removeDefaultClasses
                  />
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
        </div>
      </section>
    </div>
  );
};

export default Homepage;
