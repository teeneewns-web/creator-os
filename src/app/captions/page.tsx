import ContentLibraryPage from "../../components/content/ContentLibraryPage";
import { contentLibraries } from "../../data/content/contentLibraries";

export default function CaptionsPage() {
  return <ContentLibraryPage library={contentLibraries.captions} />;
}