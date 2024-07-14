import SearchResultsList from "./components/search-results-list";
import SearchBar from "@/components/common/search-bar";

const ClientSearchPage = () => {
  return (
    <>
      <SearchBar search />
      <div className="space-y-8 p-8">
        <SearchResultsList />
      </div>
    </>
  );
};

export default ClientSearchPage;
