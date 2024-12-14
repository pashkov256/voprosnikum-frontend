const isValidURL = (url:string) => {
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]{1,5})?(\/[^\s]*)?$/i;
    return urlPattern.test(url);
};

export default isValidURL
