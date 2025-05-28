import {
  initializeHighlighter,
  initializeRemoveHighlighter,
} from "./highlight/index.js";

import { loadAllHighlights } from "./storage/loadhighlights.js";

function initialize() {
  initializeHighlighter();
  initializeRemoveHighlighter();
  loadAllHighlights();
}
export { initialize };
