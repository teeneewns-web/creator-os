import ContentLibraryPage from "../../components/content/ContentLibraryPage";
import { contentLibraries } from "../../data/content/contentLibraries";

export default function CtaPage() {
  return <ContentLibraryPage library={contentLibraries.cta} />;
}