import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import MonacoEditorWithTabs, { EditorInstance } from "../components/CodeEditor";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [generatedFormCode, setGeneratedFormCode] = useState<EditorInstance[]>(
    []
  );

  const [userInput, setUserInput] = useState<String>(
    "Create me a form that captures users firstname, lastname and email. On the second page capture the email and profession."
  );

  const generateFormCode = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const response = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userInput: userInput,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const generatedCode = await response.json();

    setGeneratedFormCode(generatedCode);
    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Form Wizard Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <p className="border rounded-2xl py-1 px-4 text-slate-500 text-sm mb-5 hover:scale-105 transition duration-300 ease-in-out">
          shadcn + zod + zustand + react-hook-form
        </p>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your Multi-Page Form form in seconds
        </h1>

        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Drop in your form requirements and let the AI do the heavy
              lifting. Be as detailed as possible how many pages you want and
              what information a page should capture.
            </p>
          </div>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "Create me a form that captures users firstname, lastname and email. On the second page capture the email and profession. On the third page capture the profession and"
            }
          />

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateFormCode(e)}
            >
              Generate your multi-step form &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />

        <div className="py-2 mt-8 flex space-y-4 w-full">
          <MonacoEditorWithTabs />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
