const express = require('express');
const multer = require('multer');
const Book = require('../model/bookSchema.js');
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // store files in 'uploads/' folder
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // unique file name
    }
});

const upload = multer({ storage: storage });

// Post route to create a book
router.post('/create', (req, res) => {
    upload.single('pdf')(req, res, function (err) {
        // Handle multer errors
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: 'Multer error: ' + err.message });
        } else if (err) {
            return res.status(500).json({ message: 'Unknown error: ' + err.message });
        }

        // Check if file is uploaded
        console.log(req.file);  // Logs the file details to the console
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Extract data from req.body
        const { image, title, author, description, price, amazonLink } = req.body;
        const pdf = req.file.path;  // Store the file path in the database

        // Create the new book
        try {
            const newBook = new Book({
                image,
                title,
                author,
                description,
                price,
                amazonLink,
                pdf
            });
            newBook.save();  // Save the new book to the database
            res.status(200).json({ message: 'Book created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    });
});
router.get("/all",async(req,res)=>{
    try{
        const books=await Book.find();
        res.status(200).json(books);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
});

//get a book by specific id
router.get('/:id',async(req,res)=>{
    const{id}=req.params;
    try{
        const book=await Book.findById(id);
        if(!book){
            return res.status(404).json({message:'Book not found'});
        }
        res.status(200).json(book);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server error'});
    }
});

module.exports = router;
