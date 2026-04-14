function ConditionsRenderer(elements) {
  this.bodyElement = elements.bodyElement
}
ConditionsRenderer.prototype.render = function(data) {

  if (data.dark) this.bodyElement.className = "dark";
  // return {};
};