export default () => {
  var apis = localStorage.getItem("apis");
  return JSON.parse(apis).root;
};
