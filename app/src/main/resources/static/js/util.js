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
  }
}
