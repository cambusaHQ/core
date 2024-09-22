/**
 * Function to print the welcome banner for Cambusa
 *
 * This function generates and logs a visually appealing welcome message
 * that displays the Cambusa version and the server's running address.
 *
 * @param {Object} options - The options object
 * @param {string} options.host - The host address where the server is running
 * @param {number} options.port - The port number on which the server is listening
 */
export function welcomeBanner({ host, port }) {
  cambusa.log.info(`----------------------
************************************************************
*                                                          *
*               Welcome to Cambusa v${cambusa.version} 🚣               *
*           Your modern framework for smooth sailing       *
*                                                          *
*                  Running at ${host}:${port}                 *
*                                                          *
************************************************************`);
}

// Export the welcomeBanner function as the default export
export default welcomeBanner;
