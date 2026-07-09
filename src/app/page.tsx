import LangProvider from "./components/LangProvider";
import PageContent from "./components/PageContent";

export default function Home() {
  return (
    <LangProvider>
      <PageContent />
    </LangProvider>
  );
}
