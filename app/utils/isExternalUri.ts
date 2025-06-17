// It will be available as randomEntry() (camelCase of file name without extension)
export default (uri: string) => {
  return /^(http|https):\/\//.test(uri);
};
