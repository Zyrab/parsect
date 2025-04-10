const displayJSON = (container, json) => {
  container.textContent = JSON.stringify(json, null, 2);
};
export default displayJSON;
