//  POST /api/return {customerId, movieId}

//  Return 401 if the client is not logged in
//  Return 400 if the customerId is not provided
//  Return 400 if the movieId is not provided
//  Return 404 if no rental found for the customer/movie
//  Return 400 if the rental is already processed.
//  Return 200 if it is a valid request
//  Set the return date
//  Calculate the rental fee
//  Increase the stock
//  Return the rental