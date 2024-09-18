// Function to print the welcome banner
export function welcomeBanner({ host, port }) {
  cambusa.log.info(`----------------------
************************************************************
*                                                          *
*                    Welcome to Cambusa 🚣                 *
*           Your modern framework for smooth sailing       *
*                                                          *
*                  Running at ${host}:${port}                 *
*                                                          *
************************************************************`);
}

export default welcomeBanner;
