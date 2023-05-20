
export default async function ProfilesController({  }) {
  
  return {
    "/": async (req, res, next) => {
      return res.send("OK");
    },
  }
}
