export default interface TabInfo {
  index: number;
  url: string;
  title: string;
  focused: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
};
