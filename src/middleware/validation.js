
export const validation = (schema) => {
    
    return (req,res,next) => {
        let validationErrors = [];
        for (const key of Object.keys(schema)) {
            const validationResult = schema[key].validate(req[key],{abortEarly: false})//Another way of accessing data inside objects, other than dot notation           
        if (validationResult?.error) {
            validationErrors.push(validationResult.error.details)
        }
        }
        if(validationErrors.length > 0) {
            return res.status(400).json({msg:"Validation Error...", error: validationErrors})
            
        }
        next();
}
}
