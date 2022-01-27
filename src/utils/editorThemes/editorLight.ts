import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { HighlightStyle, tags as t } from "@codemirror/highlight";

const cssVar = (cssVariable: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(
    cssVariable
  );
};

// Basic colors
const yellow = "#ff9c66",
  red = "#f4154c",
  cyan = "#097bd3",
  blue = cssVar("--color-secondary-default"),
  green = "#14a378",
  orange = cssVar("--color-primary-default"),
  violet = "#c678dd",
  gray = cssVar("--color-foreground-dimmer"),
  grayStronger = cssVar("--color-foreground-dimmest");

// Specialized colors
const invalid = "#ffffff",
  darkBackground = cssVar("--color-background-higher"),
  highlightBackground = cssVar("--color-background-highest"),
  background = cssVar("--color-background-default"),
  tooltipBackground = "#353a42",
  selection = cssVar("--color-background-highest"),
  cursor = cssVar("--color-secondary-default");

export const editorLightTheme = EditorView.theme(
  {
    "&": {
      color: gray,
      backgroundColor: background,
      height: "auto",
    },

    ".cm-content": {
      caretColor: cursor,
    },

    ".cm-scroller": { overflow: "auto" },

    ".cm-cursor, .cm-dropCursor": { borderLeftColor: cursor },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: selection },

    ".cm-panels": { backgroundColor: darkBackground, color: gray },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    ".cm-searchMatch": {
      backgroundColor: "#72a1ff59",
      outline: "1px solid #457dff",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#6199ff2f",
    },

    ".cm-activeLine": { backgroundColor: highlightBackground },
    ".cm-selectionMatch": { backgroundColor: "#aafe661a" },

    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: "#bad0f847",
      outline: "1px solid #515a6b",
    },

    ".cm-gutters": {
      backgroundColor: background,
      color: grayStronger,
      border: "none",
    },

    ".cm-activeLineGutter": {
      backgroundColor: highlightBackground,
    },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#ddd",
    },

    ".cm-tooltip": {
      border: "none",
      backgroundColor: tooltipBackground,
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: highlightBackground,
        color: gray,
      },
    },

    "&.cm-focused": {
      outline: "none !important",
    },
  },
  { dark: false }
);

/// The highlighting style for code in the One Dark theme.
export const editorLightHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: violet },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: red,
  },
  { tag: [t.function(t.variableName), t.labelName], color: blue },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: orange },
  { tag: [t.definition(t.name), t.separator], color: gray },
  {
    tag: [
      t.typeName,
      t.className,
      t.number,
      t.changed,
      t.annotation,
      t.modifier,
      t.self,
      t.namespace,
    ],
    color: yellow,
  },
  {
    tag: [
      t.operator,
      t.operatorKeyword,
      t.url,
      t.escape,
      t.regexp,
      t.link,
      t.special(t.string),
    ],
    color: cyan,
  },
  { tag: [t.meta, t.comment], color: grayStronger },
  { tag: t.strong, fontWeight: "bold" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: t.link, color: grayStronger, textDecoration: "underline" },
  { tag: t.heading, fontWeight: "bold", color: red },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: orange },
  { tag: [t.processingInstruction, t.string, t.inserted], color: green },
  { tag: t.invalid, color: invalid },
]);

export const editorLight: Extension = [
  editorLightTheme,
  editorLightHighlightStyle,
];
