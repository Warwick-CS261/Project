module.exports = {

  /**
   * Returns the JSON object received from the server
   * @param {String} data response from the server
   */
  handleJSON: function handleJSON(data){
    let start = data.toString().indexOf("{");
    let end = data.toString().lastIndexOf("}");
    if (start === -1 || end === -1){
      return null;
    }
    try {
      let json = JSON.parse(data.slice(start, end+1));
      return json;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
