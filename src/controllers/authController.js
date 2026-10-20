export const insertNewUser = (req, res, next) => {
  try {
    //to do signup process
    createNewUser();

    res.json({
      status: "success",
      message: "TODO Signup",
    });
  } catch (error) {
    console.log(error);
  }
};
