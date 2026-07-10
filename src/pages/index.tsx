import type { NextPage } from 'next';
import Header from "../components/Header"
import AirdropForm from '../components/AirdropForm';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#050816]">
            <Header />

            <main className="px-6 py-12">
                <AirdropForm />
            </main>
        </div>
  );
};

export default Home;
