
export default async function AccountController({  }) {
  
  return {
    "/": async (req, res, next) => {
      return res.send("OK");
    },
  }
}
