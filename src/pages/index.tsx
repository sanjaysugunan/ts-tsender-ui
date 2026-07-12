import Head from "next/head";
import type { NextPage } from "next";
import Header from "../components/Header";
import HomeContent from "../components/HomeContent";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>TSender</title>
        <meta
          name="description"
          content="Batch ERC-20 token airdrop application"
        />
      </Head>

      <div className="min-h-screen bg-[#050816]">
        <Header />
        <main className="px-6 py-12">
          <HomeContent />
        </main>
      </div>
    </>
  );
};

export default Home;