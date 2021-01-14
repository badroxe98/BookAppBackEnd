exports.userSignupValidator = (req,res, next) =>{
    req.check('name','Le nom est obligatoire').notEmpty();
    req.check('email','Email doit etre entre 3 to 32 caractèrs')
        .matches(/.+\@.+\..+/)
        .withMessage('Email doit contenir @')
        .isLength({
            max:32,
            min:4
        });
    req.check('password','Le mot de passe est obligatoire').notEmpty();
    req.check('password')
        .isLength({min:6})
        .withMessage('Le mot de passe doit contenir au moins 6 caractères')
        .matches(/\d/)
        .withMessage('Le mot de passe doit contenir un nombre');

        const errors = req.validationErrors();
    if(errors){
        const firtError = errors.map(error => error.msg)[0];
        return res.status(400).json({error:firtError});
    }
        next();
};
