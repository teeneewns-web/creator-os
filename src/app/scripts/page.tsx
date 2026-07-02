import ContentLibraryPage from "../../components/content/ContentLibraryPage";
import { contentLibraries } from "../../data/content/contentLibraries";

export default function ScriptsPage() {
  return <ContentLibraryPage library={contentLibraries.scripts} />;
}