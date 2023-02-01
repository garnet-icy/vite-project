import axios from "axios";
axios
  .request({
    method: "post",
    url: "/upload",
    data
  })
  .then((response) => {
    console.log(response);
  });
export default axiosRequest;
