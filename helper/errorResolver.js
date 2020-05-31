var errorResolver = (err, req, res, next, filename, lineno) => {
    console.log("********************** ERROR ************************************");
    console.log("FILE NAME    : " + filename);
    console.log("LINE NO      : " + lineno);
    console.log("ERROR OBJECT : " + err);
    console.log("****************************************************************");
    //req.session.sid = undefined;
    //req.session.email = undefined;
    res.end("Unexpected Error");
};

module.exports = errorResolver;