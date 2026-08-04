import Header from "@/components/Header";
import WelcomeCard from "@/components/WelcomeCard";
import InfoCards from "@/components/InfoCards";

export default function Dashboard() {
  return (
    <div className="bg-success-50 min-h-screen font-cairo" dir="rtl">
      <Header />
      <main className="p-6 max-w-5xl mx-auto py-12">
        <WelcomeCard />
        <InfoCards />
      </main>
    </div>
  );
}
