/** @module utils  - utils used across whole project  */

export const utils = (() => {

  return {

  /**
    * Format Unix timestamp to time(h:m:s) format.
    * @param {number} timeStamp - Unix timestamp.
    * @return {string} Time in h:i:s format.
    */
    formatTime: (timeStamp) => {
      let date = new Date(timeStamp * 1000); // convert to secconds from milliseconds
      let hours = date.getHours();
      let minutes = "0" + date.getMinutes();
      let seconds = "0" + date.getSeconds();
      let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

      return formattedTime;
    }

  };
})();
