// Function to print the welcome banner
export function welcomeBanner({ host, port }) {
  console.log(`
************************************************************
*                                                          *
*                    Welcome to Cambusa 🚣                 *
*           Your modern framework for smooth sailing       *
*                                                          *
*                  Running at ${host}:${port}                 *
*                                                          *
************************************************************
  `.trim());
}

export default welcomeBanner;
