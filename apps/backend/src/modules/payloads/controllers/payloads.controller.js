
export default async function PayloadsController({  }) {
  
  return {
    "/": async (req, res, next) => {
      return res.send("OK");
    },
  }
}
