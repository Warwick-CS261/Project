module.exports = {

  /**
   * Searches the response for the token
   * @param {String} res response from the server 
   */
  handleToken: function handleToken(res){
    let tokenLength = 32;
    let index = res.toString().indexOf("token=");
    if (index === -1){
      console.log("No token found");
      return null;
    }
    let token = res.substring(index+6,index+6+tokenLength);
    return token;
  },

  handleError: function handleError(res){
    let index = res.toString().indexOf("error=");
    if (index === -1){
      return null;
    }
    let error = res.substring(index+6)
    return error;
  },

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
    } catch (error) {
      console.log(error);
      return null;
    }
    return json;
  }
}
