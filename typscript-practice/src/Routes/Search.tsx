import { useLocation } from "react-router";

function Search() {
  const location = useLocation(); //url을 가져와서
  const keyword = new URLSearchParams(location.search).get("keyword"); //키워드를 뜯어와서
  console.log(location, keyword); //출력해봅시당
  return null;
}
export default Search;