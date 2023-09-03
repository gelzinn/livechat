'use client'

import { FormEvent, useEffect, useState } from "react";
import { UserSignUp } from "./@types/User";

import { useAuth } from "./hooks/useAuth";

import { userValidationSchema } from "./helpers/validators/schemas/userValidationSchema";
import { calculatePasswordStrength } from "./utils/calculatePasswordStrength";

import Icon from "@/components/Icon";
import { GitHubLogo, GoogleLogo } from "@/components/Logos/OtherBrands";

import { useRouter } from "next/navigation";
import { db } from "./services/firebase";
import { checkUsernameExists } from "./helpers/validators/checkers/checkUsernameExists";
import { checkEmailExists } from "./helpers/validators/checkers/checkEmailExists";

const Homepage = () => {
  const { signUp, signInWithProvider, user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<"login" | "register">("register");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserSignUp>({
    username: "",
    email: "",
    password: "",
  });
  const [formStatus, setFormStatus] = useState<any>({
    errors: [],
    isValid: false,
  });

  const handleTabChange = (tab: "login" | "register") => setTab(tab ? tab : "register");

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedErrors = { ...formStatus.errors };
    delete updatedErrors[name];

    setFormStatus({
      errors: updatedErrors,
      isValid: false,
    });

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

    setFormStatus({
      errors: [],
      isValid: false,
    });

    inputs.forEach(input => input.value = "");
  }

  const handleCheckInputs = () => {
    try {
      setFormStatus({
        errors: [],
        isValid: false,
      });

      userValidationSchema.parse(formData);

      setFormStatus({
        errors: [],
        isValid: true,
      });
    } catch (error: any) {
      const errors = error.errors.reduce((acc: Record<string, string[]>, err: { path: string[]; message: string }) => {
        acc[err.path[0]] = [...(acc[err.path[0]] || []), err.message];
        return acc;
      }, {});

      setFormStatus({ errors, isValid: false });
    }
  }

  const handleSignIn = async (provider: "email" | "google" | "github") => {
    try {
      setLoading(true);

      switch (provider) {
        default:
        case "email":
          handleCheckInputs();

          if (formStatus.isValid) {
            await db.collection('users').get().then((snapshot: any) => {
              snapshot.docs.map((doc: any) => doc.data()).find((user: any) => user.email === formData.email);
            }).then((user: any) => {
              if (user) signInWithProvider("email", formData.email, formData.password);
            });
          };
          break;
        case "google":
          signInWithProvider("google");
          break;
        case "github":
          signInWithProvider("github");
          break;
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      handleCheckInputs();

      if (formStatus.errors.length > 0) return;

      const isUsernameTaken = await checkUsernameExists(formData.username);
      const isEmailTaken = await checkEmailExists(formData.email);

      if (isUsernameTaken) throw new Error("Username is already taken.");
      if (isEmailTaken) throw new Error("Email is already taken.");

      signUp(formData.username, formData.email, formData.password);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) router.push("/chat");
  }, [user]);

  return (
    <main className="lg:grid lg:grid-cols-2 flex flex-col items-center justify-center lg:h-screen w-screen overflow-hidden">
      <section className="relative flex items-center justify-center gap-4 w-full lg:h-full bg-zinc-950 lg:py-4 px-4 py-6">
        <div className="flex lg:flex-col items-center justify-center gap-4 z-[1] h-full w-full max-w-lg">
          <i className="text-3xl lg:text-8xl not-italic">💬</i>
          <h1 className="text-2xl lg:text-5xl font-bold">
            Live Chat
          </h1>
          <p className="text-center hidden lg:block">
            Connect and converse with our real-time browser chat experience.
          </p>
        </div>
        <div className="absolute z-0 flex items-center justify-center w-full h-full overflow-hidden">
          <i className="text-[800px] not-italic skew-x-3 skew-y-12 rotate-6 opacity-[1%] select-none pointer-events-none">💬</i>
        </div>
      </section>
      <section className="flex flex-col items-center lg:justify-center gap-4 bg-zinc-100 w-full lg:h-full max-lg:h-[calc(100vh-84px)] overflow-y-auto">
        <div className="flex items-center justify-center w-full max-lg:h-full overflow-y-auto">
          <div className="flex flex-col items-center justify-start lg:p-8 p-4 w-full max-w-2xl h-full text-zinc-900 lg:overflow-y-auto">
            <form
              className="flex flex-col items-center justify-center gap-4 w-full h-auto"
              onSubmit={(e: FormEvent) => e.preventDefault()}
            >
              <header>
                <h3 className="text-2xl sm:text-3xl text-center font-medium">
                  {tab === "login" ?
                    "Welcome back" :
                    "Create an account"
                  }
                </h3>
              </header>
              {tab === "register" && (
                <div className="flex flex-col items-start justify-center gap-2 w-full">
                  <label htmlFor="username">Username</label>
                  <div className="flex items-center justify-center border border-black rounded text-black w-full bg-transparent overflow-hidden">
                    <span
                      className="flex items-center justify-center pointer-events-none select-none min-w-[56px] w-auto h-full p-4 border-r border-black bg-zinc-200 rounded-s"
                    >
                      @
                    </span>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="johndoe"
                      className="bg-transparent w-full h-full outline-none p-4"
                      onChange={handleChangeInput}
                    />
                  </div>
                  {formStatus.errors && formStatus.errors.username && (
                    <div>
                      {formData.username.length < 1 ? (
                        <p className="text-red-600">Username is required.</p>
                      ) : (
                        formStatus.errors.username.map((err: string, index: number) => (
                          <p key={index} className="text-red-600">{err}</p>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-col items-start justify-center gap-2 w-full">
                <label htmlFor="email">Email</label>
                <div className="flex items-center justify-center gap-2 border border-black rounded text-black w-full bg-transparent overflow-hidden">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email@domain.com"
                    className="bg-transparent w-full h-full outline-none p-4"
                    onChange={handleChangeInput}
                  />
                </div>
                {formStatus.errors && formStatus.errors.email && (
                  <div>
                    {formData.email.length < 1 ? (
                      <p className="text-red-600">Email is required.</p>
                    ) : (
                      formStatus.errors.email.map((err: string, index: number) => (
                        <p key={index} className="text-red-600">{err}</p>
                      ))
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start justify-center gap-2 w-full">
                <label htmlFor="password">Password</label>
                <div className="relative flex items-center justify-center border border-black rounded text-black w-full bg-transparent overflow-hidden">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder={isPasswordVisible ? "LiveChatIsAwasome123!" : "*********************"}
                    className="bg-transparent w-full h-full outline-none p-4"
                    onChange={handleChangeInput}
                  />
                  {tab === "register" && (
                    <hr className={`absolute duration-500 left-0 bottom-0 h-[3px] bg-red-500 border-0`} style={{
                      width: `calc(${calculatePasswordStrength(formData.password)}% - 56px)`,
                      backgroundColor: calculatePasswordStrength(formData.password) <= 20 ?
                        "red" : calculatePasswordStrength(formData.password) < 40 ?
                          "orange" : calculatePasswordStrength(formData.password) < 60 ?
                            "yellowgreen" : calculatePasswordStrength(formData.password) < 80 ?
                              "green" : "limegreen"
                    }} />
                  )}
                  <button
                    className="flex items-center justify-center select-none min-w-[56px] w-auto h-full p-4 border-l border-black bg-zinc-200 rounded-e cursor-pointer transition ease-in-out duration-250 hover:bg-zinc-300"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <Icon
                      icon={isPasswordVisible ? "EyeSlash" : "Eye"}
                      size={20}
                      className="group-hover:text-white text-brand-blue-600-75 transition ease-in-out duration-250 pointer-events-none select-none"
                    />
                  </button>
                </div>
                {formStatus.errors && formStatus.errors.password && (
                  <div>
                    {formData.password.length < 1 ? (
                      <p className="text-red-600">Password is required.</p>
                    ) : (
                      formStatus.errors.password.map((err: string, index: number) => (
                        <p key={index} className="text-red-600">{err}</p>
                      ))
                    )}
                  </div>
                )}
              </div>
              <footer className="flex items-center justify-center gap-4 w-full">
                <button
                  className="mt-2 py-4 px-8 flex items-center justify-center gap-2 border border-black bg-zinc-950 text-white rounded w-full h-auto max-h-[56px] hover:bg-zinc-900 duration-300"
                  onClick={(e: any) => {
                    if (tab === "login") {
                      handleSignIn(e);
                    } else {
                      handleSignUp(e);
                    }
                  }}
                  disabled={loading || user}
                >
                  {tab === "login" ?
                    "Sign In" :
                    "Create Account"
                  }
                </button>
              </footer>
              <p
                className="text-center text-zinc-500 cursor-pointer hover:underline"
                onClick={() => handleTabChange(tab === "login" ? "register" : "login")}
              >
                {tab === "login" ? "Don't have an account? Create one." : "Already have an account? Sign in."}
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
                <button
                  className="group w-full flex items-center justify-center gap-4 border border-red-600 hover:bg-red-600 text-red-600 hover:text-white p-4 rounded duration-300 cursor-pointer disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-red-600 disabled:cursor-not-allowed"
                  onClick={() => handleSignIn("google")}
                  disabled={loading || user}
                >
                  <GoogleLogo
                    className="fill-red-600 group-hover:fill-white group-disabled:group-hover:fill-red-600 duration-300 w-6 h-6"
                    removeDefaultClasses
                  />
                  <p>Login with <strong>Google</strong></p>
                </button>
                <button
                  className="group w-full flex items-center justify-center gap-4 border border-zinc-950 hover:bg-zinc-950 text-zinc-950 hover:text-white p-4 rounded duration-300 cursor-pointer disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-950 disabled:cursor-not-allowed"
                  onClick={() => handleSignIn("github")}
                  disabled={loading || user}
                >
                  <GitHubLogo
                    className="fill-zinc-950 group-hover:fill-white group-disabled:group-hover:fill-zinc-950 duration-300 w-6 h-6"
                    removeDefaultClasses
                  />
                  <p>Login with <strong>GitHub</strong></p>
                </button>
              </div>
              {tab === "login" ? (
                <a
                  className="text-center text-zinc-500 cursor-pointer hover:underline max-lg:pb-4"
                >
                  Forgot your password?
                </a>
              ) : (
                <a
                  className="text-center text-zinc-500 cursor-pointer hover:underline max-lg:pb-4"
                >
                  Login without an account.
                </a>
              )}
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Homepage;
