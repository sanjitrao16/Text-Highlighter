export class Highlight {
  constructor(
    text,
    color,
    url,
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
    container
  ) {
    this.id = Highlight.generateId();
    this.text = text;
    this.color = color;
    this.url = url;
    this.anchorNode = anchorNode;
    this.anchorOffset = anchorOffset;
    this.focusNode = focusNode;
    this.focusOffset = focusOffset;
    this.container = container;
    this.timestamp = Date.now();
  }

  static generateId() {
    return "highlight-" + Date.now() + Math.floor(Math.random() * 1000);
  }
}
