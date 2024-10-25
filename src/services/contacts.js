import contactCollection from "../db/models/Contact.js";


export const getMovies = () => contactCollection.find();

export const getMovieById = (id) => contactCollection.findById(id);



//mongodb+srv://Taisiia:<db_password>@cluster0.kf5ge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


//dxEzBtDOmUbD1i1K
